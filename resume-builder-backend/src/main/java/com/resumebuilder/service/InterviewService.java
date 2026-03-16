package com.resumebuilder.service;

import com.resumebuilder.dto.InterviewDTO;
import com.resumebuilder.model.Resume;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.ResumeRepository;
import com.resumebuilder.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InterviewService {

    private static final Logger logger = LoggerFactory.getLogger(InterviewService.class);

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final OpenAIService openAIService;

    @Autowired
    public InterviewService(ResumeRepository resumeRepository, UserRepository userRepository, OpenAIService openAIService) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.openAIService = openAIService;
    }

    public InterviewDTO.InterviewPrepResponse getInterviewPrep(Long resumeId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        String targetRole = resume.getTargetRole() != null ? resume.getTargetRole() : "Software Engineer";
        List<String> skills = parseSkills(resume.getSkills());

        List<InterviewDTO.InterviewQuestion> technicalQuestions;
        List<InterviewDTO.InterviewQuestion> behavioralQuestions;
        List<InterviewDTO.InterviewQuestion> projectBasedQuestions;

        // Try to get AI-generated interview questions from OpenAI
        try {
            logger.info("Fetching AI-generated interview questions from OpenAI for role: {}", targetRole);
            
            List<Map<String, Object>> aiQuestions = openAIService.getInterviewQuestions(targetRole, skills);
            
            // Split questions by category
            technicalQuestions = new ArrayList<>();
            behavioralQuestions = new ArrayList<>();
            projectBasedQuestions = new ArrayList<>();
            
            for (Map<String, Object> q : aiQuestions) {
                String category = String.valueOf(q.getOrDefault("category", "TECHNICAL"));
                InterviewDTO.InterviewQuestion question = createQuestion(
                        String.valueOf(q.getOrDefault("question", "")),
                        category.equals("TECHNICAL") ? targetRole : category,
                        String.valueOf(q.getOrDefault("sampleAnswer", "")),
                        String.valueOf(q.getOrDefault("difficulty", "MEDIUM"))
                );
                
                if ("BEHAVIORAL".equalsIgnoreCase(category)) {
                    behavioralQuestions.add(question);
                } else if ("SITUATIONAL".equalsIgnoreCase(category)) {
                    projectBasedQuestions.add(question);
                } else {
                    technicalQuestions.add(question);
                }
            }
            
            logger.info("Successfully retrieved AI-generated interview questions");
        } catch (Exception e) {
            logger.warn("OpenAI API call failed, falling back to local generation: {}", e.getMessage());
            
            // Fall back to local generation
            technicalQuestions = generateTechnicalQuestions(skills, targetRole);
            behavioralQuestions = generateBehavioralQuestions();
            projectBasedQuestions = generateProjectBasedQuestions();
        }

        // Generate preparation tips
        List<String> preparationTips = generatePreparationTips(targetRole);

        // Topics to review
        List<InterviewDTO.TopicToReview> topicsToReview = generateTopicsToReview(skills, targetRole);

        return InterviewDTO.InterviewPrepResponse.builder()
                .resumeId(resumeId)
                .targetRole(targetRole)
                .technicalQuestions(technicalQuestions)
                .behavioralQuestions(behavioralQuestions)
                .projectBasedQuestions(projectBasedQuestions)
                .preparationTips(preparationTips)
                .topicsToReview(topicsToReview)
                .build();
    }

    private List<String> parseSkills(String skillsJson) {
        if (skillsJson == null || skillsJson.isEmpty()) {
            return new ArrayList<>();
        }
        
        if (skillsJson.startsWith("[")) {
            skillsJson = skillsJson.replaceAll("[\\[\\]\"]", "");
        }
        
        return Arrays.asList(skillsJson.split(","));
    }

    private List<InterviewDTO.InterviewQuestion> generateTechnicalQuestions(List<String> skills, String targetRole) {
        List<InterviewDTO.InterviewQuestion> questions = new ArrayList<>();
        
        // Add Java questions if relevant
        if (containsSkill(skills, "java") || targetRole.toLowerCase().contains("java")) {
            questions.add(createQuestion(
                    "What is the difference between == and .equals() in Java?",
                    "Java",
                    "== compares object references (memory addresses), while .equals() compares the actual content/values of objects. For primitives, == compares values. Always override .equals() and hashCode() together when comparing object contents.",
                    "MEDIUM"
            ));
            questions.add(createQuestion(
                    "Explain the concept of garbage collection in Java",
                    "Java",
                    "Garbage collection automatically reclaims memory by identifying and removing objects that are no longer reachable. Java uses generational GC with Young Gen (Eden, Survivor) and Old Gen. Key collectors include G1, ZGC, and Parallel GC.",
                    "MEDIUM"
            ));
            questions.add(createQuestion(
                    "What are the differences between HashMap and ConcurrentHashMap?",
                    "Java",
                    "HashMap is not thread-safe and allows nulls. ConcurrentHashMap is thread-safe using segment-level locking (Java 7) or CAS operations (Java 8+), doesn't allow null keys/values, and provides better concurrent performance than synchronized HashMap.",
                    "HARD"
            ));
        }

        // Add Spring Boot questions if relevant
        if (containsSkill(skills, "spring")) {
            questions.add(createQuestion(
                    "What is dependency injection and how does Spring implement it?",
                    "Spring Boot",
                    "DI is a design pattern where objects receive dependencies from external sources rather than creating them. Spring implements DI through constructor injection (recommended), setter injection, and field injection using @Autowired, managed by the IoC container.",
                    "MEDIUM"
            ));
            questions.add(createQuestion(
                    "Explain the difference between @Component, @Service, @Repository, and @Controller",
                    "Spring Boot",
                    "All are specializations of @Component. @Service marks business logic layer, @Repository marks data access layer (adds exception translation), @Controller marks web layer. They help with automatic scanning and provide semantic meaning.",
                    "EASY"
            ));
        }

        // Add React questions if relevant
        if (containsSkill(skills, "react")) {
            questions.add(createQuestion(
                    "What are React hooks and why were they introduced?",
                    "React",
                    "Hooks let you use state and lifecycle features in functional components. Introduced to share logic between components, avoid class complexity, and improve code reuse. Key hooks: useState, useEffect, useContext, useReducer, useMemo, useCallback.",
                    "MEDIUM"
            ));
            questions.add(createQuestion(
                    "Explain the virtual DOM and reconciliation in React",
                    "React",
                    "Virtual DOM is an in-memory representation of the real DOM. When state changes, React creates a new virtual DOM, diffs it with the previous one (reconciliation), and efficiently updates only changed parts in the real DOM using the diffing algorithm.",
                    "MEDIUM"
            ));
        }

        // Add database questions
        if (containsSkill(skills, "sql") || containsSkill(skills, "mysql") || containsSkill(skills, "postgres")) {
            questions.add(createQuestion(
                    "What are database indexes and how do they improve performance?",
                    "Database",
                    "Indexes are data structures (usually B-tree) that speed up data retrieval by providing quick lookup paths. They improve SELECT performance but add overhead to INSERT/UPDATE/DELETE. Use for frequently queried columns, but avoid over-indexing.",
                    "MEDIUM"
            ));
            questions.add(createQuestion(
                    "Explain ACID properties in databases",
                    "Database",
                    "Atomicity: Transactions are all-or-nothing. Consistency: Database moves from one valid state to another. Isolation: Concurrent transactions don't interfere. Durability: Committed changes persist even after failures.",
                    "MEDIUM"
            ));
        }

        // Add general software engineering questions
        questions.add(createQuestion(
                "How would you design a URL shortener system?",
                "System Design",
                "Key components: 1) Generate short codes using base62 encoding or hashing, 2) Store mapping in database with caching (Redis), 3) Use load balancer for traffic, 4) Consider analytics, expiration, rate limiting. Scale with sharding/partitioning.",
                "HARD"
        ));

        return questions;
    }

    private List<InterviewDTO.InterviewQuestion> generateBehavioralQuestions() {
        List<InterviewDTO.InterviewQuestion> questions = new ArrayList<>();

        questions.add(createQuestion(
                "Tell me about a challenging project you worked on and how you overcame obstacles",
                "Behavioral",
                "Use STAR method: Situation (project context), Task (your responsibility), Action (specific steps you took), Result (measurable outcome). Focus on problem-solving skills and what you learned.",
                null
        ));
        questions.add(createQuestion(
                "Describe a situation where you had to learn a new technology quickly",
                "Behavioral",
                "Highlight your learning approach, resources used, how you applied the knowledge, and the timeframe. Show adaptability and eagerness to learn.",
                null
        ));
        questions.add(createQuestion(
                "How do you handle disagreements with team members?",
                "Behavioral",
                "Emphasize active listening, seeking to understand their perspective, focusing on facts/data rather than emotions, finding common ground, and the importance of team goals over individual preferences.",
                null
        ));
        questions.add(createQuestion(
                "Tell me about a time when you had to meet a tight deadline",
                "Behavioral",
                "Describe prioritization, communication with stakeholders, any trade-offs made, and how you delivered. Highlight time management and stress handling.",
                null
        ));
        questions.add(createQuestion(
                "How do you prioritize tasks when working on multiple projects?",
                "Behavioral",
                "Discuss frameworks (Eisenhower matrix, MoSCoW), communication with stakeholders about priorities, breaking down tasks, and regular reassessment of priorities.",
                null
        ));

        return questions;
    }

    private List<InterviewDTO.InterviewQuestion> generateProjectBasedQuestions() {
        List<InterviewDTO.InterviewQuestion> questions = new ArrayList<>();

        questions.add(createQuestion(
                "Walk me through a project on your resume and your specific contributions",
                "Project",
                "Be specific about your role, technologies used, challenges faced, and quantifiable impact. Prepare 2-3 projects to discuss in depth.",
                null
        ));
        questions.add(createQuestion(
                "What was the most difficult bug you encountered and how did you debug it?",
                "Project",
                "Describe the debugging process: reproduce issue, isolate variables, use debugging tools/logs, identify root cause, implement and verify fix. Show systematic thinking.",
                null
        ));
        questions.add(createQuestion(
                "If you could redesign one of your projects, what would you do differently?",
                "Project",
                "Show reflection and growth. Discuss architectural decisions, technology choices, or processes you'd improve. Demonstrate continuous learning mindset.",
                null
        ));

        return questions;
    }

    private List<String> generatePreparationTips(String targetRole) {
        List<String> tips = new ArrayList<>();
        
        tips.add("Review fundamental data structures and algorithms (arrays, linked lists, trees, graphs, sorting, searching)");
        tips.add("Practice coding problems on LeetCode or HackerRank - aim for 2-3 problems daily");
        tips.add("Prepare 3-4 detailed project stories using the STAR method");
        tips.add("Research the company's tech stack, recent news, and engineering blog posts");
        tips.add("Practice explaining your thought process while solving problems");
        tips.add("Prepare thoughtful questions to ask the interviewer about team culture and projects");
        tips.add("Review system design basics: load balancing, caching, databases, microservices");
        tips.add("Mock interview with a friend or use platforms like Pramp or interviewing.io");

        return tips;
    }

    private List<InterviewDTO.TopicToReview> generateTopicsToReview(List<String> skills, String targetRole) {
        List<InterviewDTO.TopicToReview> topics = new ArrayList<>();
        
        // Core topics
        topics.add(new InterviewDTO.TopicToReview("Data Structures", "HIGH", 
                Arrays.asList("Arrays", "LinkedList", "HashMap", "Trees", "Graphs"), null));
        topics.add(new InterviewDTO.TopicToReview("Algorithms", "HIGH", 
                Arrays.asList("Sorting", "Searching", "Dynamic Programming", "Recursion"), null));
        topics.add(new InterviewDTO.TopicToReview("Object-Oriented Programming", "MEDIUM", 
                Arrays.asList("SOLID principles", "Design Patterns"), null));
        topics.add(new InterviewDTO.TopicToReview("SQL", "MEDIUM", 
                Arrays.asList("JOINs", "Indexes", "Query Optimization", "Transactions"), null));
        
        // Role-specific topics
        if (targetRole.toLowerCase().contains("full") || targetRole.toLowerCase().contains("backend")) {
            topics.add(new InterviewDTO.TopicToReview("System Design", "HIGH", 
                    Arrays.asList("Scalability", "Load Balancing", "Caching", "Microservices"), null));
        }
        
        if (containsSkill(skills, "java") || targetRole.toLowerCase().contains("java")) {
            topics.add(new InterviewDTO.TopicToReview("Java", "HIGH", 
                    Arrays.asList("Collections Framework", "Multithreading", "JVM internals", "Streams API"), null));
        }
        
        if (containsSkill(skills, "spring")) {
            topics.add(new InterviewDTO.TopicToReview("Spring Boot", "HIGH", 
                    Arrays.asList("IoC", "DI", "Bean lifecycle", "AOP", "Security"), null));
        }
        
        if (containsSkill(skills, "react")) {
            topics.add(new InterviewDTO.TopicToReview("React", "HIGH", 
                    Arrays.asList("Hooks", "State Management", "Virtual DOM", "Performance"), null));
        }

        return topics;
    }

    private boolean containsSkill(List<String> skills, String skill) {
        return skills.stream()
                .anyMatch(s -> s.toLowerCase().contains(skill.toLowerCase()));
    }

    private InterviewDTO.InterviewQuestion createQuestion(String question, String category, String suggestedAnswer, String difficulty) {
        return new InterviewDTO.InterviewQuestion(question, difficulty, category, suggestedAnswer, null);
    }
}
