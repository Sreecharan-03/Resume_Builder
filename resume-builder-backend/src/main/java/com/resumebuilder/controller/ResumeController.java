package com.resumebuilder.controller;

import com.resumebuilder.dto.ApiResponse;
import com.resumebuilder.dto.ResumeDTO;
import com.resumebuilder.service.ResumeService;
import com.resumebuilder.service.ResumeParserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.io.StringWriter;
import java.io.PrintWriter;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ResumeController.class);

    private final ResumeService resumeService;
    private final ResumeParserService resumeParserService;

    public ResumeController(ResumeService resumeService, ResumeParserService resumeParserService) {
        this.resumeService = resumeService;
        this.resumeParserService = resumeParserService;
    }
    
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ResumeDTO.ResumeResponse>> createResume(
            Authentication authentication,
            @Valid @RequestBody ResumeDTO.CreateResumeRequest request) {
        try {
            String email = authentication.getName();
            ResumeDTO.ResumeResponse response = resumeService.createResume(request, email);
            return ResponseEntity.ok(ApiResponse.success("Resume created successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResumeDTO.ResumeResponse>> getResume(
            Authentication authentication,
            @PathVariable Long id) {
        try {
            String email = authentication.getName();
            ResumeDTO.ResumeResponse response = resumeService.getResumeById(id, email);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResumeDTO.ResumeResponse>> updateResume(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ResumeDTO.UpdateResumeRequest request) {
        try {
            String email = authentication.getName();
            ResumeDTO.ResumeResponse response = resumeService.updateResume(id, request, email);
            return ResponseEntity.ok(ApiResponse.success("Resume updated successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            Authentication authentication,
            @PathVariable Long id) {
        try {
            String email = authentication.getName();
            resumeService.deleteResume(id, email);
            return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<ResumeDTO.ResumeListResponse>> getAllResumes(
            Authentication authentication) {
        try {
            String email = authentication.getName();
            ResumeDTO.ResumeListResponse response = resumeService.getAllResumes(email);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<ResumeDTO.ResumeListResponse>> getResumesByUserId(
            Authentication authentication,
            @PathVariable Long userId) {
        try {
            String email = authentication.getName();
            ResumeDTO.ResumeListResponse response = resumeService.getResumesByUserId(userId, email);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/draft")
    public ResponseEntity<ApiResponse<ResumeDTO.ResumeResponse>> createDraft(
            Authentication authentication,
            @Valid @RequestBody ResumeDTO.CreateResumeRequest request) {
        try {
            String email = authentication.getName();
            ResumeDTO.ResumeResponse response = resumeService.createDraft(request, email);
            return ResponseEntity.ok(ApiResponse.success("Draft created successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ResumeDTO.ResumeResponse>> uploadResume(
            Authentication authentication,
            @RequestBody ResumeDTO.UploadResumeRequest request) {
        try {
            String email = authentication.getName();
            ResumeDTO.ResumeResponse response = resumeService.uploadResume(request, email);
            return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Upload and parse a resume file (PDF, DOC, DOCX)
     * This extracts text and parses it into structured data
     */
    @PostMapping("/upload-file")
    public ResponseEntity<?> uploadResumeFile(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        // Validate file early
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Please select a file to upload"));
        }

        String filename = file.getOriginalFilename();
        if (filename == null || (!filename.toLowerCase().endsWith(".pdf")
                && !filename.toLowerCase().endsWith(".doc")
                && !filename.toLowerCase().endsWith(".docx"))) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Please upload a PDF, DOC, or DOCX file"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Resume parsed (best-effort)");

        String extractedText = "";
        int atsScore = 0;
        List<String> atsSuggestions = new ArrayList<>();
        ResumeParserService.ParsedResume parsedResume = null;
        String debugSnippet = "";

        try {
            // Try safe extraction first
            extractedText = resumeParserService.safeExtractText(file);

            // Compute ATS score and suggestions
            atsScore = resumeParserService.calculateATSScore(extractedText);
            atsSuggestions = resumeParserService.getATSSuggestions(atsScore, extractedText);

            // Try AI parsing but do not fail the endpoint if AI throws
            try {
                parsedResume = resumeParserService.parseResumeWithAI(extractedText);
            } catch (Exception aiEx) {
                logger.warn("AI parsing failed, falling back to rule-based parse: {}", aiEx.getMessage());
                try {
                    parsedResume = resumeParserService.parseResume(extractedText);
                } catch (Exception fallbackEx) {
                    logger.error("Both AI and rule-based parsing failed", fallbackEx);
                    // Keep parsedResume null and include debug info
                    StringWriter sw = new StringWriter();
                    fallbackEx.printStackTrace(new PrintWriter(sw));
                    String[] lines = sw.toString().split("\\r?\\n");
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < Math.min(lines.length, 5); i++) sb.append(lines[i]).append("\n");
                    debugSnippet = sb.toString();
                    parsedResume = new ResumeParserService.ParsedResume();
                }
            }
        } catch (Exception outerEx) {
            logger.error("Unexpected error during upload-file processing", outerEx);
            // Record limited debug info but continue to return success with partial data
            StringWriter sw = new StringWriter();
            outerEx.printStackTrace(new PrintWriter(sw));
            String[] lines = sw.toString().split("\\r?\\n");
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < Math.min(lines.length, 5); i++) sb.append(lines[i]).append("\n");
            debugSnippet = sb.toString();
            parsedResume = new ResumeParserService.ParsedResume();
        }

        response.put("atsScore", atsScore);
        response.put("suggestions", atsSuggestions);
        response.put("data", parsedResume);
        response.put("rawText", extractedText.length() > 5000 ? extractedText.substring(0, 5000) : extractedText);
        if (!debugSnippet.isEmpty()) response.put("debug", debugSnippet);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<ResumeDTO.ResumeResponse>> updateResumeById(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ResumeDTO.UpdateResumeRequest request) {
        try {
            String email = authentication.getName();
            ResumeDTO.ResumeResponse response = resumeService.updateResume(id, request, email);
            return ResponseEntity.ok(ApiResponse.success("Resume updated successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/finalize/{id}")
    public ResponseEntity<ApiResponse<ResumeDTO.ResumeResponse>> finalizeResume(
            Authentication authentication,
            @PathVariable Long id) {
        try {
            String email = authentication.getName();
            ResumeDTO.ResumeResponse response = resumeService.finalizeResume(id, email);
            return ResponseEntity.ok(ApiResponse.success("Resume finalized successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
