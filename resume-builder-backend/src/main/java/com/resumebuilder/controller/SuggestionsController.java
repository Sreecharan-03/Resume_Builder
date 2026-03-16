package com.resumebuilder.controller;

import com.resumebuilder.dto.SuggestionsDTO;
import com.resumebuilder.service.SuggestionsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SuggestionsController {

    private final SuggestionsService suggestionsService;

    public SuggestionsController(SuggestionsService suggestionsService) {
        this.suggestionsService = suggestionsService;
    }

    @GetMapping("/skills/missing/{resumeId}")
    public ResponseEntity<?> getMissingSkills(@PathVariable Long resumeId,
                                               Authentication authentication) {
        try {
            String email = authentication.getName();
            SuggestionsDTO.MissingSkillsResponse response = suggestionsService.getMissingSkills(resumeId, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/suggestions/ai")
    public ResponseEntity<?> getAISuggestions(@RequestBody SuggestionsDTO.AISuggestionsRequest request,
                                               Authentication authentication) {
        try {
            String email = authentication.getName();
            SuggestionsDTO.AISuggestionsResponse response = suggestionsService.getAISuggestions(request, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
