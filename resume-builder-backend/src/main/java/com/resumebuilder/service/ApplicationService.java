package com.resumebuilder.service;

import com.resumebuilder.dto.ApplicationDTO;
import com.resumebuilder.model.ApplicationHistory;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.ApplicationHistoryRepository;
import com.resumebuilder.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationHistoryRepository applicationHistoryRepository;
    private final AuthService authService;
    private final ResumeRepository resumeRepository;

    public ApplicationService(ApplicationHistoryRepository applicationHistoryRepository,
                              AuthService authService,
                              ResumeRepository resumeRepository) {
        this.applicationHistoryRepository = applicationHistoryRepository;
        this.authService = authService;
        this.resumeRepository = resumeRepository;
    }

    @Transactional
    public ApplicationDTO.ApplicationHistoryResponse saveApplication(ApplicationDTO.SaveApplicationRequest request, String userEmail) {
        if (request.getJobId() == null || request.getJobId().isBlank()) {
            throw new IllegalArgumentException("jobId is required");
        }
        if (request.getJobTitle() == null || request.getJobTitle().isBlank()) {
            throw new IllegalArgumentException("jobTitle is required");
        }
        if (request.getCompany() == null || request.getCompany().isBlank()) {
            throw new IllegalArgumentException("company is required");
        }

        User user = authService.getUserByEmail(userEmail);

        if (request.getResumeId() != null) {
            resumeRepository.findByIdAndUser(request.getResumeId(), user)
                    .orElseThrow(() -> new IllegalArgumentException("Resume not found"));
        }

        ApplicationHistory application = new ApplicationHistory();
        application.setJobId(request.getJobId());
        application.setResumeId(request.getResumeId());
        application.setJobTitle(request.getJobTitle());
        application.setCompany(request.getCompany());
        application.setLocation(request.getLocation());
        application.setMatchScore(request.getMatchScore());
        application.setRedirectUrl(request.getRedirectUrl());
        application.setCoverLetter(request.getCoverLetter());
        application.setStatus(parseStatus(request.getStatus()));
        application.setUser(user);

        ApplicationHistory saved = applicationHistoryRepository.save(application);
        return mapToResponse(saved);
    }

    public List<ApplicationDTO.ApplicationHistoryResponse> getHistory(String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        return applicationHistoryRepository.findByUserOrderByAppliedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ApplicationDTO.ApplicationHistoryResponse mapToResponse(ApplicationHistory application) {
        ApplicationDTO.ApplicationHistoryResponse response = new ApplicationDTO.ApplicationHistoryResponse();
        response.setId(application.getId());
        response.setJobId(application.getJobId());
        response.setResumeId(application.getResumeId());
        response.setJobTitle(application.getJobTitle());
        response.setCompany(application.getCompany());
        response.setLocation(application.getLocation());
        response.setMatchScore(application.getMatchScore());
        response.setStatus(application.getStatus().name());
        response.setRedirectUrl(application.getRedirectUrl());
        response.setCoverLetter(application.getCoverLetter());
        response.setAppliedAt(application.getAppliedAt());
        return response;
    }

    private ApplicationHistory.ApplicationStatus parseStatus(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            return ApplicationHistory.ApplicationStatus.SAVED;
        }

        try {
            return ApplicationHistory.ApplicationStatus.valueOf(rawStatus.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return ApplicationHistory.ApplicationStatus.SAVED;
        }
    }
}
