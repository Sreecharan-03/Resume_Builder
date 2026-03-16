package com.resumebuilder.dto;

public class TemplateDTO {
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
    private Integer sortOrder;
    
    public TemplateDTO() {}
    
    public TemplateDTO(Long id, String name, String style, String category, String badge,
                       Boolean isPro, String description, String primaryColor, String accentColor,
                       String previewImage, Integer sortOrder) {
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
        this.sortOrder = sortOrder;
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
    public Integer getSortOrder() { return sortOrder; }
    
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
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    
    public static TemplateDTOBuilder builder() { return new TemplateDTOBuilder(); }
    
    public static class TemplateDTOBuilder {
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
        private Integer sortOrder;
        
        public TemplateDTOBuilder id(Long id) { this.id = id; return this; }
        public TemplateDTOBuilder name(String name) { this.name = name; return this; }
        public TemplateDTOBuilder style(String style) { this.style = style; return this; }
        public TemplateDTOBuilder category(String category) { this.category = category; return this; }
        public TemplateDTOBuilder badge(String badge) { this.badge = badge; return this; }
        public TemplateDTOBuilder isPro(Boolean isPro) { this.isPro = isPro; return this; }
        public TemplateDTOBuilder description(String description) { this.description = description; return this; }
        public TemplateDTOBuilder primaryColor(String primaryColor) { this.primaryColor = primaryColor; return this; }
        public TemplateDTOBuilder accentColor(String accentColor) { this.accentColor = accentColor; return this; }
        public TemplateDTOBuilder previewImage(String previewImage) { this.previewImage = previewImage; return this; }
        public TemplateDTOBuilder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }
        
        public TemplateDTO build() {
            return new TemplateDTO(id, name, style, category, badge, isPro, description,
                                   primaryColor, accentColor, previewImage, sortOrder);
        }
    }
}
