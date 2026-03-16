package com.resumebuilder.service;

import com.resumebuilder.dto.ATSDTO;
import com.resumebuilder.model.Resume;
import com.resumebuilder.util.RoleData;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ResumeService resumeService;

    public RecommendationService(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    public ATSDTO.RecommendationResponse getRecommendations(Long resumeId, String userEmail) {
        Resume resume = resumeService.getResumeEntityById(resumeId, userEmail);
        
        String targetRole = resume.getTargetRole() != null ? resume.getTargetRole() : "Software Engineer";
        
        // Get skill recommendations
        List<ATSDTO.SkillRecommendation> skillRecommendations = generateSkillRecommendations(resume, targetRole);
        
        // Get content improvements
        List<String> contentImprovements = generateContentImprovements(resume);
        
        // Get format suggestions
        List<String> formatSuggestions = generateFormatSuggestions(resume);

        return ATSDTO.RecommendationResponse.builder()
                .resumeId(resumeId)
                .targetRole(targetRole)
                .skillRecommendations(skillRecommendations)
                .contentImprovements(contentImprovements)
                .formatSuggestions(formatSuggestions)
                .build();
    }

    private List<ATSDTO.SkillRecommendation> generateSkillRecommendations(Resume resume, String targetRole) {
        List<ATSDTO.SkillRecommendation> recommendations = new ArrayList<>();
        List<String> roleSkills = RoleData.getSkillsForRole(targetRole);
        String resumeSkills = resume.getSkills() != null ? resume.getSkills().toLowerCase() : "";
        String resumeContent = buildResumeContent(resume).toLowerCase();

        int count = 0;
        for (String skill : roleSkills) {
            if (!containsKeyword(resumeContent, skill)) {
                String priority = count < 5 ? "HIGH" : (count < 10 ? "MEDIUM" : "LOW");
                String reason = getSkillReason(skill, targetRole);
                
                ATSDTO.SkillRecommendation rec = new ATSDTO.SkillRecommendation(skill, priority, reason);
                recommendations.add(rec);
                count++;
                
                if (count >= 10) break;
            }
        }

        return recommendations;
    }

    private String getSkillReason(String skill, String targetRole) {
        String lowerSkill = skill.toLowerCase();
        
        if (lowerSkill.contains("java") || lowerSkill.contains("python") || 
            lowerSkill.contains("javascript") || lowerSkill.contains("typescript")) {
            return "Core programming language frequently required for " + targetRole + " positions";
        }
        
        if (lowerSkill.contains("react") || lowerSkill.contains("angular") || 
            lowerSkill.contains("vue") || lowerSkill.contains("node")) {
            return "Popular framework/library with high demand in the job market";
        }
        
        if (lowerSkill.contains("aws") || lowerSkill.contains("azure") || 
            lowerSkill.contains("gcp") || lowerSkill.contains("cloud")) {
            return "Cloud skills are increasingly essential for modern development roles";
        }
        
        if (lowerSkill.contains("docker") || lowerSkill.contains("kubernetes") || 
            lowerSkill.contains("ci/cd")) {
            return "DevOps skill that demonstrates modern development practices";
        }
        
        if (lowerSkill.contains("sql") || lowerSkill.contains("mongo") || 
            lowerSkill.contains("database") || lowerSkill.contains("redis")) {
            return "Database knowledge is fundamental for most technical roles";
        }
        
        if (lowerSkill.contains("git") || lowerSkill.contains("agile") || 
            lowerSkill.contains("scrum")) {
            return "Essential collaboration skill expected in most tech teams";
        }
        
        return "Commonly requested skill for " + targetRole + " roles";
    }

    private List<String> generateContentImprovements(Resume resume) {
        List<String> improvements = new ArrayList<>();

        // Summary improvements
        if (resume.getSummary() == null || resume.getSummary().isEmpty()) {
            improvements.add("Add a professional summary to give recruiters a quick overview of your qualifications");
        } else if (resume.getSummary().split("\\s+").length < 30) {
            improvements.add("Expand your professional summary to include key achievements and career highlights");
        } else if (!resume.getSummary().toLowerCase().contains("year")) {
            improvements.add("Include years of experience in your summary to quickly convey your seniority level");
        }

        // Experience improvements
        if (resume.getExperience() == null || resume.getExperience().isEmpty()) {
            improvements.add("Add work experience with specific accomplishments and responsibilities");
        } else {
            String experience = resume.getExperience().toLowerCase();
            if (!experience.matches(".*\\d+%.*") && !experience.matches(".*\\$\\d+.*") && 
                !experience.matches(".*\\d+x.*")) {
                improvements.add("Add quantifiable achievements (e.g., 'increased sales by 25%', 'reduced load time by 40%')");
            }
            if (!experience.contains("led") && !experience.contains("managed") && 
                !experience.contains("coordinated")) {
                improvements.add("Include leadership activities or team collaboration examples");
            }
        }

        // Skills improvements
        if (resume.getSkills() == null || resume.getSkills().isEmpty()) {
            improvements.add("Add a comprehensive skills section with both technical and soft skills");
        } else {
            String[] skillList = resume.getSkills().split("[,;|]");
            if (skillList.length < 8) {
                improvements.add("Expand your skills section to include at least 8-10 relevant skills");
            }
        }

        // Education improvements
        if (resume.getEducation() == null || resume.getEducation().isEmpty()) {
            improvements.add("Add your educational background including degrees and relevant coursework");
        }

        // Projects improvements
        if (resume.getProjects() == null || resume.getProjects().isEmpty()) {
            improvements.add("Include personal or professional projects to demonstrate hands-on experience");
        }

        // Certifications
        if (resume.getCertifications() == null || resume.getCertifications().isEmpty()) {
            improvements.add("Consider adding industry certifications to validate your expertise");
        }

        return improvements;
    }

    private List<String> generateFormatSuggestions(Resume resume) {
        List<String> suggestions = new ArrayList<>();

        suggestions.add("Use a clean, ATS-friendly format without tables, graphics, or complex formatting");
        suggestions.add("Ensure consistent formatting for dates (e.g., 'Jan 2020 - Present' or '01/2020 - Present')");
        suggestions.add("Use standard section headings like 'Experience', 'Education', 'Skills' for better ATS parsing");
        
        if (resume.getExperience() != null) {
            if (!resume.getExperience().contains("•") && !resume.getExperience().contains("-")) {
                suggestions.add("Use bullet points to list responsibilities and achievements for better readability");
            }
        }

        suggestions.add("Keep resume length to 1-2 pages for optimal recruiter engagement");
        suggestions.add("Use keywords from the job description naturally throughout your resume");
        suggestions.add("Start bullet points with strong action verbs (e.g., 'Developed', 'Implemented', 'Led')");

        return suggestions.stream().limit(5).collect(Collectors.toList());
    }

    private String buildResumeContent(Resume resume) {
        StringBuilder content = new StringBuilder();
        if (resume.getSummary() != null) content.append(resume.getSummary()).append(" ");
        if (resume.getSkills() != null) content.append(resume.getSkills()).append(" ");
        if (resume.getExperience() != null) content.append(resume.getExperience()).append(" ");
        if (resume.getEducation() != null) content.append(resume.getEducation()).append(" ");
        if (resume.getCertifications() != null) content.append(resume.getCertifications()).append(" ");
        if (resume.getProjects() != null) content.append(resume.getProjects()).append(" ");
        return content.toString();
    }

    private boolean containsKeyword(String content, String keyword) {
        String pattern = "\\b" + Pattern.quote(keyword.toLowerCase()) + "\\b";
        return Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(content).find();
    }
}
