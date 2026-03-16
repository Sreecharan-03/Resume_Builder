package com.resumebuilder.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

public class ResumeDTO {

    // Create Resume Request
    public static class CreateResumeRequest {
        @NotBlank(message = "Title is required")
        private String title;

        private String targetRole;
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String summary;
        private String skills;
        private String experience;
        private String education;
        private String certifications;
        private String projects;
        private String codingProfiles;
        private String languages;
        private String activities;
        private String hobbies;
        private String templateId;

        public CreateResumeRequest() {
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getTargetRole() {
            return targetRole;
        }

        public void setTargetRole(String targetRole) {
            this.targetRole = targetRole;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getSummary() {
            return summary;
        }

        public void setSummary(String summary) {
            this.summary = summary;
        }

        public String getSkills() {
            return skills;
        }

        public void setSkills(String skills) {
            this.skills = skills;
        }

        public String getExperience() {
            return experience;
        }

        public void setExperience(String experience) {
            this.experience = experience;
        }

        public String getEducation() {
            return education;
        }

        public void setEducation(String education) {
            this.education = education;
        }

        public String getCertifications() {
            return certifications;
        }

        public void setCertifications(String certifications) {
            this.certifications = certifications;
        }

        public String getProjects() {
            return projects;
        }

        public void setProjects(String projects) {
            this.projects = projects;
        }

        public String getCodingProfiles() {
            return codingProfiles;
        }

        public void setCodingProfiles(String codingProfiles) {
            this.codingProfiles = codingProfiles;
        }

        public String getLanguages() {
            return languages;
        }

        public void setLanguages(String languages) {
            this.languages = languages;
        }

        public String getActivities() {
            return activities;
        }

        public void setActivities(String activities) {
            this.activities = activities;
        }

        public String getHobbies() {
            return hobbies;
        }

        public void setHobbies(String hobbies) {
            this.hobbies = hobbies;
        }

        public String getTemplateId() {
            return templateId;
        }

        public void setTemplateId(String templateId) {
            this.templateId = templateId;
        }
    }

    // Update Resume Request
    public static class UpdateResumeRequest extends CreateResumeRequest {
        // Inherits all fields from CreateResumeRequest
    }

    // Upload Resume Request (similar to Create but without title validation required)
    public static class UploadResumeRequest {
        private String title;
        private String targetRole;
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String summary;
        private String skills;
        private String experience;
        private String education;
        private String certifications;
        private String projects;
        private String codingProfiles;
        private String languages;
        private String activities;
        private String hobbies;
        private String templateId;

        public UploadResumeRequest() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getTargetRole() { return targetRole; }
        public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }
        public String getSkills() { return skills; }
        public void setSkills(String skills) { this.skills = skills; }
        public String getExperience() { return experience; }
        public void setExperience(String experience) { this.experience = experience; }
        public String getEducation() { return education; }
        public void setEducation(String education) { this.education = education; }
        public String getCertifications() { return certifications; }
        public void setCertifications(String certifications) { this.certifications = certifications; }
        public String getProjects() { return projects; }
        public void setProjects(String projects) { this.projects = projects; }
        public String getCodingProfiles() { return codingProfiles; }
        public void setCodingProfiles(String codingProfiles) { this.codingProfiles = codingProfiles; }
        public String getLanguages() { return languages; }
        public void setLanguages(String languages) { this.languages = languages; }
        public String getActivities() { return activities; }
        public void setActivities(String activities) { this.activities = activities; }
        public String getHobbies() { return hobbies; }
        public void setHobbies(String hobbies) { this.hobbies = hobbies; }
        public String getTemplateId() { return templateId; }
        public void setTemplateId(String templateId) { this.templateId = templateId; }
    }

    // Resume Response
    public static class ResumeResponse {
        private Long id;
        private String title;
        private String targetRole;
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String summary;
        private String skills;
        private String experience;
        private String education;
        private String certifications;
        private String projects;
        private String codingProfiles;
        private String languages;
        private String activities;
        private String hobbies;
        private String templateId;
        private String status;
        private Integer atsScore;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ResumeResponse() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getTargetRole() {
            return targetRole;
        }

