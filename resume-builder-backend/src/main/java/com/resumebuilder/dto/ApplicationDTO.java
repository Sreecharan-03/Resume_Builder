package com.resumebuilder.dto;

import java.time.LocalDateTime;

public class ApplicationDTO {

    public static class SaveApplicationRequest {
        private String jobId;
        private Long resumeId;
        private String jobTitle;
        private String company;
        private String location;
        private Integer matchScore;
        private String status;
        private String redirectUrl;
        private String coverLetter;

        public String getJobId() {
            return jobId;
        }

        public void setJobId(String jobId) {
            this.jobId = jobId;
        }

        public Long getResumeId() {
            return resumeId;
        }

        public void setResumeId(Long resumeId) {
            this.resumeId = resumeId;
        }

        public String getJobTitle() {
            return jobTitle;
        }

        public void setJobTitle(String jobTitle) {
            this.jobTitle = jobTitle;
        }

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public Integer getMatchScore() {
            return matchScore;
        }

        public void setMatchScore(Integer matchScore) {
            this.matchScore = matchScore;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getRedirectUrl() {
            return redirectUrl;
        }

        public void setRedirectUrl(String redirectUrl) {
            this.redirectUrl = redirectUrl;
        }

        public String getCoverLetter() {
            return coverLetter;
        }

        public void setCoverLetter(String coverLetter) {
            this.coverLetter = coverLetter;
        }
    }

    public static class ApplicationHistoryResponse {
        private Long id;
        private String jobId;
        private Long resumeId;
        private String jobTitle;
        private String company;
        private String location;
        private Integer matchScore;
        private String status;
        private String redirectUrl;
        private String coverLetter;
        private LocalDateTime appliedAt;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getJobId() {
            return jobId;
        }

        public void setJobId(String jobId) {
            this.jobId = jobId;
        }

        public Long getResumeId() {
            return resumeId;
        }

        public void setResumeId(Long resumeId) {
            this.resumeId = resumeId;
        }

        public String getJobTitle() {
            return jobTitle;
        }

        public void setJobTitle(String jobTitle) {
            this.jobTitle = jobTitle;
        }

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public Integer getMatchScore() {
            return matchScore;
        }

        public void setMatchScore(Integer matchScore) {
            this.matchScore = matchScore;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getRedirectUrl() {
            return redirectUrl;
        }

        public void setRedirectUrl(String redirectUrl) {
            this.redirectUrl = redirectUrl;
        }

        public String getCoverLetter() {
            return coverLetter;
        }

        public void setCoverLetter(String coverLetter) {
            this.coverLetter = coverLetter;
        }

        public LocalDateTime getAppliedAt() {
            return appliedAt;
        }

        public void setAppliedAt(LocalDateTime appliedAt) {
            this.appliedAt = appliedAt;
        }
    }
}
