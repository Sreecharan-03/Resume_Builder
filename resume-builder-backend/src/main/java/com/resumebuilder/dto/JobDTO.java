package com.resumebuilder.dto;

import java.util.ArrayList;
import java.util.List;

public class JobDTO {

    public static class JobSearchResponse {
        private String role;
        private List<JobCard> results = new ArrayList<>();
        private List<JobCard> bestMatches = new ArrayList<>();
        private int total;

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public List<JobCard> getResults() {
            return results;
        }

        public void setResults(List<JobCard> results) {
            this.results = results;
        }

        public List<JobCard> getBestMatches() {
            return bestMatches;
        }

        public void setBestMatches(List<JobCard> bestMatches) {
            this.bestMatches = bestMatches;
        }

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }
    }

    public static class JobCard {
        private String id;
        private String title;
        private String company;
        private String location;
        private String description;
        private String redirectUrl;
        private String postedAt;
        private List<String> jobSkills = new ArrayList<>();
        private int matchScore;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
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

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getRedirectUrl() {
            return redirectUrl;
        }

        public void setRedirectUrl(String redirectUrl) {
            this.redirectUrl = redirectUrl;
        }

        public String getPostedAt() {
            return postedAt;
        }

        public void setPostedAt(String postedAt) {
            this.postedAt = postedAt;
        }

        public List<String> getJobSkills() {
            return jobSkills;
        }

        public void setJobSkills(List<String> jobSkills) {
            this.jobSkills = jobSkills;
        }

        public int getMatchScore() {
            return matchScore;
        }

        public void setMatchScore(int matchScore) {
            this.matchScore = matchScore;
        }
    }

    public static class GenerateContentRequest {
        private Long resumeId;
        private String resumeText;
        private String jobTitle;
        private String company;
        private String jobDescription;

        public Long getResumeId() {
            return resumeId;
        }

        public void setResumeId(Long resumeId) {
            this.resumeId = resumeId;
        }

        public String getResumeText() {
            return resumeText;
        }

        public void setResumeText(String resumeText) {
            this.resumeText = resumeText;
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

        public String getJobDescription() {
            return jobDescription;
        }

        public void setJobDescription(String jobDescription) {
            this.jobDescription = jobDescription;
        }
    }

    public static class GeneratedContentResponse {
        private String coverLetter;
        private String whyFit;
        private String skillsSummary;

        public String getCoverLetter() {
            return coverLetter;
        }

        public void setCoverLetter(String coverLetter) {
            this.coverLetter = coverLetter;
        }

        public String getWhyFit() {
            return whyFit;
        }

        public void setWhyFit(String whyFit) {
            this.whyFit = whyFit;
        }

        public String getSkillsSummary() {
            return skillsSummary;
        }

        public void setSkillsSummary(String skillsSummary) {
            this.skillsSummary = skillsSummary;
        }
    }
}
