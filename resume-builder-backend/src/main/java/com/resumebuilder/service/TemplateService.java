package com.resumebuilder.service;

import com.resumebuilder.dto.TemplateDTO;
import com.resumebuilder.model.Template;
import com.resumebuilder.repository.TemplateRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateService {
    
    private final TemplateRepository templateRepository;
    
    @Autowired
    public TemplateService(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }
    
    /**
     * Initialize default templates if none exist
     */
    @PostConstruct
    @Transactional
    public void initializeTemplates() {
        if (templateRepository.count() == 0) {
            createDefaultTemplates();
        }
    }
    
    private void createDefaultTemplates() {
        List<Template> defaultTemplates = List.of(
            Template.builder().name("Modern Professional").style("modern").category("professional")
                .badge("Popular").isPro(false).description("Clean and modern design with bold headers")
                .primaryColor("#2563eb").accentColor("#3b82f6").sortOrder(1).isActive(true).build(),
            
            Template.builder().name("Creative Designer").style("creative").category("creative")
                .badge("New").isPro(false).description("Colorful and eye-catching for creative roles")
                .primaryColor("#8b5cf6").accentColor("#a78bfa").sortOrder(2).isActive(true).build(),
            
            Template.builder().name("Minimal Clean").style("minimal").category("simple")
                .badge(null).isPro(false).description("Simple and clean with maximum readability")
                .primaryColor("#374151").accentColor("#6b7280").sortOrder(3).isActive(true).build(),
            
            Template.builder().name("Executive Classic").style("executive").category("professional")
                .badge("Popular").isPro(false).description("Traditional layout for senior positions")
                .primaryColor("#1e3a5f").accentColor("#2563eb").sortOrder(4).isActive(true).build(),
            
            Template.builder().name("Tech Innovator").style("tech").category("creative")
                .badge("New").isPro(false).description("Dark tech theme ideal for developers")
                .primaryColor("#06b6d4").accentColor("#22d3ee").sortOrder(5).isActive(true).build(),
            
            Template.builder().name("Elegant Serif").style("elegant").category("professional")
                .badge(null).isPro(false).description("Sophisticated serif typography")
                .primaryColor("#78350f").accentColor("#92400e").sortOrder(6).isActive(true).build(),
            
            Template.builder().name("Bold Impact").style("bold").category("creative")
                .badge(null).isPro(false).description("Strong visual impact with bold typography")
                .primaryColor("#dc2626").accentColor("#ef4444").sortOrder(7).isActive(true).build(),
            
            Template.builder().name("Corporate Pro").style("corporate").category("professional")
                .badge(null).isPro(false).description("Professional corporate look")
                .primaryColor("#0f172a").accentColor("#1e293b").sortOrder(8).isActive(true).build(),
            
            Template.builder().name("Academic Scholar").style("academic").category("professional")
                .badge(null).isPro(false).description("Perfect for academic and research roles")
                .primaryColor("#166534").accentColor("#15803d").sortOrder(9).isActive(true).build(),
            
            Template.builder().name("Startup Vibe").style("startup").category("creative")
                .badge(null).isPro(false).description("Modern startup culture design")
                .primaryColor("#ea580c").accentColor("#f97316").sortOrder(10).isActive(true).build(),
            
            Template.builder().name("Healthcare Pro").style("healthcare").category("professional")
                .badge(null).isPro(false).description("Designed for healthcare professionals")
                .primaryColor("#0891b2").accentColor("#06b6d4").sortOrder(11).isActive(true).build(),
            
            Template.builder().name("Finance Expert").style("finance").category("professional")
                .badge(null).isPro(false).description("Formal design for finance industry")
                .primaryColor("#1e40af").accentColor("#2563eb").sortOrder(12).isActive(true).build(),
            
            Template.builder().name("Artistic Portfolio").style("artistic").category("creative")
                .badge("Pro").isPro(true).description("Creative portfolio style layout")
                .primaryColor("#be185d").accentColor("#db2777").sortOrder(13).isActive(true).build(),
            
            Template.builder().name("Clean Sidebar").style("sidebar").category("professional")
                .badge(null).isPro(false).description("Modern two-column sidebar design")
                .primaryColor("#4338ca").accentColor("#6366f1").sortOrder(14).isActive(true).build(),
            
            Template.builder().name("Minimal Plus").style("minimal-plus").category("simple")
                .badge(null).isPro(false).description("Enhanced minimalist design")
                .primaryColor("#525252").accentColor("#737373").sortOrder(15).isActive(true).build(),
            
            Template.builder().name("Marketing Pro").style("marketing").category("creative")
                .badge(null).isPro(false).description("Perfect for marketing professionals")
                .primaryColor("#7c3aed").accentColor("#8b5cf6").sortOrder(16).isActive(true).build(),
            
            Template.builder().name("Engineering Focus").style("engineering").category("professional")
                .badge(null).isPro(false).description("Technical focus for engineers")
                .primaryColor("#0369a1").accentColor("#0284c7").sortOrder(17).isActive(true).build(),
            
            Template.builder().name("Consultant Elite").style("consultant").category("professional")
                .badge("Pro").isPro(true).description("Elite design for consultants")
                .primaryColor("#115e59").accentColor("#0d9488").sortOrder(18).isActive(true).build(),
            
            Template.builder().name("Fresh Graduate").style("graduate").category("simple")
                .badge("Free").isPro(false).description("Perfect for new graduates")
                .primaryColor("#059669").accentColor("#10b981").sortOrder(19).isActive(true).build(),
            
            Template.builder().name("Premium Executive").style("premium").category("professional")
                .badge("Pro").isPro(true).description("Luxury design for C-level executives")
                .primaryColor("#78350f").accentColor("#b45309").sortOrder(20).isActive(true).build()
        );
        
        templateRepository.saveAll(defaultTemplates);
    }
    
    /**
     * Get all active templates
     */
    public List<TemplateDTO> getAllTemplates() {
        return templateRepository.findByIsActiveTrueOrderBySortOrderAsc()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get template by ID
     */
    public TemplateDTO getTemplateById(Long id) {
        return templateRepository.findById(id)
            .map(this::toDTO)
            .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
    }
    
    /**
     * Get templates by category
     */
    public List<TemplateDTO> getTemplatesByCategory(String category) {
        if ("all".equalsIgnoreCase(category)) {
            return getAllTemplates();
        }
        return templateRepository.findByCategoryAndIsActiveTrue(category)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get free templates only
     */
    public List<TemplateDTO> getFreeTemplates() {
        return templateRepository.findByIsProFalseAndIsActiveTrue()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get pro templates only
     */
    public List<TemplateDTO> getProTemplates() {
        return templateRepository.findByIsProTrueAndIsActiveTrue()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Convert Entity to DTO
     */
    private TemplateDTO toDTO(Template template) {
        return TemplateDTO.builder()
            .id(template.getId())
            .name(template.getName())
            .style(template.getStyle())
            .category(template.getCategory())
            .badge(template.getBadge())
            .isPro(template.getIsPro())
            .description(template.getDescription())
            .primaryColor(template.getPrimaryColor())
            .accentColor(template.getAccentColor())
            .previewImage(template.getPreviewImage())
            .sortOrder(template.getSortOrder())
            .build();
    }
}
