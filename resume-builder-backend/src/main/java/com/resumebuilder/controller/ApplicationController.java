package com.resumebuilder.controller;

import com.resumebuilder.dto.ApiResponse;
import com.resumebuilder.dto.ApplicationDTO;
import com.resumebuilder.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<ApplicationDTO.ApplicationHistoryResponse>> save(
            Authentication authentication,
            @RequestBody ApplicationDTO.SaveApplicationRequest request) {
        try {
            String email = resolveEmail(authentication);
            ApplicationDTO.ApplicationHistoryResponse response = applicationService.saveApplication(request, email);
            return ResponseEntity.ok(ApiResponse.success("Application saved", response));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ApplicationDTO.ApplicationHistoryResponse>>> history(
            Authentication authentication) {
        try {
            String email = resolveEmail(authentication);
            List<ApplicationDTO.ApplicationHistoryResponse> response = applicationService.getHistory(email);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    private String resolveEmail(Authentication authentication) {
        return authentication != null && authentication.getName() != null
                ? authentication.getName()
                : "tester@example.com";
    }
}
