package com.resumebuilder.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ATSDTO {

    // ATS Analysis Request
    public static class AnalysisRequest {
        private String jobDescription;
        private String phase; // PHASE1, PHASE2, PHASE3
        private String targetRole;
        private boolean useAI = true;
        private List<String> templateSections;

        public AnalysisRequest() {
        }

        public AnalysisRequest(String jobDescription) {
            this.jobDescription = jobDescription;
        }

        public String getJobDescription() {
            return jobDescription;
        }

        public void setJobDescription(String jobDescription) {
            this.jobDescription = jobDescription;
        }

        public String getPhase() {
            return phase;
        }

        public void setPhase(String phase) {
            this.phase = phase;
        }

        public String getTargetRole() {
            return targetRole;
        }

        public void setTargetRole(String targetRole) {
            this.targetRole = targetRole;
        }

        public boolean isUseAI() {
            return useAI;
        }

        public void setUseAI(boolean useAI) {
            this.useAI = useAI;
        }

        public List<String> getTemplateSections() {
            return templateSections;
        }

        public void setTemplateSections(List<String> templateSections) {
            this.templateSections = templateSections;
        }
    }

    // ATS Calculate Request
    public static class CalculateRequest {
        private Long resumeId;
        private String jobDescription;
        private String phase; // PHASE1, PHASE2, PHASE3
        private String targetRole;
        private boolean useAI = true;
        private List<String> templateSections;

        public CalculateRequest() {}

        public Long getResumeId() { return resumeId; }
        public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
        public String getJobDescription() { return jobDescription; }
        public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
        public String getPhase() { return phase; }
        public void setPhase(String phase) { this.phase = phase; }
        public String getTargetRole() { return targetRole; }
        public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
        public boolean isUseAI() { return useAI; }
        public void setUseAI(boolean useAI) { this.useAI = useAI; }
        public List<String> getTemplateSections() { return templateSections; }
        public void setTemplateSections(List<String> templateSections) { this.templateSections = templateSections; }
    }

    // ATS Analysis Response
    public static class AnalysisResponse {
        private Long resumeId;
        private int overallScore;
        private int skillsMatchScore;
        private int projectRelevanceScore;
        private int keywordMatchScore;
        private int formattingScore;
        private String phase;
        private String targetRole;
        private String status; // POOR, AVERAGE, GOOD, EXCELLENT
        private Map<String, Integer> sectionScores;
        private List<String> matchedKeywords;
        private List<String> missingKeywords;
        private List<String> recommendations;
        private List<String> improvementSuggestions;
        private String aiFeedback;
        private String summary;
        private boolean isAiAnalyzed;
        private LocalDateTime analyzedAt;

        public AnalysisResponse() {
        }

        public Long getResumeId() {
            return resumeId;
        }

        public void setResumeId(Long resumeId) {
            this.resumeId = resumeId;
        }

        public int getOverallScore() {
            return overallScore;
        }

        public void setOverallScore(int overallScore) {
            this.overallScore = overallScore;
        }

        public int getSkillsMatchScore() {
            return skillsMatchScore;
        }

        public void setSkillsMatchScore(int skillsMatchScore) {
            this.skillsMatchScore = skillsMatchScore;
        }

        public int getProjectRelevanceScore() {
            return projectRelevanceScore;
        }

        public void setProjectRelevanceScore(int projectRelevanceScore) {
            this.projectRelevanceScore = projectRelevanceScore;
        }

        public int getKeywordMatchScore() {
            return keywordMatchScore;
        }

        public void setKeywordMatchScore(int keywordMatchScore) {
            this.keywordMatchScore = keywordMatchScore;
        }

        public int getFormattingScore() {
            return formattingScore;
        }

        public void setFormattingScore(int formattingScore) {
            this.formattingScore = formattingScore;
        }

        public String getPhase() {
            return phase;
        }

        public void setPhase(String phase) {
            this.phase = phase;
        }

        public String getTargetRole() {
            return targetRole;
        }

        public void setTargetRole(String targetRole) {
            this.targetRole = targetRole;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Map<String, Integer> getSectionScores() {
            return sectionScores;
        }

        public void setSectionScores(Map<String, Integer> sectionScores) {
            this.sectionScores = sectionScores;
        }

        public List<String> getMatchedKeywords() {
            return matchedKeywords;
        }

        public void setMatchedKeywords(List<String> matchedKeywords) {
            this.matchedKeywords = matchedKeywords;
        }

        public List<String> getMissingKeywords() {
            return missingKeywords;
        }

        public void setMissingKeywords(List<String> missingKeywords) {
            this.missingKeywords = missingKeywords;
        }

        public List<String> getRecommendations() {
            return recommendations;
        }

        public void setRecommendations(List<String> recommendations) {
            this.recommendations = recommendations;
        }

        public List<String> getImprovementSuggestions() {
            return improvementSuggestions;
        }

        public void setImprovementSuggestions(List<String> improvementSuggestions) {
            this.improvementSuggestions = improvementSuggestions;
        }

        public String getAiFeedback() {
            return aiFeedback;
        }

        public void setAiFeedback(String aiFeedback) {
            this.aiFeedback = aiFeedback;
        }

        public String getSummary() {
            return summary;
        }

        public void setSummary(String summary) {
            this.summary = summary;
        }

        public boolean isAiAnalyzed() {
            return isAiAnalyzed;
        }

        public void setAiAnalyzed(boolean isAiAnalyzed) {
            this.isAiAnalyzed = isAiAnalyzed;
        }

        public LocalDateTime getAnalyzedAt() {
            return analyzedAt;
        }

        public void setAnalyzedAt(LocalDateTime analyzedAt) {
            this.analyzedAt = analyzedAt;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private final AnalysisResponse response = new AnalysisResponse();

            public Builder resumeId(Long resumeId) {
                response.setResumeId(resumeId);
                return this;
            }

            public Builder overallScore(int overallScore) {
                response.setOverallScore(overallScore);
                return this;
            }

            public Builder skillsMatchScore(int skillsMatchScore) {
                response.setSkillsMatchScore(skillsMatchScore);
                return this;
            }

            public Builder projectRelevanceScore(int projectRelevanceScore) {
                response.setProjectRelevanceScore(projectRelevanceScore);
                return this;
            }

            public Builder keywordMatchScore(int keywordMatchScore) {
                response.setKeywordMatchScore(keywordMatchScore);
                return this;
            }

            public Builder formattingScore(int formattingScore) {
                response.setFormattingScore(formattingScore);
                return this;
            }

            public Builder phase(String phase) {
                response.setPhase(phase);
                return this;
            }

            public Builder targetRole(String targetRole) {
                response.setTargetRole(targetRole);
                return this;
            }

            public Builder status(String status) {
                response.setStatus(status);
                return this;
            }

            public Builder sectionScores(Map<String, Integer> sectionScores) {
                response.setSectionScores(sectionScores);
                return this;
            }

            public Builder matchedKeywords(List<String> matchedKeywords) {
                response.setMatchedKeywords(matchedKeywords);
                return this;
            }

            public Builder missingKeywords(List<String> missingKeywords) {
                response.setMissingKeywords(missingKeywords);
                return this;
            }

            public Builder recommendations(List<String> recommendations) {
                response.setRecommendations(recommendations);
                return this;
            }

            public Builder improvementSuggestions(List<String> improvementSuggestions) {
                response.setImprovementSuggestions(improvementSuggestions);
                return this;
            }

            public Builder aiFeedback(String aiFeedback) {
                response.setAiFeedback(aiFeedback);
                return this;
            }

            public Builder summary(String summary) {
                response.setSummary(summary);
                return this;
            }

            public Builder isAiAnalyzed(boolean isAiAnalyzed) {
                response.setAiAnalyzed(isAiAnalyzed);
                return this;
            }

            public Builder analyzedAt(LocalDateTime analyzedAt) {
                response.setAnalyzedAt(analyzedAt);
                return this;
            }

            public AnalysisResponse build() {
                return response;
            }
        }
    }

    // Keyword Match Result
    public static class KeywordMatchResult {
        private String keyword;
        private boolean found;
        private int frequency;
        private String context;

        public KeywordMatchResult() {
        }

        public KeywordMatchResult(String keyword, boolean found, int frequency, String context) {
            this.keyword = keyword;
            this.found = found;
            this.frequency = frequency;
            this.context = context;
        }

        public String getKeyword() {
            return keyword;
        }

        public void setKeyword(String keyword) {
            this.keyword = keyword;
        }

        public boolean isFound() {
            return found;
        }

        public void setFound(boolean found) {
            this.found = found;
        }

        public int getFrequency() {
            return frequency;
        }

        public void setFrequency(int frequency) {
            this.frequency = frequency;
        }

        public String getContext() {
            return context;
        }

        public void setContext(String context) {
            this.context = context;
        }
    }

    // Recommendation Response
    public static class RecommendationResponse {
        private Long resumeId;
        private String targetRole;
        private List<SkillRecommendation> skillRecommendations;
        private List<String> contentImprovements;
        private List<String> formatSuggestions;

        public RecommendationResponse() {
        }

        public Long getResumeId() {
            return resumeId;
        }

        public void setResumeId(Long resumeId) {
            this.resumeId = resumeId;
        }

        public String getTargetRole() {
            return targetRole;
        }

        public void setTargetRole(String targetRole) {
            this.targetRole = targetRole;
        }

        public List<SkillRecommendation> getSkillRecommendations() {
            return skillRecommendations;
        }

        public void setSkillRecommendations(List<SkillRecommendation> skillRecommendations) {
            this.skillRecommendations = skillRecommendations;
        }

        public List<String> getContentImprovements() {
            return contentImprovements;
        }

        public void setContentImprovements(List<String> contentImprovements) {
            this.contentImprovements = contentImprovements;
        }

        public List<String> getFormatSuggestions() {
            return formatSuggestions;
        }

        public void setFormatSuggestions(List<String> formatSuggestions) {
            this.formatSuggestions = formatSuggestions;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private final RecommendationResponse response = new RecommendationResponse();

            public Builder resumeId(Long resumeId) {
                response.setResumeId(resumeId);
                return this;
            }

            public Builder targetRole(String targetRole) {
                response.setTargetRole(targetRole);
                return this;
            }

            public Builder skillRecommendations(List<SkillRecommendation> skillRecommendations) {
                response.setSkillRecommendations(skillRecommendations);
                return this;
            }

            public Builder contentImprovements(List<String> contentImprovements) {
                response.setContentImprovements(contentImprovements);
                return this;
            }

            public Builder formatSuggestions(List<String> formatSuggestions) {
                response.setFormatSuggestions(formatSuggestions);
                return this;
            }

            public RecommendationResponse build() {
                return response;
            }
        }
    }

    // Skill Recommendation
    public static class SkillRecommendation {
        private String skill;
        private String priority;
        private String reason;

        public SkillRecommendation() {
        }

        public SkillRecommendation(String skill, String priority, String reason) {
            this.skill = skill;
            this.priority = priority;
            this.reason = reason;
        }

        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}
