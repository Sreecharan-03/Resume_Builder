package com.resumebuilder.repository;

import com.resumebuilder.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    
    List<Template> findByIsActiveTrue();
    
    List<Template> findByIsActiveTrueOrderBySortOrderAsc();
    
    List<Template> findByCategoryAndIsActiveTrue(String category);
    
    List<Template> findByIsProFalseAndIsActiveTrue();
    
    List<Template> findByIsProTrueAndIsActiveTrue();
    
    boolean existsByNameIgnoreCase(String name);
}
