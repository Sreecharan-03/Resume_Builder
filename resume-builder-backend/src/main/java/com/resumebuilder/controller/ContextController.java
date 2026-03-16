package com.resumebuilder.controller;

import com.resumebuilder.dto.ContextDTO;
import com.resumebuilder.service.ContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/context")
@CrossOrigin(origins = "*")
public class ContextController {

    private final ContextService contextService;

    public ContextController(ContextService contextService) {
        this.contextService = contextService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveContext(@RequestBody ContextDTO.SaveContextRequest request,
                                         Authentication authentication) {
        try {
            String email = authentication.getName();
            ContextDTO.ContextResponse response = contextService.saveContext(request, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<?> getContext(@PathVariable Long resumeId,
                                        Authentication authentication) {
        try {
            String email = authentication.getName();
            ContextDTO.ContextResponse response = contextService.getContext(resumeId, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
