package com.resumebuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
public class Resume {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "target_role")
    private String targetRole;
    
    // Personal Information
    @Column(name = "full_name")
    private String fullName;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "location")
    private String location;
    
    // Resume Sections
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;
    
    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;
    
    @Column(name = "experience", columnDefinition = "TEXT")
    private String experience;
    
    @Column(name = "education", columnDefinition = "TEXT")
    private String education;
    
    @Column(name = "certifications", columnDefinition = "TEXT")
    private String certifications;
    
    @Column(name = "projects", columnDefinition = "TEXT")
    private String projects;
    
    @Column(name = "coding_profiles", columnDefinition = "TEXT")
    private String codingProfiles;
    
    @Column(name = "languages", columnDefinition = "TEXT")
    private String languages;
    
    @Column(name = "activities", columnDefinition = "TEXT")
    private String activities;
    
    @Column(name = "hobbies", columnDefinition = "TEXT")
    private String hobbies;
    
    @Column(name = "template_id")
    private String templateId;
    
    @Column(name = "ats_score")
    private Integer atsScore;
    
    @Enumerated(EnumType.STRING)
    private ResumeStatus status = ResumeStatus.DRAFT;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum ResumeStatus {
        DRAFT, COMPLETED, ARCHIVED
    }
    
    public Resume() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public static ResumeBuilder builder() {
        return new ResumeBuilder();
    }
    
    public static class ResumeBuilder {
        private String title;
        private String targetRole;
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String summary;
        private String skills;
        private String experience;
        private String education;
        private String certifications;
        private String projects;
        private String codingProfiles;
        private String languages;
        private String activities;
        private String hobbies;
        private String templateId;
        private Integer atsScore;
        private ResumeStatus status = ResumeStatus.DRAFT;
        private User user;
        
        public ResumeBuilder title(String title) { this.title = title; return this; }
        public ResumeBuilder targetRole(String targetRole) { this.targetRole = targetRole; return this; }
        public ResumeBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public ResumeBuilder email(String email) { this.email = email; return this; }
        public ResumeBuilder phone(String phone) { this.phone = phone; return this; }
        public ResumeBuilder location(String location) { this.location = location; return this; }
        public ResumeBuilder summary(String summary) { this.summary = summary; return this; }
        public ResumeBuilder skills(String skills) { this.skills = skills; return this; }
        public ResumeBuilder experience(String experience) { this.experience = experience; return this; }
        public ResumeBuilder education(String education) { this.education = education; return this; }
        public ResumeBuilder certifications(String certifications) { this.certifications = certifications; return this; }
        public ResumeBuilder projects(String projects) { this.projects = projects; return this; }
        public ResumeBuilder codingProfiles(String codingProfiles) { this.codingProfiles = codingProfiles; return this; }
        public ResumeBuilder languages(String languages) { this.languages = languages; return this; }
        public ResumeBuilder activities(String activities) { this.activities = activities; return this; }
        public ResumeBuilder hobbies(String hobbies) { this.hobbies = hobbies; return this; }
        public ResumeBuilder templateId(String templateId) { this.templateId = templateId; return this; }
        public ResumeBuilder atsScore(Integer atsScore) { this.atsScore = atsScore; return this; }
        public ResumeBuilder status(ResumeStatus status) { this.status = status; return this; }
        public ResumeBuilder user(User user) { this.user = user; return this; }
        
        public Resume build() {
            Resume resume = new Resume();
            resume.title = this.title;
            resume.targetRole = this.targetRole;
            resume.fullName = this.fullName;
            resume.email = this.email;
            resume.phone = this.phone;
            resume.location = this.location;
            resume.summary = this.summary;
            resume.skills = this.skills;
            resume.experience = this.experience;
            resume.education = this.education;
            resume.certifications = this.certifications;
            resume.projects = this.projects;
            resume.codingProfiles = this.codingProfiles;
            resume.languages = this.languages;
            resume.activities = this.activities;
            resume.hobbies = this.hobbies;
            resume.templateId = this.templateId;
            resume.atsScore = this.atsScore;
            resume.status = this.status;
            resume.user = this.user;
            return resume;
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    
    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }
    
    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }
    
    public String getCodingProfiles() { return codingProfiles; }
    public void setCodingProfiles(String codingProfiles) { this.codingProfiles = codingProfiles; }
    
    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }
    
    public String getActivities() { return activities; }
    public void setActivities(String activities) { this.activities = activities; }
    
    public String getHobbies() { return hobbies; }
    public void setHobbies(String hobbies) { this.hobbies = hobbies; }
    
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
    
    public Integer getAtsScore() { return atsScore; }
    public void setAtsScore(Integer atsScore) { this.atsScore = atsScore; }
    
    public ResumeStatus getStatus() { return status; }
    public void setStatus(ResumeStatus status) { this.status = status; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
