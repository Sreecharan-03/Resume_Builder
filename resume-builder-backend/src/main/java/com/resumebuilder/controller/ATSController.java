package com.resumebuilder.controller;

import com.resumebuilder.dto.ApiResponse;
import com.resumebuilder.dto.ATSDTO;
import com.resumebuilder.service.ATSService;
import com.resumebuilder.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ats")
public class ATSController {
    
    private final ATSService atsService;
    private final RecommendationService recommendationService;

    public ATSController(ATSService atsService, RecommendationService recommendationService) {
        this.atsService = atsService;
        this.recommendationService = recommendationService;
    }
    
    /**
     * AI-assisted ATS analysis for a resume
     */
    @PostMapping("/analyze/{resumeId}")
    public ResponseEntity<ApiResponse<ATSDTO.AnalysisResponse>> analyzeResume(
            Authentication authentication,
            @PathVariable Long resumeId,
            @RequestBody(required = false) ATSDTO.AnalysisRequest request) {
        try {
            String email = authentication.getName();
            String jobDescription = request != null ? request.getJobDescription() : null;
            String phase = request != null && request.getPhase() != null ? request.getPhase() : "PHASE3";
            String targetRole = request != null ? request.getTargetRole() : null;
            boolean useAI = request == null || request.isUseAI();
            List<String> templateSections = request != null ? request.getTemplateSections() : null;
            
            ATSDTO.AnalysisResponse response = atsService.analyzeResumeWithPhase(
                    resumeId, jobDescription, phase, targetRole, useAI, templateSections, email);
            return ResponseEntity.ok(ApiResponse.success("Resume analyzed successfully with AI", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get latest ATS result for a resume
     */
    @GetMapping("/result/{resumeId}")
    public ResponseEntity<ApiResponse<ATSDTO.AnalysisResponse>> getATSResult(
            Authentication authentication,
            @PathVariable Long resumeId) {
        try {
            String email = authentication.getName();
            ATSDTO.AnalysisResponse response = atsService.getLatestResult(resumeId, email);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get recommendations for a resume
     */
    @GetMapping("/recommendations/{resumeId}")
    public ResponseEntity<ApiResponse<ATSDTO.RecommendationResponse>> getRecommendations(
            Authentication authentication,
            @PathVariable Long resumeId) {
        try {
            String email = authentication.getName();
            ATSDTO.RecommendationResponse response = recommendationService.getRecommendations(resumeId, email);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Calculate ATS score with AI assistance
     */
    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<ATSDTO.AnalysisResponse>> calculateATS(
            Authentication authentication,
            @RequestBody ATSDTO.CalculateRequest request) {
        try {
            String email = authentication.getName();
            String phase = request.getPhase() != null ? request.getPhase() : "PHASE3";
            boolean useAI = request.isUseAI();
            List<String> templateSections = request.getTemplateSections();
            
            ATSDTO.AnalysisResponse response = atsService.analyzeResumeWithPhase(
                    request.getResumeId(), 
                    request.getJobDescription(),
                    phase,
                    request.getTargetRole(),
                    useAI,
                    templateSections,
                    email);
            return ResponseEntity.ok(ApiResponse.success("ATS score calculated with AI assistance", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get ATS result by resume ID (alternative endpoint)
     */
    @GetMapping("/{resumeId}")
    public ResponseEntity<ApiResponse<ATSDTO.AnalysisResponse>> getATSByResumeId(
            Authentication authentication,
            @PathVariable Long resumeId) {
        try {
            String email = authentication.getName();
            ATSDTO.AnalysisResponse response = atsService.getLatestResult(resumeId, email);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
