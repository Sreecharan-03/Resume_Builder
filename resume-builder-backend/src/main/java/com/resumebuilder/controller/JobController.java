package com.resumebuilder.controller;

import com.resumebuilder.dto.ApiResponse;
import com.resumebuilder.dto.JobDTO;
import com.resumebuilder.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<JobDTO.JobSearchResponse>> getJobs(
            Authentication authentication,
            @RequestParam String role,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Long resumeId) {
        try {
            String email = authentication != null ? authentication.getName() : null;
            JobDTO.JobSearchResponse response = jobService.fetchJobs(role, page, limit, resumeId, email);
            return ResponseEntity.ok(ApiResponse.success("Jobs fetched successfully", response));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/generate-content")
    public ResponseEntity<ApiResponse<JobDTO.GeneratedContentResponse>> generateContent(
            Authentication authentication,
            @RequestBody JobDTO.GenerateContentRequest request) {
        try {
            String email = resolveEmail(authentication);
            JobDTO.GeneratedContentResponse response = jobService.generateContent(request, email);
            return ResponseEntity.ok(ApiResponse.success("AI content generated successfully", response));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    private String resolveEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new IllegalArgumentException("Authentication is required");
        }
        return authentication.getName();
    }
}
