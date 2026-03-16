package com.resumebuilder.dto;

import java.util.List;

public class SuggestionsDTO {

    // Missing Skills Response
    public static class MissingSkillsResponse {
        private Long resumeId;
        private String targetRole;
        private List<SkillGap> missingSkills;
        private List<String> currentSkills;
        private int matchPercentage;
        
        public MissingSkillsResponse() {}
        
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private MissingSkillsResponse response = new MissingSkillsResponse();
            
            public Builder resumeId(Long resumeId) { response.resumeId = resumeId; return this; }
            public Builder targetRole(String targetRole) { response.targetRole = targetRole; return this; }
            public Builder missingSkills(List<SkillGap> missingSkills) { response.missingSkills = missingSkills; return this; }
            public Builder currentSkills(List<String> currentSkills) { response.currentSkills = currentSkills; return this; }
            public Builder matchPercentage(int matchPercentage) { response.matchPercentage = matchPercentage; return this; }
            
            public MissingSkillsResponse build() { return response; }
        }
        
        // Getters
        public Long getResumeId() { return resumeId; }
        public String getTargetRole() { return targetRole; }
        public List<SkillGap> getMissingSkills() { return missingSkills; }
        public List<String> getCurrentSkills() { return currentSkills; }
        public int getMatchPercentage() { return matchPercentage; }
    }

    // Skill Gap
    public static class SkillGap {
        private String skillName;
        private String priority;
        private String reason;
        private String category;
        
        public SkillGap() {}
        
        public SkillGap(String skillName, String priority, String reason, String category) {
            this.skillName = skillName;
            this.priority = priority;
            this.reason = reason;
            this.category = category;
        }
        
        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }
        
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }

    // AI Suggestions Request
    public static class AISuggestionsRequest {
        private Long resumeId;
        private String targetRole;
        private String company;
        private String jobDescription;
        
        public Long getResumeId() { return resumeId; }
        public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
        
        public String getTargetRole() { return targetRole; }
        public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
        
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        
        public String getJobDescription() { return jobDescription; }
        public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    }

    // AI Suggestions Response
    public static class AISuggestionsResponse {
        private Long resumeId;
        private String targetRole;
        private List<SkillSuggestion> skillSuggestions;
        private List<ProjectSuggestion> projectSuggestions;
        private List<String> keywordSuggestions;
        private List<String> improvementTips;
        
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private AISuggestionsResponse response = new AISuggestionsResponse();
            
            public Builder resumeId(Long resumeId) { response.resumeId = resumeId; return this; }
            public Builder targetRole(String targetRole) { response.targetRole = targetRole; return this; }
            public Builder skillSuggestions(List<SkillSuggestion> skillSuggestions) { response.skillSuggestions = skillSuggestions; return this; }
            public Builder projectSuggestions(List<ProjectSuggestion> projectSuggestions) { response.projectSuggestions = projectSuggestions; return this; }
            public Builder keywordSuggestions(List<String> keywordSuggestions) { response.keywordSuggestions = keywordSuggestions; return this; }
            public Builder improvementTips(List<String> improvementTips) { response.improvementTips = improvementTips; return this; }
            
            public AISuggestionsResponse build() { return response; }
        }
        
        // Getters
        public Long getResumeId() { return resumeId; }
        public String getTargetRole() { return targetRole; }
        public List<SkillSuggestion> getSkillSuggestions() { return skillSuggestions; }
        public List<ProjectSuggestion> getProjectSuggestions() { return projectSuggestions; }
        public List<String> getKeywordSuggestions() { return keywordSuggestions; }
        public List<String> getImprovementTips() { return improvementTips; }
    }

    // Skill Suggestion
    public static class SkillSuggestion {
        private String skillName;
        private String priority;
        private String reason;
        private String learningResource;
        
        public SkillSuggestion() {}
        
        public SkillSuggestion(String skillName, String priority, String reason, String learningResource) {
            this.skillName = skillName;
            this.priority = priority;
            this.reason = reason;
            this.learningResource = learningResource;
        }
        
        public String getSkillName() { return skillName; }
        public String getPriority() { return priority; }
        public String getReason() { return reason; }
        public String getLearningResource() { return learningResource; }
    }

    // Project Suggestion
    public static class ProjectSuggestion {
        private String projectTitle;
        private String description;
        private List<String> technologies;
        private String difficulty;
        private String estimatedTime;
        
        public ProjectSuggestion() {}
        
        public ProjectSuggestion(String projectTitle, String description, List<String> technologies, String difficulty, String estimatedTime) {
            this.projectTitle = projectTitle;
            this.description = description;
            this.technologies = technologies;
            this.difficulty = difficulty;
            this.estimatedTime = estimatedTime;
        }
        
        public String getProjectTitle() { return projectTitle; }
        public String getDescription() { return description; }
        public List<String> getTechnologies() { return technologies; }
        public String getDifficulty() { return difficulty; }
        public String getEstimatedTime() { return estimatedTime; }
    }
}
