package com.resumebuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_suggestions")
public class SkillSuggestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
    
    @Column(name = "skill_name", nullable = false)
    private String skillName;
    
    @Column(name = "priority")
    private String priority;
    
    @Column(name = "reason")
    private String reason;
    
    @Column(name = "is_added")
    private boolean isAdded = false;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public SkillSuggestion() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public boolean isAdded() { return isAdded; }
    public void setAdded(boolean added) { isAdded = added; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
}
