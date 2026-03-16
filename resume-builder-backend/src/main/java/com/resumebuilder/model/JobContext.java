package com.resumebuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_contexts")
public class JobContext {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "company", nullable = false)
    private String company;
    
    @Column(name = "target_role", nullable = false)
    private String targetRole;
    
    @Column(name = "experience_level")
    private String experienceLevel;
    
    @Lob
    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription;
    
    @Lob
    @Column(name = "extracted_keywords", columnDefinition = "TEXT")
    private String extractedKeywords;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public JobContext() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public static JobContextBuilder builder() {
        return new JobContextBuilder();
    }
    
    public static class JobContextBuilder {
        private Resume resume;
        private User user;
        private String company;
        private String targetRole;
        private String experienceLevel;
        private String jobDescription;
        private String extractedKeywords;
        
        public JobContextBuilder resume(Resume resume) { this.resume = resume; return this; }
        public JobContextBuilder user(User user) { this.user = user; return this; }
        public JobContextBuilder company(String company) { this.company = company; return this; }
        public JobContextBuilder targetRole(String targetRole) { this.targetRole = targetRole; return this; }
        public JobContextBuilder experienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; return this; }
        public JobContextBuilder jobDescription(String jobDescription) { this.jobDescription = jobDescription; return this; }
        public JobContextBuilder extractedKeywords(String extractedKeywords) { this.extractedKeywords = extractedKeywords; return this; }
        
        public JobContext build() {
            JobContext context = new JobContext();
            context.resume = this.resume;
            context.user = this.user;
            context.company = this.company;
            context.targetRole = this.targetRole;
            context.experienceLevel = this.experienceLevel;
            context.jobDescription = this.jobDescription;
            context.extractedKeywords = this.extractedKeywords;
            return context;
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    
    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
    
    public String getExtractedKeywords() { return extractedKeywords; }
    public void setExtractedKeywords(String extractedKeywords) { this.extractedKeywords = extractedKeywords; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
