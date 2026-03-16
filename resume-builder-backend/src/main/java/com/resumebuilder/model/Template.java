package com.resumebuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "templates")
public class Template {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String style;
    
    @Column(nullable = false)
    private String category;
    
    private String badge;
    
    @Column(nullable = false)
    private Boolean isPro;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private String primaryColor;
    
    private String accentColor;
    
    private String previewImage;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    private Integer sortOrder;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public Template() {}
    
    public Template(Long id, String name, String style, String category, String badge, 
                    Boolean isPro, String description, String primaryColor, String accentColor,
                    String previewImage, Boolean isActive, Integer sortOrder) {
        this.id = id;
        this.name = name;
        this.style = style;
        this.category = category;
        this.badge = badge;
        this.isPro = isPro;
        this.description = description;
        this.primaryColor = primaryColor;
        this.accentColor = accentColor;
        this.previewImage = previewImage;
        this.isActive = isActive;
        this.sortOrder = sortOrder;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
        if (isPro == null) isPro = false;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getStyle() { return style; }
    public String getCategory() { return category; }
    public String getBadge() { return badge; }
    public Boolean getIsPro() { return isPro; }
    public String getDescription() { return description; }
    public String getPrimaryColor() { return primaryColor; }
    public String getAccentColor() { return accentColor; }
    public String getPreviewImage() { return previewImage; }
    public Boolean getIsActive() { return isActive; }
    public Integer getSortOrder() { return sortOrder; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setStyle(String style) { this.style = style; }
    public void setCategory(String category) { this.category = category; }
    public void setBadge(String badge) { this.badge = badge; }
    public void setIsPro(Boolean isPro) { this.isPro = isPro; }
    public void setDescription(String description) { this.description = description; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }
    public void setPreviewImage(String previewImage) { this.previewImage = previewImage; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    
    public static TemplateBuilder builder() { return new TemplateBuilder(); }
    
    public static class TemplateBuilder {
        private Long id;
        private String name;
        private String style;
        private String category;
        private String badge;
        private Boolean isPro;
        private String description;
        private String primaryColor;
        private String accentColor;
        private String previewImage;
        private Boolean isActive;
        private Integer sortOrder;
        
        public TemplateBuilder id(Long id) { this.id = id; return this; }
        public TemplateBuilder name(String name) { this.name = name; return this; }
        public TemplateBuilder style(String style) { this.style = style; return this; }
        public TemplateBuilder category(String category) { this.category = category; return this; }
        public TemplateBuilder badge(String badge) { this.badge = badge; return this; }
        public TemplateBuilder isPro(Boolean isPro) { this.isPro = isPro; return this; }
        public TemplateBuilder description(String description) { this.description = description; return this; }
        public TemplateBuilder primaryColor(String primaryColor) { this.primaryColor = primaryColor; return this; }
        public TemplateBuilder accentColor(String accentColor) { this.accentColor = accentColor; return this; }
        public TemplateBuilder previewImage(String previewImage) { this.previewImage = previewImage; return this; }
        public TemplateBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public TemplateBuilder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }
        
        public Template build() {
            return new Template(id, name, style, category, badge, isPro, description, 
                               primaryColor, accentColor, previewImage, isActive, sortOrder);
        }
    }
}
