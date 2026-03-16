package com.resumebuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ats_results")
public class ATSResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
    
    @Column(name = "overall_score")
    private Integer overallScore;
    
    @Column(name = "skills_match_score")
    private Integer skillsMatchScore;
    
    @Column(name = "project_relevance_score")
    private Integer projectRelevanceScore;
    
    @Column(name = "keyword_match_score")
    private Integer keywordMatchScore;
    
    @Column(name = "formatting_score")
    private Integer formattingScore;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "phase")
    private Phase phase = Phase.PHASE1;
    
    @Lob
    @Column(name = "section_scores", columnDefinition = "TEXT")
    private String sectionScores;
    
    @Lob
    @Column(name = "matched_keywords", columnDefinition = "TEXT")
    private String matchedKeywords;
    
    @Lob
    @Column(name = "missing_keywords", columnDefinition = "TEXT")
    private String missingKeywords;
    
    @Lob
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;
    
    @Lob
    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;
    
    @Lob
    @Column(name = "improvement_suggestions", columnDefinition = "TEXT")
    private String improvementSuggestions;
    
    @Lob
    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription;
    
    @Column(name = "target_role")
    private String targetRole;
    
    @Column(name = "is_ai_analyzed")
    private Boolean isAiAnalyzed = false;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public enum Phase {
        PHASE1,  // Build from scratch
        PHASE2,  // Improve existing
        PHASE3   // Role-based
    }
    
    public ATSResult() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public static ATSResultBuilder builder() {
        return new ATSResultBuilder();
    }
    
    public static class ATSResultBuilder {
        private Resume resume;
        private Integer overallScore;
        private Integer skillsMatchScore;
        private Integer projectRelevanceScore;
        private Integer keywordMatchScore;
        private Integer formattingScore;
        private Phase phase = Phase.PHASE1;
        private String sectionScores;
        private String matchedKeywords;
        private String missingKeywords;
        private String recommendations;
        private String aiFeedback;
        private String improvementSuggestions;
        private String jobDescription;
        private String targetRole;
        private Boolean isAiAnalyzed = false;
        
        public ATSResultBuilder resume(Resume resume) { this.resume = resume; return this; }
        public ATSResultBuilder overallScore(Integer overallScore) { this.overallScore = overallScore; return this; }
        public ATSResultBuilder skillsMatchScore(Integer skillsMatchScore) { this.skillsMatchScore = skillsMatchScore; return this; }
        public ATSResultBuilder projectRelevanceScore(Integer projectRelevanceScore) { this.projectRelevanceScore = projectRelevanceScore; return this; }
        public ATSResultBuilder keywordMatchScore(Integer keywordMatchScore) { this.keywordMatchScore = keywordMatchScore; return this; }
        public ATSResultBuilder formattingScore(Integer formattingScore) { this.formattingScore = formattingScore; return this; }
        public ATSResultBuilder phase(Phase phase) { this.phase = phase; return this; }
        public ATSResultBuilder sectionScores(String sectionScores) { this.sectionScores = sectionScores; return this; }
        public ATSResultBuilder matchedKeywords(String matchedKeywords) { this.matchedKeywords = matchedKeywords; return this; }
        public ATSResultBuilder missingKeywords(String missingKeywords) { this.missingKeywords = missingKeywords; return this; }
        public ATSResultBuilder recommendations(String recommendations) { this.recommendations = recommendations; return this; }
        public ATSResultBuilder aiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; return this; }
        public ATSResultBuilder improvementSuggestions(String improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; return this; }
        public ATSResultBuilder jobDescription(String jobDescription) { this.jobDescription = jobDescription; return this; }
        public ATSResultBuilder targetRole(String targetRole) { this.targetRole = targetRole; return this; }
        public ATSResultBuilder isAiAnalyzed(Boolean isAiAnalyzed) { this.isAiAnalyzed = isAiAnalyzed; return this; }
        
        public ATSResult build() {
            ATSResult result = new ATSResult();
            result.resume = this.resume;
            result.overallScore = this.overallScore;
            result.skillsMatchScore = this.skillsMatchScore;
            result.projectRelevanceScore = this.projectRelevanceScore;
            result.keywordMatchScore = this.keywordMatchScore;
            result.formattingScore = this.formattingScore;
            result.phase = this.phase;
            result.sectionScores = this.sectionScores;
            result.matchedKeywords = this.matchedKeywords;
            result.missingKeywords = this.missingKeywords;
            result.recommendations = this.recommendations;
            result.aiFeedback = this.aiFeedback;
            result.improvementSuggestions = this.improvementSuggestions;
            result.jobDescription = this.jobDescription;
            result.targetRole = this.targetRole;
            result.isAiAnalyzed = this.isAiAnalyzed;
            return result;
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    
    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }
    
    public Integer getSkillsMatchScore() { return skillsMatchScore; }
    public void setSkillsMatchScore(Integer skillsMatchScore) { this.skillsMatchScore = skillsMatchScore; }
    
    public Integer getProjectRelevanceScore() { return projectRelevanceScore; }
    public void setProjectRelevanceScore(Integer projectRelevanceScore) { this.projectRelevanceScore = projectRelevanceScore; }
    
    public Integer getKeywordMatchScore() { return keywordMatchScore; }
    public void setKeywordMatchScore(Integer keywordMatchScore) { this.keywordMatchScore = keywordMatchScore; }
    
    public Integer getFormattingScore() { return formattingScore; }
    public void setFormattingScore(Integer formattingScore) { this.formattingScore = formattingScore; }
    
    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }
    
    public String getSectionScores() { return sectionScores; }
    public void setSectionScores(String sectionScores) { this.sectionScores = sectionScores; }
    
    public String getMatchedKeywords() { return matchedKeywords; }
    public void setMatchedKeywords(String matchedKeywords) { this.matchedKeywords = matchedKeywords; }
    
    public String getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(String missingKeywords) { this.missingKeywords = missingKeywords; }
    
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    
    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }
    
    public String getImprovementSuggestions() { return improvementSuggestions; }
    public void setImprovementSuggestions(String improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; }
    
    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    
    public Boolean getIsAiAnalyzed() { return isAiAnalyzed; }
    public void setIsAiAnalyzed(Boolean isAiAnalyzed) { this.isAiAnalyzed = isAiAnalyzed; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
}