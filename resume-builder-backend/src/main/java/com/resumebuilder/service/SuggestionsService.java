package com.resumebuilder.service;

import com.resumebuilder.dto.SuggestionsDTO;
import com.resumebuilder.model.JobContext;
import com.resumebuilder.model.Resume;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.JobContextRepository;
import com.resumebuilder.repository.ResumeRepository;
import com.resumebuilder.repository.UserRepository;
import com.resumebuilder.util.RoleData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SuggestionsService {

    private static final Logger logger = LoggerFactory.getLogger(SuggestionsService.class);

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final JobContextRepository jobContextRepository;
    private final OpenAIService openAIService;

    @Autowired
    public SuggestionsService(ResumeRepository resumeRepository,
                              UserRepository userRepository,
                              JobContextRepository jobContextRepository,
                              OpenAIService openAIService) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.jobContextRepository = jobContextRepository;
        this.openAIService = openAIService;
    }

    public SuggestionsDTO.MissingSkillsResponse getMissingSkills(Long resumeId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        String targetRole = resume.getTargetRole() != null ? resume.getTargetRole() : "Software Engineer";
        List<String> requiredSkills = RoleData.getSkillsForRole(targetRole);
        
        // Parse current skills from resume
        List<String> currentSkills = parseSkills(resume.getSkills());
        
        // Find missing skills
        List<SuggestionsDTO.SkillGap> missingSkills = new ArrayList<>();
        int matchCount = 0;
        
        for (String requiredSkill : requiredSkills) {
            boolean hasSkill = currentSkills.stream()
                    .anyMatch(s -> s.toLowerCase().contains(requiredSkill.toLowerCase()) ||
                            requiredSkill.toLowerCase().contains(s.toLowerCase()));
            
            if (hasSkill) {
                matchCount++;
            } else {
                String priority = getPriority(requiredSkills.indexOf(requiredSkill));
                String reason = getSkillReason(requiredSkill, targetRole);
                String category = getSkillCategory(requiredSkill);
                
                missingSkills.add(new SuggestionsDTO.SkillGap(
                        requiredSkill, priority, reason, category
                ));
            }
        }
        
        int matchPercentage = requiredSkills.isEmpty() ? 0 : 
                (int) ((matchCount * 100.0) / requiredSkills.size());

        return SuggestionsDTO.MissingSkillsResponse.builder()
                .resumeId(resumeId)
                .targetRole(targetRole)
                .missingSkills(missingSkills)
                .currentSkills(currentSkills)
                .matchPercentage(matchPercentage)
                .build();
    }

    public SuggestionsDTO.AISuggestionsResponse getAISuggestions(SuggestionsDTO.AISuggestionsRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = null;
        String targetRole = request.getTargetRole();
        
        if (request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
            
            if (!resume.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized access");
            }
            
            if (targetRole == null) {
                targetRole = resume.getTargetRole();
            }
        }
        
        if (targetRole == null) {
            targetRole = "Software Engineer";
        }

        // Parse current skills
        List<String> currentSkills = resume != null ? parseSkills(resume.getSkills()) : new ArrayList<>();
        String resumeSummary = resume != null ? resume.getSummary() : null;

        // Try to get AI-powered suggestions from OpenAI
        List<SuggestionsDTO.SkillSuggestion> skillSuggestions;
        List<SuggestionsDTO.ProjectSuggestion> projectSuggestions;
        List<String> keywordSuggestions;
        List<String> improvementTips;

        try {
            logger.info("Fetching AI suggestions from OpenAI for role: {}", targetRole);
            
            // Get skill suggestions from OpenAI
            List<Map<String, String>> aiSkills = openAIService.getSkillSuggestions(targetRole, currentSkills);
            skillSuggestions = convertToSkillSuggestions(aiSkills);
            
            // Get project suggestions from OpenAI
            List<Map<String, String>> aiProjects = openAIService.getProjectSuggestions(targetRole, currentSkills);
            projectSuggestions = convertToProjectSuggestions(aiProjects);
            
            // Get keyword suggestions from OpenAI
            keywordSuggestions = openAIService.getKeywordSuggestions(targetRole, null);
            
            // Get improvement tips from OpenAI
            improvementTips = openAIService.getImprovementTips(targetRole, resumeSummary);
            
            logger.info("Successfully retrieved AI suggestions from OpenAI");
        } catch (Exception e) {
            logger.warn("OpenAI API call failed, falling back to local generation: {}", e.getMessage());
            
            // Fall back to local generation
            skillSuggestions = generateSkillSuggestions(resume, targetRole);
            projectSuggestions = generateProjectSuggestions(targetRole);
            keywordSuggestions = generateKeywordSuggestions(targetRole);
            improvementTips = generateImprovementTips(resume, targetRole);
        }

        return SuggestionsDTO.AISuggestionsResponse.builder()
                .resumeId(request.getResumeId())
                .targetRole(targetRole)
                .skillSuggestions(skillSuggestions)
                .projectSuggestions(projectSuggestions)
                .keywordSuggestions(keywordSuggestions)
                .improvementTips(improvementTips)
                .build();
    }

    private List<String> parseSkills(String skillsJson) {
        if (skillsJson == null || skillsJson.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Handle both comma-separated and JSON array formats
        if (skillsJson.startsWith("[")) {
            skillsJson = skillsJson.replaceAll("[\\[\\]\"]", "");
        }
        
        return Arrays.stream(skillsJson.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private String getPriority(int index) {
        if (index < 3) return "HIGH";
        if (index < 6) return "MEDIUM";
        return "LOW";
    }

    private String getSkillReason(String skill, String role) {
        String lowerSkill = skill.toLowerCase();
        
        if (lowerSkill.contains("java") || lowerSkill.contains("python") || 
            lowerSkill.contains("javascript") || lowerSkill.contains("typescript")) {
            return "Core programming language frequently required for " + role + " positions";
        }
        if (lowerSkill.contains("spring") || lowerSkill.contains("react") || 
            lowerSkill.contains("node") || lowerSkill.contains("angular")) {
            return "Popular framework that significantly improves hire-ability for " + role;
        }
        if (lowerSkill.contains("sql") || lowerSkill.contains("mongo") || 
            lowerSkill.contains("database") || lowerSkill.contains("redis")) {
            return "Essential database skill for backend development and data management";
        }
        if (lowerSkill.contains("docker") || lowerSkill.contains("kubernetes") || 
            lowerSkill.contains("aws") || lowerSkill.contains("cloud")) {
            return "Cloud and containerization skills are increasingly required in modern development";
        }
        if (lowerSkill.contains("git") || lowerSkill.contains("ci/cd") || 
            lowerSkill.contains("jenkins") || lowerSkill.contains("agile")) {
            return "Industry-standard tool for collaborative development and deployment";
        }
        
        return "Commonly requested skill for " + role + " positions";
    }

    private String getSkillCategory(String skill) {
        String lowerSkill = skill.toLowerCase();
        
        if (lowerSkill.contains("java") || lowerSkill.contains("python") || 
            lowerSkill.contains("javascript") || lowerSkill.contains("c++") ||
            lowerSkill.contains("typescript") || lowerSkill.contains("go")) {
            return "Programming Language";
        }
        if (lowerSkill.contains("react") || lowerSkill.contains("angular") || 
            lowerSkill.contains("vue") || lowerSkill.contains("spring") ||
            lowerSkill.contains("node") || lowerSkill.contains("django")) {
            return "Framework";
        }
        if (lowerSkill.contains("sql") || lowerSkill.contains("mongo") || 
            lowerSkill.contains("postgres") || lowerSkill.contains("redis") ||
            lowerSkill.contains("mysql") || lowerSkill.contains("database")) {
            return "Database";
        }
        if (lowerSkill.contains("docker") || lowerSkill.contains("kubernetes") || 
            lowerSkill.contains("aws") || lowerSkill.contains("azure") ||
            lowerSkill.contains("gcp") || lowerSkill.contains("cloud")) {
            return "Cloud & DevOps";
        }
        if (lowerSkill.contains("git") || lowerSkill.contains("jenkins") || 
            lowerSkill.contains("ci/cd") || lowerSkill.contains("terraform")) {
            return "Tools";
        }
        
        return "Other";
    }

    private List<SuggestionsDTO.SkillSuggestion> generateSkillSuggestions(Resume resume, String targetRole) {
        List<String> roleSkills = RoleData.getSkillsForRole(targetRole);
        List<String> currentSkills = resume != null ? parseSkills(resume.getSkills()) : new ArrayList<>();
        
        List<SuggestionsDTO.SkillSuggestion> suggestions = new ArrayList<>();
        int count = 0;
        
        for (String skill : roleSkills) {
            if (count >= 5) break;
            
            boolean hasSkill = currentSkills.stream()
                    .anyMatch(s -> s.toLowerCase().contains(skill.toLowerCase()));
            
            if (!hasSkill) {
                String priority = getPriority(count);
                String reason = getSkillReason(skill, targetRole);
                String resource = getLearningResource(skill);
                
                suggestions.add(new SuggestionsDTO.SkillSuggestion(skill, priority, reason, resource));
                count++;
            }
        }
        
        return suggestions;
    }

    private String getLearningResource(String skill) {
        String lowerSkill = skill.toLowerCase();
        
        if (lowerSkill.contains("java")) return "https://docs.oracle.com/javase/tutorial/";
        if (lowerSkill.contains("spring")) return "https://spring.io/guides";
        if (lowerSkill.contains("react")) return "https://react.dev/learn";
        if (lowerSkill.contains("javascript")) return "https://developer.mozilla.org/en-US/docs/Web/JavaScript";
        if (lowerSkill.contains("python")) return "https://docs.python.org/3/tutorial/";
        if (lowerSkill.contains("docker")) return "https://docs.docker.com/get-started/";
        if (lowerSkill.contains("kubernetes")) return "https://kubernetes.io/docs/tutorials/";
        if (lowerSkill.contains("aws")) return "https://aws.amazon.com/training/";
        if (lowerSkill.contains("sql")) return "https://www.w3schools.com/sql/";
        
        return "https://www.udemy.com/topic/" + skill.toLowerCase().replace(" ", "-");
    }

    private List<SuggestionsDTO.ProjectSuggestion> generateProjectSuggestions(String targetRole) {
        List<SuggestionsDTO.ProjectSuggestion> projects = new ArrayList<>();
        
        String lowerRole = targetRole.toLowerCase();
        
        if (lowerRole.contains("java") || lowerRole.contains("full stack")) {
            projects.add(new SuggestionsDTO.ProjectSuggestion(
                    "E-Commerce Platform",
                    "Build a full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment integration",
                    Arrays.asList("Java", "Spring Boot", "React", "MySQL", "REST API"),
                    "Intermediate",
                    "2-3 weeks"
            ));
            projects.add(new SuggestionsDTO.ProjectSuggestion(
                    "Task Management System",
                    "Create a Kanban-style task management application with real-time updates and team collaboration features",
                    Arrays.asList("Java", "Spring Boot", "React", "WebSocket", "PostgreSQL"),
                    "Intermediate",
                    "1-2 weeks"
            ));
            projects.add(new SuggestionsDTO.ProjectSuggestion(
                    "Microservices Blog Platform",
                    "Implement a blog platform using microservices architecture with service discovery and API gateway",
                    Arrays.asList("Java", "Spring Cloud", "Docker", "Kubernetes", "MongoDB"),
                    "Advanced",
                    "3-4 weeks"
            ));
        } else if (lowerRole.contains("frontend")) {
            projects.add(new SuggestionsDTO.ProjectSuggestion(
                    "Social Media Dashboard",
                    "Build a responsive dashboard with data visualization, real-time notifications, and dark mode",
                    Arrays.asList("React", "TypeScript", "Redux", "Chart.js", "Tailwind CSS"),
                    "Intermediate",
                    "1-2 weeks"
            ));
            projects.add(new SuggestionsDTO.ProjectSuggestion(
                    "Portfolio Website Builder",
                    "Create a drag-and-drop website builder with templating system and export functionality",
                    Arrays.asList("React", "TypeScript", "DnD Kit", "CSS Modules"),
                    "Advanced",
                    "2-3 weeks"
            ));
        } else if (lowerRole.contains("backend")) {
            projects.add(new SuggestionsDTO.ProjectSuggestion(
                    "REST API with Authentication",
                    "Build a secure REST API with JWT authentication, rate limiting, and comprehensive documentation",
                    Arrays.asList("Node.js", "Express", "MongoDB", "JWT", "Swagger"),
                    "Intermediate",
                    "1 week"
            ));
            projects.add(new SuggestionsDTO.ProjectSuggestion(
                    "Real-time Chat Service",
                    "Implement a scalable chat service with message persistence and WebSocket support",
                    Arrays.asList("Node.js", "Socket.io", "Redis", "PostgreSQL"),
                    "Intermediate",
                    "1-2 weeks"
            ));
        } else {
            projects.add(new SuggestionsDTO.ProjectSuggestion(
                    "Personal Portfolio Website",
                    "Create a professional portfolio showcasing your projects and skills",
                    Arrays.asList("HTML", "CSS", "JavaScript", "Git"),
                    "Beginner",
                    "1 week"
            ));
        }
        
        return projects;
    }

    private List<String> generateKeywordSuggestions(String targetRole) {
        List<String> keywords = RoleData.getKeywordsForRole(targetRole);
        
        // Add action verbs
        keywords.addAll(Arrays.asList(
                "Developed", "Implemented", "Designed", "Optimized", 
                "Led", "Collaborated", "Architected", "Deployed"
        ));
        
        return keywords.stream().distinct().limit(15).collect(Collectors.toList());
    }

    private List<String> generateImprovementTips(Resume resume, String targetRole) {
        List<String> tips = new ArrayList<>();
        
        tips.add("Quantify your achievements with specific metrics (e.g., 'Improved performance by 40%')");
        tips.add("Use action verbs to start each bullet point in your experience section");
        tips.add("Tailor your summary to highlight relevant experience for " + targetRole);
        tips.add("Include relevant certifications and online courses");
        tips.add("Add links to your GitHub/portfolio to showcase your projects");
        
        if (resume != null) {
            if (resume.getSummary() == null || resume.getSummary().length() < 100) {
                tips.add("Add a compelling professional summary (100-200 words recommended)");
            }
            if (resume.getProjects() == null || resume.getProjects().isEmpty()) {
                tips.add("Add 2-3 relevant projects to demonstrate practical skills");
            }
        }
        
        return tips;
    }

    // Conversion methods for OpenAI responses
    @SuppressWarnings("unchecked")
    private List<SuggestionsDTO.SkillSuggestion> convertToSkillSuggestions(List<Map<String, String>> aiSkills) {
        List<SuggestionsDTO.SkillSuggestion> suggestions = new ArrayList<>();
        
        for (Map<String, String> skillMap : aiSkills) {
            String skill = skillMap.getOrDefault("skill", "Unknown Skill");
            String priority = skillMap.getOrDefault("priority", "MEDIUM");
            String reason = skillMap.getOrDefault("reason", "Important for the role");
            String resource = getLearningResource(skill);
            
            suggestions.add(new SuggestionsDTO.SkillSuggestion(skill, priority, reason, resource));
        }
        
        return suggestions;
    }

    @SuppressWarnings("unchecked")
    private List<SuggestionsDTO.ProjectSuggestion> convertToProjectSuggestions(List<Map<String, String>> aiProjects) {
        List<SuggestionsDTO.ProjectSuggestion> suggestions = new ArrayList<>();
        
        for (Map<String, String> projectMap : aiProjects) {
            String title = projectMap.getOrDefault("title", "Project");
            String description = projectMap.getOrDefault("description", "A practical project");
            String difficulty = projectMap.getOrDefault("difficulty", "INTERMEDIATE");
            String estimatedTime = projectMap.getOrDefault("estimatedTime", "2-4 weeks");
            
            // Parse skills - they might be a JSON array string or already parsed
            List<String> skills = new ArrayList<>();
            Object skillsObj = projectMap.get("skills");
            if (skillsObj instanceof String) {
                skills = Arrays.asList(((String) skillsObj).replaceAll("[\\[\\]\"]", "").split(","));
            } else if (skillsObj instanceof List) {
                skills = (List<String>) skillsObj;
            } else {
                skills = Arrays.asList("Various skills");
            }
            
            suggestions.add(new SuggestionsDTO.ProjectSuggestion(title, description, skills, difficulty, estimatedTime));
        }
        
        return suggestions;
    }
}
