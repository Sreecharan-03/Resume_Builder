package com.resumebuilder.controller;

import com.resumebuilder.dto.TemplateDTO;
import com.resumebuilder.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "*")
public class TemplateController {
    
    private final TemplateService templateService;
    
    @Autowired
    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }
    
    /**
     * Get all active templates
     * GET /api/templates
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTemplates() {
        List<TemplateDTO> templates = templateService.getAllTemplates();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", templates.size());
        response.put("templates", templates);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get template by ID
     * GET /api/templates/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTemplateById(@PathVariable Long id) {
        try {
            TemplateDTO template = templateService.getTemplateById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("template", template);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get templates by category
     * GET /api/templates/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getTemplatesByCategory(@PathVariable String category) {
        List<TemplateDTO> templates = templateService.getTemplatesByCategory(category);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("category", category);
        response.put("count", templates.size());
        response.put("templates", templates);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get free templates only
     * GET /api/templates/free
     */
    @GetMapping("/free")
    public ResponseEntity<Map<String, Object>> getFreeTemplates() {
        List<TemplateDTO> templates = templateService.getFreeTemplates();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", templates.size());
        response.put("templates", templates);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get pro templates only
     * GET /api/templates/pro
     */
    @GetMapping("/pro")
    public ResponseEntity<Map<String, Object>> getProTemplates() {
        List<TemplateDTO> templates = templateService.getProTemplates();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", templates.size());
        response.put("templates", templates);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get template filters/categories summary
     * GET /api/templates/filters
     */
    @GetMapping("/filters")
    public ResponseEntity<Map<String, Object>> getFilters() {
        List<TemplateDTO> allTemplates = templateService.getAllTemplates();
        
        long professionalCount = allTemplates.stream()
            .filter(t -> "professional".equals(t.getCategory()))
            .count();
        long creativeCount = allTemplates.stream()
            .filter(t -> "creative".equals(t.getCategory()))
            .count();
        long simpleCount = allTemplates.stream()
            .filter(t -> "simple".equals(t.getCategory()))
            .count();
        
        List<Map<String, Object>> filters = List.of(
            Map.of("id", "all", "label", "All Templates", "count", allTemplates.size()),
            Map.of("id", "professional", "label", "Professional", "count", professionalCount),
            Map.of("id", "creative", "label", "Creative", "count", creativeCount),
            Map.of("id", "simple", "label", "Simple", "count", simpleCount)
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("filters", filters);
        
        return ResponseEntity.ok(response);
    }
}
