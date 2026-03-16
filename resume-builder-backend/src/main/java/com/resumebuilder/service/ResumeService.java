package com.resumebuilder.service;

import com.resumebuilder.dto.ResumeDTO;
import com.resumebuilder.model.Resume;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AuthService authService;

    public ResumeService(ResumeRepository resumeRepository, AuthService authService) {
        this.resumeRepository = resumeRepository;
        this.authService = authService;
    }

    @Transactional
    public ResumeDTO.ResumeResponse createResume(ResumeDTO.CreateResumeRequest request, String userEmail) {
        User user = authService.getUserByEmail(userEmail);

        Resume resume = Resume.builder()
                .title(request.getTitle())
                .targetRole(request.getTargetRole())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .location(request.getLocation())
                .summary(request.getSummary())
                .skills(request.getSkills())
                .experience(request.getExperience())
                .education(request.getEducation())
                .certifications(request.getCertifications())
                .projects(request.getProjects())
                .codingProfiles(request.getCodingProfiles())
                .languages(request.getLanguages())
                .activities(request.getActivities())
                .hobbies(request.getHobbies())
                .templateId(request.getTemplateId())
                .status(Resume.ResumeStatus.DRAFT)
                .user(user)
                .build();

        Resume savedResume = resumeRepository.save(resume);
        return mapToResponse(savedResume);
    }

    public ResumeDTO.ResumeResponse getResumeById(Long id, String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));
        return mapToResponse(resume);
    }

    public ResumeDTO.ResumeListResponse getAllResumes(String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        List<Resume> resumes = resumeRepository.findByUserOrderByUpdatedAtDesc(user);
        List<ResumeDTO.ResumeResponse> resumeResponses = resumes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new ResumeDTO.ResumeListResponse(resumeResponses, resumeResponses.size());
    }

    @Transactional
    public ResumeDTO.ResumeResponse updateResume(Long id, ResumeDTO.UpdateResumeRequest request, String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        // Update fields
        if (request.getTitle() != null) resume.setTitle(request.getTitle());
        if (request.getTargetRole() != null) resume.setTargetRole(request.getTargetRole());
        if (request.getFullName() != null) resume.setFullName(request.getFullName());
        if (request.getEmail() != null) resume.setEmail(request.getEmail());
        if (request.getPhone() != null) resume.setPhone(request.getPhone());
        if (request.getLocation() != null) resume.setLocation(request.getLocation());
        if (request.getSummary() != null) resume.setSummary(request.getSummary());
        if (request.getSkills() != null) resume.setSkills(request.getSkills());
        if (request.getExperience() != null) resume.setExperience(request.getExperience());
        if (request.getEducation() != null) resume.setEducation(request.getEducation());
        if (request.getCertifications() != null) resume.setCertifications(request.getCertifications());
        if (request.getProjects() != null) resume.setProjects(request.getProjects());
        if (request.getCodingProfiles() != null) resume.setCodingProfiles(request.getCodingProfiles());
        if (request.getLanguages() != null) resume.setLanguages(request.getLanguages());
        if (request.getActivities() != null) resume.setActivities(request.getActivities());
        if (request.getHobbies() != null) resume.setHobbies(request.getHobbies());
        if (request.getTemplateId() != null) resume.setTemplateId(request.getTemplateId());

        Resume savedResume = resumeRepository.save(resume);
        return mapToResponse(savedResume);
    }

    @Transactional
    public void deleteResume(Long id, String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));
        resumeRepository.delete(resume);
    }

    public Resume getResumeEntityById(Long id, String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        return resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));
    }

    @Transactional
    public void updateAtsScore(Long resumeId, int score) {
        resumeRepository.findById(resumeId).ifPresent(resume -> {
            resume.setAtsScore(score);
            resumeRepository.save(resume);
        });
    }

    private ResumeDTO.ResumeResponse mapToResponse(Resume resume) {
        return ResumeDTO.ResumeResponse.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .targetRole(resume.getTargetRole())
                .fullName(resume.getFullName())
                .email(resume.getEmail())
                .phone(resume.getPhone())
                .location(resume.getLocation())
                .summary(resume.getSummary())
                .skills(resume.getSkills())
                .experience(resume.getExperience())
                .education(resume.getEducation())
                .certifications(resume.getCertifications())
                .projects(resume.getProjects())
                .codingProfiles(resume.getCodingProfiles())
                .languages(resume.getLanguages())
                .activities(resume.getActivities())
                .hobbies(resume.getHobbies())
                .templateId(resume.getTemplateId())
                .status(resume.getStatus().name())
                .atsScore(resume.getAtsScore())
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }

    public ResumeDTO.ResumeListResponse getResumesByUserId(Long userId, String userEmail) {
        User currentUser = authService.getUserByEmail(userEmail);
        
        // Users can only access their own resumes
        if (!currentUser.getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access");
        }
        
        List<Resume> resumes = resumeRepository.findByUserOrderByUpdatedAtDesc(currentUser);
        List<ResumeDTO.ResumeResponse> resumeResponses = resumes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new ResumeDTO.ResumeListResponse(resumeResponses, resumeResponses.size());
    }

    @Transactional
    public ResumeDTO.ResumeResponse createDraft(ResumeDTO.CreateResumeRequest request, String userEmail) {
        User user = authService.getUserByEmail(userEmail);

        Resume resume = Resume.builder()
                .title(request.getTitle() != null ? request.getTitle() : "Untitled Resume")
                .targetRole(request.getTargetRole())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .location(request.getLocation())
                .summary(request.getSummary())
                .skills(request.getSkills())
                .experience(request.getExperience())
                .education(request.getEducation())
                .certifications(request.getCertifications())
                .projects(request.getProjects())
                .codingProfiles(request.getCodingProfiles())
                .languages(request.getLanguages())
                .activities(request.getActivities())
                .hobbies(request.getHobbies())
                .templateId(request.getTemplateId())
                .status(Resume.ResumeStatus.DRAFT)
                .user(user)
                .build();

        Resume savedResume = resumeRepository.save(resume);
        return mapToResponse(savedResume);
    }

    @Transactional
    public ResumeDTO.ResumeResponse uploadResume(ResumeDTO.UploadResumeRequest request, String userEmail) {
        User user = authService.getUserByEmail(userEmail);

        Resume resume = Resume.builder()
                .title(request.getTitle() != null ? request.getTitle() : "Uploaded Resume")
                .targetRole(request.getTargetRole())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .location(request.getLocation())
                .summary(request.getSummary())
                .skills(request.getSkills())
                .experience(request.getExperience())
                .education(request.getEducation())
                .certifications(request.getCertifications())
                .projects(request.getProjects())
                .codingProfiles(request.getCodingProfiles())
                .languages(request.getLanguages())
                .activities(request.getActivities())
                .hobbies(request.getHobbies())
                .templateId(request.getTemplateId() != null ? request.getTemplateId() : "modern")
                .status(Resume.ResumeStatus.DRAFT)
                .user(user)
                .build();

        Resume savedResume = resumeRepository.save(resume);
        return mapToResponse(savedResume);
    }

    @Transactional
    public ResumeDTO.ResumeResponse finalizeResume(Long id, String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        // Change status from DRAFT to COMPLETED
        resume.setStatus(Resume.ResumeStatus.COMPLETED);
        
        Resume savedResume = resumeRepository.save(resume);
        return mapToResponse(savedResume);
    }
}
