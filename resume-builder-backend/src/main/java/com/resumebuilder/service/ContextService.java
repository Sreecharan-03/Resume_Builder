package com.resumebuilder.service;

import com.resumebuilder.dto.ContextDTO;
import com.resumebuilder.model.JobContext;
import com.resumebuilder.model.Resume;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.JobContextRepository;
import com.resumebuilder.repository.ResumeRepository;
import com.resumebuilder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContextService {

    private final JobContextRepository jobContextRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ContextService(JobContextRepository jobContextRepository,
                          ResumeRepository resumeRepository,
                          UserRepository userRepository) {
        this.jobContextRepository = jobContextRepository;
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ContextDTO.ContextResponse saveContext(ContextDTO.SaveContextRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findById(request.getResumeId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to resume");
        }

        // Update resume with target role
        resume.setTargetRole(request.getRole());
        resumeRepository.save(resume);

        // Extract keywords from job description
        String extractedKeywords = extractKeywords(request.getJobDescription(), request.getRole());

        // Check if context already exists for this resume
        JobContext context = jobContextRepository.findByResumeId(request.getResumeId())
                .orElse(null);

        if (context == null) {
            context = JobContext.builder()
                    .resume(resume)
                    .user(user)
                    .company(request.getCompany())
                    .targetRole(request.getRole())
                    .experienceLevel(request.getExperience())
                    .jobDescription(request.getJobDescription())
                    .extractedKeywords(extractedKeywords)
                    .build();
        } else {
            context.setCompany(request.getCompany());
            context.setTargetRole(request.getRole());
            context.setExperienceLevel(request.getExperience());
            context.setJobDescription(request.getJobDescription());
            context.setExtractedKeywords(extractedKeywords);
        }

        JobContext savedContext = jobContextRepository.save(context);

        return mapToResponse(savedContext);
    }

    public ContextDTO.ContextResponse getContext(Long resumeId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobContext context = jobContextRepository.findByResumeId(resumeId)
                .orElseThrow(() -> new RuntimeException("Context not found for this resume"));

        if (!context.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return mapToResponse(context);
    }

    private String extractKeywords(String jobDescription, String role) {
        if (jobDescription == null || jobDescription.isEmpty()) {
            return getDefaultKeywordsForRole(role);
        }

        // Simple keyword extraction (in production, use NLP)
        List<String> commonTechKeywords = Arrays.asList(
                "java", "spring", "spring boot", "react", "javascript", "typescript",
                "python", "node.js", "aws", "docker", "kubernetes", "microservices",
                "rest api", "sql", "mysql", "postgresql", "mongodb", "redis",
                "git", "agile", "scrum", "ci/cd", "jenkins", "terraform",
                "html", "css", "angular", "vue", "redux", "graphql"
        );

        String lowerDesc = jobDescription.toLowerCase();
        List<String> found = commonTechKeywords.stream()
                .filter(keyword -> lowerDesc.contains(keyword))
                .collect(Collectors.toList());

        return String.join(",", found);
    }

    private String getDefaultKeywordsForRole(String role) {
        if (role == null) return "";
        
        String lowerRole = role.toLowerCase();
        if (lowerRole.contains("java") || lowerRole.contains("full stack")) {
            return "java,spring boot,react,javascript,sql,rest api,microservices,git";
        } else if (lowerRole.contains("frontend")) {
            return "react,javascript,typescript,html,css,redux,responsive design";
        } else if (lowerRole.contains("backend")) {
            return "java,python,node.js,sql,rest api,microservices,docker";
        } else if (lowerRole.contains("data")) {
            return "python,sql,machine learning,pandas,numpy,tensorflow";
        } else if (lowerRole.contains("devops")) {
            return "docker,kubernetes,aws,ci/cd,jenkins,terraform,ansible";
        }
        return "communication,teamwork,problem solving,analytical skills";
    }

    private ContextDTO.ContextResponse mapToResponse(JobContext context) {
        return ContextDTO.ContextResponse.builder()
                .id(context.getId())
                .resumeId(context.getResume().getId())
                .company(context.getCompany())
                .targetRole(context.getTargetRole())
                .experienceLevel(context.getExperienceLevel())
                .jobDescription(context.getJobDescription())
                .extractedKeywords(context.getExtractedKeywords())
                .createdAt(context.getCreatedAt())
                .build();
    }
}