        public void setTargetRole(String targetRole) {
            this.targetRole = targetRole;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getSummary() {
            return summary;
        }

        public void setSummary(String summary) {
            this.summary = summary;
        }

        public String getSkills() {
            return skills;
        }

        public void setSkills(String skills) {
            this.skills = skills;
        }

        public String getExperience() {
            return experience;
        }

        public void setExperience(String experience) {
            this.experience = experience;
        }

        public String getEducation() {
            return education;
        }

        public void setEducation(String education) {
            this.education = education;
        }

        public String getCertifications() {
            return certifications;
        }

        public void setCertifications(String certifications) {
            this.certifications = certifications;
        }

        public String getProjects() {
            return projects;
        }

        public void setProjects(String projects) {
            this.projects = projects;
        }

        public String getCodingProfiles() {
            return codingProfiles;
        }

        public void setCodingProfiles(String codingProfiles) {
            this.codingProfiles = codingProfiles;
        }

        public String getLanguages() {
            return languages;
        }

        public void setLanguages(String languages) {
            this.languages = languages;
        }

        public String getActivities() {
            return activities;
        }

        public void setActivities(String activities) {
            this.activities = activities;
        }

        public String getHobbies() {
            return hobbies;
        }

        public void setHobbies(String hobbies) {
            this.hobbies = hobbies;
        }

        public String getTemplateId() {
            return templateId;
        }

        public void setTemplateId(String templateId) {
            this.templateId = templateId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Integer getAtsScore() {
            return atsScore;
        }

        public void setAtsScore(Integer atsScore) {
            this.atsScore = atsScore;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private final ResumeResponse response = new ResumeResponse();

            public Builder id(Long id) {
                response.setId(id);
                return this;
            }

            public Builder title(String title) {
                response.setTitle(title);
                return this;
            }

            public Builder targetRole(String targetRole) {
                response.setTargetRole(targetRole);
                return this;
            }

            public Builder fullName(String fullName) {
                response.setFullName(fullName);
                return this;
            }

            public Builder email(String email) {
                response.setEmail(email);
                return this;
            }

            public Builder phone(String phone) {
                response.setPhone(phone);
                return this;
            }

            public Builder location(String location) {
                response.setLocation(location);
                return this;
            }

            public Builder summary(String summary) {
                response.setSummary(summary);
                return this;
            }

            public Builder skills(String skills) {
                response.setSkills(skills);
                return this;
            }

            public Builder experience(String experience) {
                response.setExperience(experience);
                return this;
            }

            public Builder education(String education) {
                response.setEducation(education);
                return this;
            }

            public Builder certifications(String certifications) {
                response.setCertifications(certifications);
                return this;
            }

            public Builder projects(String projects) {
                response.setProjects(projects);
                return this;
            }

            public Builder codingProfiles(String codingProfiles) {
                response.setCodingProfiles(codingProfiles);
                return this;
            }

            public Builder languages(String languages) {
                response.setLanguages(languages);
                return this;
            }

            public Builder activities(String activities) {
                response.setActivities(activities);
                return this;
            }

            public Builder hobbies(String hobbies) {
                response.setHobbies(hobbies);
                return this;
            }

            public Builder templateId(String templateId) {
                response.setTemplateId(templateId);
                return this;
            }

            public Builder status(String status) {
                response.setStatus(status);
                return this;
            }

            public Builder atsScore(Integer atsScore) {
                response.setAtsScore(atsScore);
                return this;
            }

            public Builder createdAt(LocalDateTime createdAt) {
                response.setCreatedAt(createdAt);
                return this;
            }

            public Builder updatedAt(LocalDateTime updatedAt) {
                response.setUpdatedAt(updatedAt);
                return this;
            }

            public ResumeResponse build() {
                return response;
            }
        }
    }

    // Resume List Response
    public static class ResumeListResponse {
        private List<ResumeResponse> resumes;
        private int total;

        public ResumeListResponse() {
        }

        public ResumeListResponse(List<ResumeResponse> resumes, int total) {
            this.resumes = resumes;
            this.total = total;
        }

        public List<ResumeResponse> getResumes() {
            return resumes;
        }

        public void setResumes(List<ResumeResponse> resumes) {
            this.resumes = resumes;
        }

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }
    }
}
