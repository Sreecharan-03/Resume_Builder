package com.resumebuilder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumebuilder.dto.ATSDTO;
import com.resumebuilder.model.ATSResult;
import com.resumebuilder.model.Resume;
import com.resumebuilder.repository.ATSResultRepository;
import com.resumebuilder.util.RoleData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ATSService {

    private static final Logger logger = LoggerFactory.getLogger(ATSService.class);

    private final ATSResultRepository atsResultRepository;
    private final ResumeService resumeService;
    private final OpenAIService openAIService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ATSService(ATSResultRepository atsResultRepository, ResumeService resumeService, OpenAIService openAIService) {
        this.atsResultRepository = atsResultRepository;
        this.resumeService = resumeService;
        this.openAIService = openAIService;
    }

    /**
     * Main AI-assisted ATS analysis method
     */
    @Transactional
    public ATSDTO.AnalysisResponse analyzeResume(Long resumeId, String jobDescription, String userEmail) {
        return analyzeResumeWithPhase(resumeId, jobDescription, "PHASE3", null, true, null, userEmail);
    }

    /**
     * Phase-aware AI-assisted ATS analysis
     */
    @Transactional
    public ATSDTO.AnalysisResponse analyzeResumeWithPhase(Long resumeId, String jobDescription, 
            String phase, String targetRole, boolean useAI, List<String> templateSections, String userEmail) {
        
        Resume resume = resumeService.getResumeEntityById(resumeId, userEmail);
        String resumeContent = buildResumeContent(resume);
        String effectiveRole = targetRole != null ? targetRole : resume.getTargetRole();
        String effectivePhase = phase != null ? phase : "PHASE3";
        
        ATSDTO.AnalysisResponse response;
        
        if (useAI) {
            // AI-assisted analysis
            response = performAIAnalysis(resume, resumeContent, effectiveRole, effectivePhase, jobDescription, templateSections);
        } else {
            // Rule-based fallback analysis
            response = performRuleBasedAnalysis(resume, resumeContent, effectiveRole, effectivePhase, jobDescription);
        }
        
        // Save ATS result to database
        saveATSResult(resume, response, effectivePhase, effectiveRole, jobDescription, useAI);
        
        // Update resume ATS score
        resumeService.updateAtsScore(resumeId, response.getOverallScore());
        
        return response;
    }

    /**
     * AI-Only ATS Analysis - Pure AI Prediction
     */
    @SuppressWarnings("unchecked")
    private ATSDTO.AnalysisResponse performAIAnalysis(Resume resume, String resumeContent, 
            String targetRole, String phase, String jobDescription, List<String> templateSections) {
        
        logger.info("Performing AI-only ATS analysis for resume {} in {}", resume.getId(), phase);
        
        try {
            // Call Hugging Face AI for pure ATS prediction
            Map<String, Object> aiResult = openAIService.analyzeResumeATS(resumeContent, targetRole, phase, jobDescription, templateSections);
            
            // Extract AI-predicted scores (no rule-based calculation)
            int skillsMatchScore = ((Number) aiResult.getOrDefault("skills_match_score", 50)).intValue();
            int projectRelevanceScore = ((Number) aiResult.getOrDefault("project_relevance_score", 50)).intValue();
            int keywordMatchScore = ((Number) aiResult.getOrDefault("keyword_match_score", 50)).intValue();
            int formattingScore = ((Number) aiResult.getOrDefault("formatting_score", 60)).intValue();
            int aiOverallScore = ((Number) aiResult.getOrDefault("overall_ats_score", 50)).intValue();
            
            // Get AI-detected keywords and suggestions
            List<String> missingSkills = (List<String>) aiResult.getOrDefault("missing_skills", new ArrayList<>());
            List<String> matchedKeywords = (List<String>) aiResult.getOrDefault("matched_keywords", new ArrayList<>());
            List<String> improvementSuggestions = (List<String>) aiResult.getOrDefault("improvement_suggestions", new ArrayList<>());
            String aiFeedback = (String) aiResult.getOrDefault("ai_feedback", "AI analysis completed.");
            
            // Use AI score directly as final score (100% AI prediction)
            int finalScore = Math.min(100, Math.max(0, aiOverallScore));
            
            // Get section scores for display purposes only (not used in scoring)
            Map<String, Integer> sectionScores = new HashMap<>();
            sectionScores.put("skills_match", skillsMatchScore);
            sectionScores.put("project_relevance", projectRelevanceScore);
            sectionScores.put("keyword_match", keywordMatchScore);
            sectionScores.put("formatting", formattingScore);
            
            // Use only AI-generated recommendations
            List<String> recommendations = improvementSuggestions != null && !improvementSuggestions.isEmpty() 
                    ? improvementSuggestions 
                    : Arrays.asList("Focus on adding more relevant skills and keywords to improve your ATS score.");
            
            // Determine status based on AI score
            String status = getScoreStatus(finalScore);
            
            // Generate summary
            String summary = generateSummary(finalScore, matchedKeywords.size(), missingSkills.size(), phase);
            
            return ATSDTO.AnalysisResponse.builder()
                    .resumeId(resume.getId())
                    .overallScore(finalScore)
                    .skillsMatchScore(skillsMatchScore)
                    .projectRelevanceScore(projectRelevanceScore)
                    .keywordMatchScore(keywordMatchScore)
                    .formattingScore(formattingScore)
                    .phase(phase)
                    .targetRole(targetRole)
                    .status(status)
                    .sectionScores(sectionScores)
                    .matchedKeywords(matchedKeywords)
                    .missingKeywords(missingSkills.stream().limit(15).collect(Collectors.toList()))
                    .recommendations(recommendations)
                    .improvementSuggestions(improvementSuggestions)
                    .aiFeedback(aiFeedback)
                    .summary(summary)
                    .isAiAnalyzed(true)
                    .analyzedAt(LocalDateTime.now())
                    .build();
                    
        } catch (Exception e) {
            logger.error("AI analysis failed, falling back to rule-based: {}", e.getMessage());
            return performRuleBasedAnalysis(resume, resumeContent, targetRole, phase, jobDescription);
        }
    }

    /**
     * Rule-based ATS Analysis (Fallback)
     */
    private ATSDTO.AnalysisResponse performRuleBasedAnalysis(Resume resume, String resumeContent,
            String targetRole, String phase, String jobDescription) {
        
        logger.info("Performing rule-based ATS analysis for resume {} in {}", resume.getId(), phase);
        
        // Get expected skills and keywords based on target role
        List<String> expectedSkills = RoleData.getSkillsForRole(targetRole);
        List<String> expectedKeywords = RoleData.getKeywordsForRole(targetRole);
        
        // Combine job description keywords if provided
        if (jobDescription != null && !jobDescription.isEmpty()) {
            List<String> jobKeywords = extractKeywordsFromJobDescription(jobDescription);
            expectedKeywords = new ArrayList<>(expectedKeywords);
            expectedKeywords.addAll(jobKeywords);
        }

        // Analyze matches
        List<String> matchedKeywords = new ArrayList<>();
        List<String> missingKeywords = new ArrayList<>();
        
        for (String skill : expectedSkills) {
            if (containsKeyword(resumeContent, skill)) {
                matchedKeywords.add(skill);
            } else {
                missingKeywords.add(skill);
            }
        }
        
        for (String keyword : expectedKeywords) {
            if (containsKeyword(resumeContent, keyword)) {
                if (!matchedKeywords.contains(keyword)) {
                    matchedKeywords.add(keyword);
                }
            } else {
                if (!missingKeywords.contains(keyword)) {
                    missingKeywords.add(keyword);
                }
            }
        }

        // Calculate section scores
        Map<String, Integer> sectionScores = calculateSectionScores(resume);
        
        // Calculate phase-specific scores
        int skillsMatchScore = calculateSkillsMatchScore(matchedKeywords.size(), 
                matchedKeywords.size() + missingKeywords.size());
        int projectRelevanceScore = calculateProjectRelevanceScore(resume, targetRole);
        int keywordMatchScore = skillsMatchScore;
        int formattingScore = calculateFormattingScore(resume);
        
        // Calculate overall score based on phase
        int overallScore = calculatePhaseSpecificScore(phase, sectionScores, skillsMatchScore, 
                projectRelevanceScore, formattingScore);
        
        // Generate recommendations
        List<String> recommendations = generateRecommendations(resume, missingKeywords, sectionScores);
        
        // Generate summary
        String summary = generateSummary(overallScore, matchedKeywords.size(), missingKeywords.size(), phase);
        
        // Determine status
        String status = getScoreStatus(overallScore);

        return ATSDTO.AnalysisResponse.builder()
                .resumeId(resume.getId())
                .overallScore(overallScore)
                .skillsMatchScore(skillsMatchScore)
                .projectRelevanceScore(projectRelevanceScore)
                .keywordMatchScore(keywordMatchScore)
                .formattingScore(formattingScore)
                .phase(phase)
                .targetRole(targetRole)
                .status(status)
                .sectionScores(sectionScores)
                .matchedKeywords(matchedKeywords)
                .missingKeywords(missingKeywords.stream().limit(15).collect(Collectors.toList()))
                .recommendations(recommendations)
                .improvementSuggestions(new ArrayList<>())
                .aiFeedback("Analysis performed using rule-based evaluation.")
                .summary(summary)
                .isAiAnalyzed(false)
                .analyzedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Get latest ATS result for a resume
     */
    public ATSDTO.AnalysisResponse getLatestResult(Long resumeId, String userEmail) {
        Resume resume = resumeService.getResumeEntityById(resumeId, userEmail);
        
        ATSResult result = atsResultRepository.findTopByResumeOrderByCreatedAtDesc(resume)
                .orElseThrow(() -> new IllegalArgumentException("No ATS analysis found for this resume"));

        return mapResultToResponse(result, resumeId);
    }

    // ==================== HELPER METHODS ====================

    private void saveATSResult(Resume resume, ATSDTO.AnalysisResponse response, 
            String phase, String targetRole, String jobDescription, boolean isAiAnalyzed) {
        
        ATSResult atsResult = ATSResult.builder()
                .resume(resume)
                .overallScore(response.getOverallScore())
                .skillsMatchScore(response.getSkillsMatchScore())
                .projectRelevanceScore(response.getProjectRelevanceScore())
                .keywordMatchScore(response.getKeywordMatchScore())
                .formattingScore(response.getFormattingScore())
                .phase(ATSResult.Phase.valueOf(phase))
                .sectionScores(mapToJson(response.getSectionScores()))
                .matchedKeywords(String.join(",", response.getMatchedKeywords()))
                .missingKeywords(String.join(",", response.getMissingKeywords()))
                .recommendations(String.join("|", response.getRecommendations()))
                .aiFeedback(response.getAiFeedback())
                .improvementSuggestions(response.getImprovementSuggestions() != null ? 
                        String.join("|", response.getImprovementSuggestions()) : "")
                .jobDescription(jobDescription)
                .targetRole(targetRole)
                .isAiAnalyzed(isAiAnalyzed)
                .build();
        
        atsResultRepository.save(atsResult);
    }

    /**
     * Build a human-readable resume content string for AI analysis.
     * Parses JSON-stored fields into plain text so the AI prompt is meaningful.
     */
    @SuppressWarnings("unchecked")
    private String buildResumeContent(Resume resume) {
        StringBuilder content = new StringBuilder();

        // Personal info
        appendIfNotNull(content, "Name: ", resume.getFullName());
        appendIfNotNull(content, "Email: ", resume.getEmail());
        appendIfNotNull(content, "Phone: ", resume.getPhone());
        appendIfNotNull(content, "Location: ", resume.getLocation());
        appendIfNotNull(content, "Target Role: ", resume.getTargetRole());
        appendIfNotNull(content, "Summary: ", resume.getSummary());

        // Skills - JSON array like ["Java","Python"]
        if (resume.getSkills() != null) {
            try {
                List<Object> skills = objectMapper.readValue(resume.getSkills(), List.class);
                content.append("Skills: ").append(String.join(", ", skills.stream()
                        .map(Object::toString).collect(Collectors.toList()))).append("\n");
            } catch (Exception e) {
                content.append("Skills: ").append(resume.getSkills()).append("\n");
            }
        }

        // Experience - JSON array of objects
        if (resume.getExperience() != null) {
            try {
                List<Map<String, Object>> experiences = objectMapper.readValue(resume.getExperience(), List.class);
                content.append("Experience:\n");
                for (Map<String, Object> exp : experiences) {
                    content.append("  - ")
                            .append(getStr(exp, "position")).append(" at ")
                            .append(getStr(exp, "company")).append(" (")
                            .append(getStr(exp, "startDate")).append(" - ")
                            .append(getStr(exp, "endDate")).append(")\n");
                    if (exp.containsKey("description"))
                        content.append("    ").append(getStr(exp, "description")).append("\n");
                }
            } catch (Exception e) {
                content.append("Experience: ").append(resume.getExperience()).append("\n");
            }
        }

        // Education
        if (resume.getEducation() != null) {
            try {
                List<Map<String, Object>> educations = objectMapper.readValue(resume.getEducation(), List.class);
                content.append("Education:\n");
                for (Map<String, Object> edu : educations) {
                    content.append("  - ")
                            .append(getStr(edu, "degree")).append(" in ")
                            .append(getStr(edu, "field")).append(" at ")
                            .append(getStr(edu, "institution"));
                    if (edu.containsKey("gpa") && !getStr(edu, "gpa").isEmpty())
                        content.append(" GPA: ").append(getStr(edu, "gpa"));
                    content.append("\n");
                }
            } catch (Exception e) {
                content.append("Education: ").append(resume.getEducation()).append("\n");
            }
        }

        // Projects
        if (resume.getProjects() != null) {
            try {
                List<Map<String, Object>> projects = objectMapper.readValue(resume.getProjects(), List.class);
                content.append("Projects:\n");
                for (Map<String, Object> proj : projects) {
                    content.append("  - ")
                            .append(getStr(proj, "name")).append(": ")
                            .append(getStr(proj, "description"));
                    if (proj.containsKey("technologies") && !getStr(proj, "technologies").isEmpty())
                        content.append(" (Tech: ").append(getStr(proj, "technologies")).append(")");
                    content.append("\n");
                }
            } catch (Exception e) {
                content.append("Projects: ").append(resume.getProjects()).append("\n");
            }
        }

        // Certifications
        if (resume.getCertifications() != null) {
            try {
                List<Map<String, Object>> certs = objectMapper.readValue(resume.getCertifications(), List.class);
                content.append("Certifications:\n");
                for (Map<String, Object> cert : certs) {
                    content.append("  - ")
                            .append(getStr(cert, "name")).append(" by ")
                            .append(getStr(cert, "issuer")).append("\n");
                }
            } catch (Exception e) {
                content.append("Certifications: ").append(resume.getCertifications()).append("\n");
            }
        }

        // Languages
        if (resume.getLanguages() != null) {
            try {
                List<Map<String, Object>> languages = objectMapper.readValue(resume.getLanguages(), List.class);
                if (!languages.isEmpty()) {
                    content.append("Languages: ");
                    content.append(languages.stream()
                            .map(l -> getStr(l, "language") + " (" + getStr(l, "proficiency") + ")")
                            .collect(Collectors.joining(", "))).append("\n");
                }
            } catch (Exception e) {
                content.append("Languages: ").append(resume.getLanguages()).append("\n");
            }
        }

        return content.toString();
    }

    private void appendIfNotNull(StringBuilder sb, String label, String value) {
        if (value != null && !value.isEmpty()) sb.append(label).append(value).append("\n");
    }

    private String getStr(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString() : "";
    }

    private boolean containsKeyword(String content, String keyword) {
        String pattern = "\\b" + Pattern.quote(keyword.toLowerCase()) + "\\b";
        return Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(content).find();
    }

    private List<String> extractKeywordsFromJobDescription(String jobDescription) {
        List<String> keywords = new ArrayList<>();
        String[] stopWords = {"the", "and", "or", "a", "an", "is", "are", "was", "were", "be", "been",
                "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
                "may", "might", "must", "shall", "for", "from", "to", "with", "in", "on", "at", "by",
                "about", "into", "through", "during", "before", "after", "above", "below", "between"};
        Set<String> stopWordSet = new HashSet<>(Arrays.asList(stopWords));

        String[] words = jobDescription.toLowerCase().split("\\W+");
        for (String word : words) {
            if (word.length() > 3 && !stopWordSet.contains(word) && !keywords.contains(word)) {
                keywords.add(word);
            }
        }
        return keywords.stream().limit(20).collect(Collectors.toList());
    }

    private Map<String, Integer> calculateSectionScores(Resume resume) {
        Map<String, Integer> scores = new HashMap<>();
        
        // Contact completeness (10 points each field)
        int contactScore = 0;
        if (resume.getFullName() != null && !resume.getFullName().isEmpty()) contactScore += 25;
        if (resume.getEmail() != null && !resume.getEmail().isEmpty()) contactScore += 25;
        if (resume.getPhone() != null && !resume.getPhone().isEmpty()) contactScore += 25;
        if (resume.getLocation() != null && !resume.getLocation().isEmpty()) contactScore += 25;
        scores.put("contact", contactScore);

        // Summary score
        int summaryScore = 0;
        if (resume.getSummary() != null) {
            int wordCount = resume.getSummary().split("\\s+").length;
            if (wordCount >= 50) summaryScore = 100;
            else if (wordCount >= 30) summaryScore = 75;
            else if (wordCount >= 15) summaryScore = 50;
            else if (wordCount > 0) summaryScore = 25;
        }
        scores.put("summary", summaryScore);

        // Skills score
        int skillsScore = 0;
        if (resume.getSkills() != null) {
            int skillCount = resume.getSkills().split("[,;|]").length;
            if (skillCount >= 10) skillsScore = 100;
            else if (skillCount >= 7) skillsScore = 80;
            else if (skillCount >= 5) skillsScore = 60;
            else if (skillCount >= 3) skillsScore = 40;
            else if (skillCount > 0) skillsScore = 20;
        }
        scores.put("skills", skillsScore);

        // Experience score
        int experienceScore = 0;
        if (resume.getExperience() != null) {
            int wordCount = resume.getExperience().split("\\s+").length;
            if (wordCount >= 150) experienceScore = 100;
            else if (wordCount >= 100) experienceScore = 80;
            else if (wordCount >= 50) experienceScore = 60;
            else if (wordCount > 0) experienceScore = 30;
        }
        scores.put("experience", experienceScore);

        // Education score
        int educationScore = 0;
        if (resume.getEducation() != null && !resume.getEducation().isEmpty()) {
            educationScore = resume.getEducation().length() > 50 ? 100 : 60;
        }
        scores.put("education", educationScore);

        // Projects score
        int projectsScore = 0;
        if (resume.getProjects() != null) {
            int wordCount = resume.getProjects().split("\\s+").length;
            if (wordCount >= 100) projectsScore = 100;
            else if (wordCount >= 50) projectsScore = 70;
            else if (wordCount > 0) projectsScore = 40;
        }
        scores.put("projects", projectsScore);

        return scores;
    }

    private int calculateSkillsMatchScore(int matched, int total) {
        if (total == 0) return 50;
        return (int) Math.round((double) matched / total * 100);
    }

    private int calculateProjectRelevanceScore(Resume resume, String targetRole) {
        if (resume.getProjects() == null || resume.getProjects().isEmpty()) return 0;
        
        List<String> roleKeywords = RoleData.getKeywordsForRole(targetRole);
        String projectsLower = resume.getProjects().toLowerCase();
        
        int matched = 0;
        for (String keyword : roleKeywords) {
            if (projectsLower.contains(keyword.toLowerCase())) {
                matched++;
            }
        }
        
        if (roleKeywords.isEmpty()) return 50;
        return Math.min(100, (int) Math.round((double) matched / roleKeywords.size() * 100) + 20);
    }

    private int calculateFormattingScore(Resume resume) {
        int score = 60; // Base score
        
        // Check for completeness
        if (resume.getSummary() != null && !resume.getSummary().isEmpty()) score += 10;
        if (resume.getSkills() != null && !resume.getSkills().isEmpty()) score += 10;
        if (resume.getExperience() != null && !resume.getExperience().isEmpty()) score += 10;
        if (resume.getProjects() != null && !resume.getProjects().isEmpty()) score += 10;
        
        return Math.min(100, score);
    }

    private int calculateRuleBasedScore(Resume resume, Map<String, Integer> sectionScores, 
            int matched, int total) {
        double keywordScore = total > 0 ? (double) matched / total * 100 : 50;
        double sectionAvg = sectionScores.values().stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(50);
        return (int) Math.round((keywordScore * 0.5) + (sectionAvg * 0.5));
    }

    private int calculatePhaseSpecificScore(String phase, Map<String, Integer> sectionScores,
            int skillsMatchScore, int projectRelevanceScore, int formattingScore) {
        
        switch (phase) {
            case "PHASE1":
                // Focus on completeness for Phase 1
                double sectionAvg = sectionScores.values().stream()
                        .mapToInt(Integer::intValue)
                        .average()
                        .orElse(50);
                return (int) Math.round((sectionAvg * 0.6) + (formattingScore * 0.4));
                
            case "PHASE2":
                // Focus on improvement potential for Phase 2
                return (int) Math.round(
                    (skillsMatchScore * 0.3) + 
                    (projectRelevanceScore * 0.3) + 
                    (formattingScore * 0.2) +
                    (sectionScores.getOrDefault("experience", 50) * 0.2)
                );
                
            case "PHASE3":
            default:
                // Focus on role match for Phase 3
                return (int) Math.round(
                    (skillsMatchScore * 0.4) + 
                    (projectRelevanceScore * 0.3) + 
                    (formattingScore * 0.1) +
                    (sectionScores.getOrDefault("skills", 50) * 0.2)
                );
        }
    }

    private List<String> generateRecommendations(Resume resume, List<String> missingKeywords, 
            Map<String, Integer> sectionScores) {
        List<String> recommendations = new ArrayList<>();

        if (sectionScores.getOrDefault("contact", 0) < 100) {
            recommendations.add("Complete all contact information fields for better ATS parsing");
        }

        if (sectionScores.getOrDefault("summary", 0) < 75) {
            recommendations.add("Expand your professional summary to 50+ words highlighting key achievements");
        }

        if (sectionScores.getOrDefault("skills", 0) < 80) {
            recommendations.add("Add more relevant technical skills to increase keyword matches");
        }

        if (sectionScores.getOrDefault("experience", 0) < 80) {
            recommendations.add("Provide more details in your work experience with quantifiable achievements");
        }

        if (sectionScores.getOrDefault("projects", 0) < 70) {
            recommendations.add("Add detailed project descriptions showcasing your technical abilities");
        }

        if (!missingKeywords.isEmpty()) {
            String topMissing = missingKeywords.stream().limit(5).collect(Collectors.joining(", "));
            recommendations.add("Consider adding these in-demand skills: " + topMissing);
        }

        if (resume.getCertifications() == null || resume.getCertifications().isEmpty()) {
            recommendations.add("Add relevant certifications to strengthen your profile");
        }

        return recommendations;
    }

    private List<String> generateCombinedRecommendations(Resume resume, List<String> missingSkills,
            Map<String, Integer> sectionScores, List<String> aiSuggestions) {
        
        List<String> combined = new ArrayList<>();
        
        // Add rule-based recommendations
        combined.addAll(generateRecommendations(resume, missingSkills, sectionScores));
        
        // Add unique AI suggestions
        for (String suggestion : aiSuggestions) {
            if (combined.stream().noneMatch(r -> r.toLowerCase().contains(suggestion.toLowerCase().substring(0, 
                    Math.min(20, suggestion.length()))))) {
                combined.add(suggestion);
            }
        }
        
        return combined.stream().limit(10).collect(Collectors.toList());
    }

    private String generateSummary(int score, int matched, int missing, String phase) {
        String grade = getScoreStatus(score);
        String phaseDescription;
        
        switch (phase) {
            case "PHASE1":
                phaseDescription = "Resume Completeness Analysis";
                break;
            case "PHASE2":
                phaseDescription = "Resume Improvement Analysis";
                break;
            case "PHASE3":
            default:
                phaseDescription = "Role-Based ATS Analysis";
                break;
        }

        return String.format("%s: Your resume scored %d/100 (%s). Found %d matching keywords with %d areas for improvement.",
                phaseDescription, score, grade, matched, missing);
    }

    private String getScoreStatus(int score) {
        if (score >= 85) return "EXCELLENT";
        if (score >= 70) return "GOOD";
        if (score >= 50) return "AVERAGE";
        return "POOR";
    }

    private String mapToJson(Map<String, Integer> map) {
        if (map == null) return "{}";
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            if (!first) json.append(",");
            json.append("\"").append(entry.getKey()).append("\":").append(entry.getValue());
            first = false;
        }
        json.append("}");
        return json.toString();
    }

    private ATSDTO.AnalysisResponse mapResultToResponse(ATSResult result, Long resumeId) {
        return ATSDTO.AnalysisResponse.builder()
                .resumeId(resumeId)
                .overallScore(result.getOverallScore() != null ? result.getOverallScore() : 0)
                .skillsMatchScore(result.getSkillsMatchScore() != null ? result.getSkillsMatchScore() : 0)
                .projectRelevanceScore(result.getProjectRelevanceScore() != null ? result.getProjectRelevanceScore() : 0)
                .keywordMatchScore(result.getKeywordMatchScore() != null ? result.getKeywordMatchScore() : 0)
                .formattingScore(result.getFormattingScore() != null ? result.getFormattingScore() : 0)
                .phase(result.getPhase() != null ? result.getPhase().name() : "PHASE3")
                .targetRole(result.getTargetRole())
                .status(getScoreStatus(result.getOverallScore() != null ? result.getOverallScore() : 0))
                .matchedKeywords(result.getMatchedKeywords() != null ? 
                        Arrays.asList(result.getMatchedKeywords().split(",")) : new ArrayList<>())
                .missingKeywords(result.getMissingKeywords() != null ? 
                        Arrays.asList(result.getMissingKeywords().split(",")) : new ArrayList<>())
                .recommendations(result.getRecommendations() != null ? 
                        Arrays.asList(result.getRecommendations().split("\\|")) : new ArrayList<>())
                .improvementSuggestions(result.getImprovementSuggestions() != null ?
                        Arrays.asList(result.getImprovementSuggestions().split("\\|")) : new ArrayList<>())
                .aiFeedback(result.getAiFeedback())
                .isAiAnalyzed(result.getIsAiAnalyzed() != null ? result.getIsAiAnalyzed() : false)
                .analyzedAt(result.getCreatedAt())
                .build();
    }
}
