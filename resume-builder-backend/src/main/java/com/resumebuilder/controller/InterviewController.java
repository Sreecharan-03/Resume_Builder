package com.resumebuilder.controller;

import com.resumebuilder.dto.InterviewDTO;
import com.resumebuilder.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<?> getInterviewPrep(@PathVariable Long resumeId,
                                               Authentication authentication) {
        try {
            String email = authentication.getName();
            InterviewDTO.InterviewPrepResponse response = interviewService.getInterviewPrep(resumeId, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
