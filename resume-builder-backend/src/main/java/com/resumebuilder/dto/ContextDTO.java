package com.resumebuilder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ContextDTO {

    // Save Context Request
    public static class SaveContextRequest {
        @NotNull(message = "Resume ID is required")
        private Long resumeId;
        
        @NotBlank(message = "Company is required")
        private String company;
        
        @NotBlank(message = "Role is required")
        private String role;
        
        private String experience;
        private String jobDescription;
        
        public SaveContextRequest() {}
        
        public Long getResumeId() { return resumeId; }
        public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
        
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        
        public String getExperience() { return experience; }
        public void setExperience(String experience) { this.experience = experience; }
        
        public String getJobDescription() { return jobDescription; }
        public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    }

    // Context Response
    public static class ContextResponse {
        private Long id;
        private Long resumeId;
        private String company;
        private String targetRole;
        private String experienceLevel;
        private String jobDescription;
        private String extractedKeywords;
        private LocalDateTime createdAt;
        
        public ContextResponse() {}
        
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private ContextResponse response = new ContextResponse();
            
            public Builder id(Long id) { response.id = id; return this; }
            public Builder resumeId(Long resumeId) { response.resumeId = resumeId; return this; }
            public Builder company(String company) { response.company = company; return this; }
            public Builder targetRole(String targetRole) { response.targetRole = targetRole; return this; }
            public Builder experienceLevel(String experienceLevel) { response.experienceLevel = experienceLevel; return this; }
            public Builder jobDescription(String jobDescription) { response.jobDescription = jobDescription; return this; }
            public Builder extractedKeywords(String extractedKeywords) { response.extractedKeywords = extractedKeywords; return this; }
            public Builder createdAt(LocalDateTime createdAt) { response.createdAt = createdAt; return this; }
            
            public ContextResponse build() { return response; }
        }
        
        // Getters
        public Long getId() { return id; }
        public Long getResumeId() { return resumeId; }
        public String getCompany() { return company; }
        public String getTargetRole() { return targetRole; }
        public String getExperienceLevel() { return experienceLevel; }
        public String getJobDescription() { return jobDescription; }
        public String getExtractedKeywords() { return extractedKeywords; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }
}
