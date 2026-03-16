package com.resumebuilder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

@Service
public class OpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);

    private WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${huggingface.api.key:}")
    private String apiKey;

    @Value("${huggingface.api.url:https://router.huggingface.co/v1}")
    private String apiUrl;

    @Value("${huggingface.model:Qwen2.5-7B-Instruct}")
    private String model;

    public OpenAIService() {
        this.objectMapper = new ObjectMapper();
    }

    private WebClient getWebClient() {
        if (this.webClient == null) {
            this.webClient = WebClient.builder()
                    .baseUrl(apiUrl)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build();
        }
        return this.webClient;
    }

    /**
     * Get skill suggestions for a target role based on current skills
     */
    public List<Map<String, String>> getSkillSuggestions(String targetRole, List<String> currentSkills) {
        String prompt = buildSkillSuggestionsPrompt(targetRole, currentSkills);
        String response = callOpenAI(prompt);
        return parseSkillSuggestions(response);
    }

    /**
     * Get project suggestions for a target role
     */
    public List<Map<String, String>> getProjectSuggestions(String targetRole, List<String> currentSkills) {
        String prompt = buildProjectSuggestionsPrompt(targetRole, currentSkills);
        String response = callOpenAI(prompt);
        return parseProjectSuggestions(response);
    }

    /**
     * Get resume improvement tips
     */
    public List<String> getImprovementTips(String targetRole, String currentResumeSummary) {
        String prompt = buildImprovementTipsPrompt(targetRole, currentResumeSummary);
        String response = callOpenAI(prompt);
        return parseImprovementTips(response);
    }

    /**
     * Get keyword suggestions for ATS optimization
     */
    public List<String> getKeywordSuggestions(String targetRole, String jobDescription) {
        String prompt = buildKeywordSuggestionsPrompt(targetRole, jobDescription);
        String response = callOpenAI(prompt);
        return parseKeywordSuggestions(response);
    }

    /**
     * Generate interview questions for a role
     */
    public List<Map<String, Object>> getInterviewQuestions(String targetRole, List<String> skills) {
        String prompt = buildInterviewQuestionsPrompt(targetRole, skills);
        String response = callOpenAI(prompt);
        return parseInterviewQuestions(response);
    }

    private String callOpenAI(String prompt) {
        try {
            if (apiKey == null || apiKey.isBlank()) {
                logger.warn("Hugging Face API key is not configured; using fallback responses.");
                return "{}";
            }

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "You are a professional career advisor and resume expert. Provide concise, actionable advice in JSON format.");
            messages.add(systemMessage);
            
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", prompt);
            messages.add(userMessage);
            
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 1500);

            String response = getWebClient().post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .onErrorResume(e -> {
                        logger.error("Hugging Face API call failed: {}", e.getMessage());
                        return Mono.just("{}");
                    })
                    .block();

            return extractContentFromResponse(response);
        } catch (Exception e) {
            logger.error("Error calling Hugging Face API: {}", e.getMessage());
            return "{}";
        }
    }

    private String extractContentFromResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                return choices.get(0).path("message").path("content").asText();
            }
        } catch (Exception e) {
            logger.error("Error parsing Hugging Face response: {}", e.getMessage());
        }
        return "{}";
    }

    private String buildSkillSuggestionsPrompt(String targetRole, List<String> currentSkills) {
        return String.format("""
            For a %s position, given the current skills: %s
            
            Suggest 5-8 additional skills they should learn. Return ONLY a JSON array with objects containing:
            - "skill": skill name
            - "priority": "HIGH", "MEDIUM", or "LOW"
            - "reason": why this skill is important (1 sentence)
            - "learningTime": estimated time to learn
            
            Example format:
            [{"skill": "Docker", "priority": "HIGH", "reason": "Essential for modern deployment", "learningTime": "2-3 weeks"}]
            """, targetRole, String.join(", ", currentSkills));
    }

    private String buildProjectSuggestionsPrompt(String targetRole, List<String> currentSkills) {
        return String.format("""
            For a %s position with skills in: %s
            
            Suggest 3-5 portfolio projects that would impress recruiters. Return ONLY a JSON array with objects containing:
            - "title": project title
            - "description": brief description (2-3 sentences)
            - "skills": array of skills demonstrated
            - "difficulty": "BEGINNER", "INTERMEDIATE", or "ADVANCED"
            - "estimatedTime": time to complete
            
            Example format:
            [{"title": "E-commerce API", "description": "RESTful API with authentication", "skills": ["Java", "Spring Boot"], "difficulty": "INTERMEDIATE", "estimatedTime": "2-3 weeks"}]
            """, targetRole, String.join(", ", currentSkills));
    }

    private String buildImprovementTipsPrompt(String targetRole, String resumeSummary) {
        return String.format("""
            For a %s position, given this resume summary: %s
            
            Provide 5-7 specific tips to improve the resume. Return ONLY a JSON array of strings.
            
            Example format:
            ["Add quantifiable achievements", "Include relevant certifications", "Use action verbs"]
            """, targetRole, resumeSummary != null ? resumeSummary : "No summary provided");
    }

    private String buildKeywordSuggestionsPrompt(String targetRole, String jobDescription) {
        return String.format("""
            For a %s position%s
            
            Suggest 10-15 ATS-friendly keywords. Return ONLY a JSON array of strings.
            
            Example format:
            ["microservices", "agile", "CI/CD", "REST API"]
            """, targetRole, 
            jobDescription != null ? " with this job description: " + jobDescription : "");
    }

    private String buildInterviewQuestionsPrompt(String targetRole, List<String> skills) {
        return String.format("""
            For a %s position with skills: %s
            
            Generate 8-10 interview questions. Return ONLY a JSON array with objects containing:
            - "question": the interview question
            - "category": "TECHNICAL", "BEHAVIORAL", or "SITUATIONAL"
            - "difficulty": "EASY", "MEDIUM", or "HARD"
            - "sampleAnswer": a brief sample answer (2-3 sentences)
            
            Example format:
            [{"question": "Explain REST principles", "category": "TECHNICAL", "difficulty": "MEDIUM", "sampleAnswer": "REST is..."}]
            """, targetRole, String.join(", ", skills));
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, String>> parseSkillSuggestions(String response) {
        try {
            // Clean response - remove markdown code blocks if present
            String cleanResponse = cleanJsonResponse(response);
            return objectMapper.readValue(cleanResponse, List.class);
        } catch (Exception e) {
            logger.error("Error parsing skill suggestions: {}", e.getMessage());
            return getDefaultSkillSuggestions();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, String>> parseProjectSuggestions(String response) {
        try {
            String cleanResponse = cleanJsonResponse(response);
            return objectMapper.readValue(cleanResponse, List.class);
        } catch (Exception e) {
            logger.error("Error parsing project suggestions: {}", e.getMessage());
            return getDefaultProjectSuggestions();
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseImprovementTips(String response) {
        try {
            String cleanResponse = cleanJsonResponse(response);
            return objectMapper.readValue(cleanResponse, List.class);
        } catch (Exception e) {
            logger.error("Error parsing improvement tips: {}", e.getMessage());
            return getDefaultImprovementTips();
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseKeywordSuggestions(String response) {
        try {
            String cleanResponse = cleanJsonResponse(response);
            return objectMapper.readValue(cleanResponse, List.class);
        } catch (Exception e) {
            logger.error("Error parsing keyword suggestions: {}", e.getMessage());
            return getDefaultKeywords();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseInterviewQuestions(String response) {
        try {
            String cleanResponse = cleanJsonResponse(response);
            return objectMapper.readValue(cleanResponse, List.class);
        } catch (Exception e) {
            logger.error("Error parsing interview questions: {}", e.getMessage());
            return getDefaultInterviewQuestions();
        }
    }

    private String cleanJsonResponse(String response) {
        if (response == null) return "[]";
        // Remove markdown code blocks
        response = response.replaceAll("```json\\s*", "");
        response = response.replaceAll("```\\s*", "");
        response = response.trim();
        // Ensure it starts with [ or {
        if (!response.startsWith("[") && !response.startsWith("{")) {
            int startIndex = response.indexOf("[");
            if (startIndex == -1) startIndex = response.indexOf("{");
            if (startIndex != -1) {
                response = response.substring(startIndex);
            }
        }
        return response;
    }

    // Default fallback methods when API fails
    private List<Map<String, String>> getDefaultSkillSuggestions() {
        List<Map<String, String>> defaults = new ArrayList<>();
        defaults.add(Map.of("skill", "Docker", "priority", "HIGH", "reason", "Essential for containerization and deployment", "learningTime", "2-3 weeks"));
        defaults.add(Map.of("skill", "Kubernetes", "priority", "HIGH", "reason", "Industry standard for container orchestration", "learningTime", "3-4 weeks"));
        defaults.add(Map.of("skill", "AWS/Cloud", "priority", "HIGH", "reason", "Cloud skills are in high demand", "learningTime", "4-6 weeks"));
        defaults.add(Map.of("skill", "CI/CD", "priority", "MEDIUM", "reason", "Important for modern development workflows", "learningTime", "1-2 weeks"));
        defaults.add(Map.of("skill", "System Design", "priority", "MEDIUM", "reason", "Critical for senior roles", "learningTime", "Ongoing"));
        return defaults;
    }

    private List<Map<String, String>> getDefaultProjectSuggestions() {
        List<Map<String, String>> defaults = new ArrayList<>();
        defaults.add(Map.of("title", "Full-Stack Web Application", "description", "Build a complete web app with user authentication, database, and responsive UI", "difficulty", "INTERMEDIATE", "estimatedTime", "4-6 weeks"));
        defaults.add(Map.of("title", "REST API with Documentation", "description", "Create a well-documented REST API with Swagger/OpenAPI", "difficulty", "INTERMEDIATE", "estimatedTime", "2-3 weeks"));
        defaults.add(Map.of("title", "Microservices Architecture", "description", "Implement a microservices-based system with multiple services", "difficulty", "ADVANCED", "estimatedTime", "6-8 weeks"));
        return defaults;
    }

    private List<String> getDefaultImprovementTips() {
        return Arrays.asList(
            "Add quantifiable achievements with specific metrics",
            "Use strong action verbs to start bullet points",
            "Tailor your resume keywords to the job description",
            "Include relevant certifications and continuous learning",
            "Keep the format clean and ATS-friendly",
            "Highlight problem-solving experiences",
            "Add links to portfolio, GitHub, or LinkedIn"
        );
    }

    private List<String> getDefaultKeywords() {
        return Arrays.asList(
            "agile", "scrum", "CI/CD", "microservices", "REST API",
            "cloud computing", "AWS", "Docker", "Kubernetes",
            "test-driven development", "code review", "system design"
        );
    }

    private List<Map<String, Object>> getDefaultInterviewQuestions() {
        List<Map<String, Object>> defaults = new ArrayList<>();
        defaults.add(Map.of("question", "Tell me about yourself and your experience", "category", "BEHAVIORAL", "difficulty", "EASY", "sampleAnswer", "Focus on relevant experience and achievements that match the role."));
        defaults.add(Map.of("question", "Describe a challenging project you worked on", "category", "BEHAVIORAL", "difficulty", "MEDIUM", "sampleAnswer", "Use STAR method: Situation, Task, Action, Result."));
        defaults.add(Map.of("question", "Explain the difference between REST and GraphQL", "category", "TECHNICAL", "difficulty", "MEDIUM", "sampleAnswer", "REST uses multiple endpoints, GraphQL uses a single endpoint with flexible queries."));
        defaults.add(Map.of("question", "How do you handle disagreements with team members?", "category", "SITUATIONAL", "difficulty", "MEDIUM", "sampleAnswer", "Focus on communication, understanding different perspectives, and finding common ground."));
        return defaults;
    }

    /**
     * AI-assisted ATS analysis for resume scoring
     */
    public Map<String, Object> analyzeResumeATS(String resumeText, String targetRole, String phase, String jobDescription, List<String> templateSections) {
        String prompt = buildATSAnalysisPrompt(resumeText, targetRole, phase, jobDescription, templateSections);
        String response = callOpenAI(prompt);
        return parseATSAnalysis(response, phase);
    }

    private String buildATSAnalysisPrompt(String resumeText, String targetRole, String phase, String jobDescription, List<String> templateSections) {
        String roleContext = targetRole != null ? targetRole : "Software Engineer";
        String jobContext = jobDescription != null && !jobDescription.isEmpty() 
            ? "\n\nJob Description:\n" + jobDescription 
            : "";

        // Build section context from template sections
        String sectionContext = "";
        if (templateSections != null && !templateSections.isEmpty()) {
            // Map section keys to readable names
            Map<String, String> sectionNames = new LinkedHashMap<>();
            sectionNames.put("personal", "Personal Info");
            sectionNames.put("education", "Education");
            sectionNames.put("experience", "Work Experience");
            sectionNames.put("skills", "Skills");
            sectionNames.put("projects", "Projects");
            sectionNames.put("certifications", "Certifications");
            sectionNames.put("languages", "Languages");
            sectionNames.put("activities", "Activities & Interests");
            sectionNames.put("summary", "Professional Summary");

            List<String> readableNames = templateSections.stream()
                .map(s -> sectionNames.getOrDefault(s, s))
                .collect(java.util.stream.Collectors.toList());

            sectionContext = String.format(
                "\n\nIMPORTANT: This resume template includes ONLY these sections: %s. " +
                "Evaluate and score ONLY these sections. Do NOT penalise the candidate for missing sections " +
                "that are not part of their chosen template.",
                String.join(", ", readableNames));
        }
        
        String phaseInstructions;
        switch (phase) {
            case "PHASE1":
                phaseInstructions = """
                    Focus on resume COMPLETENESS:
                    - Check if all sections are filled (contact, summary, skills, experience, education, projects)
                    - Evaluate the quality and length of each section
                    - Check for basic grammar and formatting
                    - Assess overall professionalism
                    """;
                break;
            case "PHASE2":
                phaseInstructions = """
                    Focus on resume IMPROVEMENT potential:
                    - Evaluate skill diversity and depth
                    - Check project descriptions for impact and metrics
                    - Assess use of action verbs and quantifiable achievements
                    - Look for improvement opportunities in content quality
                    - Evaluate work experience descriptions
                    """;
                break;
            case "PHASE3":
            default:
                phaseInstructions = String.format("""
                    Focus on ROLE MATCH for %s position:
                    - Match skills against required skills for the role
                    - Evaluate project relevance to the target role
                    - Check for industry-specific keywords
                    - Assess experience alignment with role requirements
                    - Compare against typical ATS requirements for this role
                    """, roleContext);
                break;
        }

        return String.format("""
            You are an expert ATS (Applicant Tracking System) AI that predicts how well a resume will perform in automated screening systems.
            
            **Task**: Analyze this resume for a %s position and PREDICT the ATS compatibility score based on your understanding of how real ATS systems evaluate resumes.
            %s
            %s
            %s
            
            **Prediction Criteria**:
            - Analyze the resume content holistically as an ATS system would
            - Consider: keyword density, skills relevance, experience quality, formatting, quantifiable achievements
            - Predict how likely this resume is to pass through automated screening
            - Identify critical missing elements that would hurt ATS performance
            - Base your prediction on industry standards for ATS systems
            
            Return ONLY a valid JSON object with these exact fields:
            {
                "skills_match_score": <number 0-100, how well skills match the role>,
                "project_relevance_score": <number 0-100, how relevant projects are to the role>,
                "keyword_match_score": <number 0-100, keyword optimization level>,
                "formatting_score": <number 0-100, ATS-friendly formatting quality>,
                "overall_ats_score": <number 0-100, YOUR PREDICTED ATS PASS PROBABILITY>,
                "missing_skills": ["critical skill 1", "critical skill 2", ...],
                "matched_keywords": ["present keyword 1", "present keyword 2", ...],
                "improvement_suggestions": ["actionable suggestion 1", "actionable suggestion 2", ...],
                "ai_feedback": "2-3 sentences explaining why you predicted this score and what would improve it"
            }
            
            **Scoring Guide**:
            - 85-100: Excellent - Highly likely to pass ATS screening
            - 70-84: Good - Will pass most ATS systems with minor improvements
            - 50-69: Average - Needs optimization to reliably pass ATS
            - 0-49: Poor - Significant improvements needed to pass ATS
            
            Be realistic in your prediction. Most resumes score 60-75.
            
            Resume Content:
            \"\"\"
            %s
            \"\"\"
            """, roleContext, phaseInstructions, jobContext, sectionContext, resumeText);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseATSAnalysis(String response, String phase) {
        try {
            String cleanResponse = cleanJsonResponse(response);
            Map<String, Object> result = objectMapper.readValue(cleanResponse, Map.class);
            
            // Ensure all required fields exist with defaults
            result.putIfAbsent("skills_match_score", 50);
            result.putIfAbsent("project_relevance_score", 50);
            result.putIfAbsent("keyword_match_score", 50);
            result.putIfAbsent("formatting_score", 60);
            result.putIfAbsent("overall_ats_score", 50);
            result.putIfAbsent("missing_skills", new ArrayList<>());
            result.putIfAbsent("matched_keywords", new ArrayList<>());
            result.putIfAbsent("improvement_suggestions", new ArrayList<>());
            result.putIfAbsent("ai_feedback", "Analysis completed.");
            
            // Validate scores are within range
            result.put("skills_match_score", Math.min(100, Math.max(0, ((Number) result.get("skills_match_score")).intValue())));
            result.put("project_relevance_score", Math.min(100, Math.max(0, ((Number) result.get("project_relevance_score")).intValue())));
            result.put("keyword_match_score", Math.min(100, Math.max(0, ((Number) result.get("keyword_match_score")).intValue())));
            result.put("formatting_score", Math.min(100, Math.max(0, ((Number) result.get("formatting_score")).intValue())));
            result.put("overall_ats_score", Math.min(100, Math.max(0, ((Number) result.get("overall_ats_score")).intValue())));
            
            return result;
        } catch (Exception e) {
            logger.error("Error parsing ATS analysis: {}", e.getMessage());
            return getDefaultATSAnalysis(phase);
        }
    }

    private Map<String, Object> getDefaultATSAnalysis(String phase) {
        Map<String, Object> defaults = new HashMap<>();
        
        // Phase-appropriate default scores
        int baseScore = "PHASE1".equals(phase) ? 40 : "PHASE2".equals(phase) ? 50 : 45;
        
        defaults.put("skills_match_score", baseScore + 5);
        defaults.put("project_relevance_score", baseScore);
        defaults.put("keyword_match_score", baseScore + 10);
        defaults.put("formatting_score", 60);
        defaults.put("overall_ats_score", baseScore + 5);
        defaults.put("missing_skills", Arrays.asList("Docker", "AWS", "Kubernetes", "CI/CD", "System Design"));
        defaults.put("matched_keywords", Arrays.asList("Java", "Python", "SQL", "Git"));
        defaults.put("improvement_suggestions", Arrays.asList(
            "Add more quantifiable achievements to your experience section",
            "Include relevant technical certifications",
            "Add a professional summary highlighting key skills",
            "Use more action verbs to describe your accomplishments",
            "Tailor your skills section to match job requirements"
        ));
        defaults.put("ai_feedback", "Your resume shows potential but needs optimization for ATS systems. Focus on adding industry-specific keywords and quantifiable achievements to improve your score.");
        
        return defaults;
    }

    /**
     * Parse resume text using AI to extract structured data
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> parseResumeWithAI(String resumeText) {
        logger.info("Parsing resume with AI, text length: {}", resumeText.length());
        
        String prompt = buildResumeParsingPrompt(resumeText);
        String response = callOpenAIForResumeParsing(prompt);
        
        try {
            String cleanResponse = cleanJsonResponse(response);
            Map<String, Object> result = objectMapper.readValue(cleanResponse, Map.class);
            logger.info("AI resume parsing successful");
            return result;
        } catch (Exception e) {
            logger.error("Error parsing AI resume response: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    private String callOpenAIForResumeParsing(String prompt) {
        try {
            if (apiKey == null || apiKey.isBlank()) {
                logger.warn("Hugging Face API key is not configured; skipping AI resume parsing.");
                return "{}";
            }

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "You are an expert resume parser. Extract all information from resumes accurately and return ONLY valid JSON. Be thorough and extract every detail including names, contact info, education with grades, skills categorized, projects with descriptions and technologies, certifications, coding profiles, and hobbies.");
            messages.add(systemMessage);
            
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", prompt);
            messages.add(userMessage);
            
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.3); // Lower temperature for accurate extraction
            requestBody.put("max_tokens", 3000); // More tokens for detailed extraction

            String response = getWebClient().post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .onErrorResume(e -> {
                        logger.error("Hugging Face API call failed for resume parsing: {}", e.getMessage());
                        return Mono.just("{}");
                    })
                    .block();

            return extractContentFromResponse(response);
        } catch (Exception e) {
            logger.error("Error calling Hugging Face API for resume parsing: {}", e.getMessage());
            return "{}";
        }
    }

    private String buildResumeParsingPrompt(String resumeText) {
        return String.format("""
            Parse the following resume text and extract ALL information into this exact JSON structure.
            Be thorough - extract every piece of information you can find.
            
            Return ONLY valid JSON with this structure:
            {
                "fullName": "Full name of the person",
                "email": "email@example.com",
                "phone": "phone number with country code",
                "location": "city, state, country",
                "linkedin": "linkedin profile URL or username",
                "github": "github profile URL or username",
                "portfolio": "portfolio/website URL",
                "summary": "professional summary or objective if present",
                "education": [
                    {
                        "institution": "University/College name",
                        "degree": "Degree name (BTech, BSc, etc.)",
                        "field": "Field of study",
                        "grade": "GPA, CGPA, or percentage",
                        "startDate": "start date/year",
                        "endDate": "end date/year or Present",
                        "location": "location if mentioned"
                    }
                ],
                "experience": [
                    {
                        "company": "Company name",
                        "position": "Job title",
                        "startDate": "start date",
                        "endDate": "end date or Present",
                        "location": "location",
                        "description": "job description and responsibilities"
                    }
                ],
                "skills": {
                    "languages": ["programming languages"],
                    "libraries": ["libraries and frameworks"],
                    "webTechnologies": ["web technologies"],
                    "databases": ["databases"],
                    "tools": ["tools and platforms"],
                    "other": ["other skills"]
                },
                "projects": [
                    {
                        "name": "Project name",
                        "description": "detailed project description",
                        "technologies": "technologies used",
                        "liveLink": "live demo URL if present",
                        "githubLink": "github repo URL if present"
                    }
                ],
                "certifications": [
                    {
                        "name": "certification or achievement name",
                        "issuer": "issuing organization",
                        "date": "date if mentioned"
                    }
                ],
                "codingProfiles": {
                    "leetcode": "leetcode username/URL",
                    "hackerrank": "hackerrank username/URL",
                    "codechef": "codechef username/URL",
                    "codeforces": "codeforces username/URL",
                    "kaggle": "kaggle username/URL"
                },
                "languages": [
                    {
                        "language": "spoken language",
                        "proficiency": "proficiency level"
                    }
                ],
                "hobbies": ["list of hobbies"],
                "achievements": ["list of achievements and awards"]
            }
            
            Important instructions:
            1. Extract ALL education entries including school, intermediate, and university
            2. Extract ALL skills - categorize them properly (languages, libraries, web, databases, tools)
            3. Extract ALL projects with their complete descriptions and technologies
            4. Extract ALL certifications and achievements/awards
            5. Extract coding profile usernames (leetcode, hackerrank, codechef, etc.)
            6. If a field is not found, use empty string "" or empty array []
            7. For grades, include the exact value (9.0, 95%%, etc.)
            8. Return ONLY the JSON, no additional text
            
            Resume Text:
            \"\"\"
            %s
            \"\"\"
            """, resumeText);
    }
}
