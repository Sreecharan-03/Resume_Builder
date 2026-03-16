package com.resumebuilder.dto;

import java.util.List;

public class InterviewDTO {

    // Interview Prep Response
    public static class InterviewPrepResponse {
        private Long resumeId;
        private String targetRole;
        private String company;
        private List<InterviewQuestion> technicalQuestions;
        private List<InterviewQuestion> behavioralQuestions;
        private List<InterviewQuestion> projectBasedQuestions;
        private List<String> preparationTips;
        private List<TopicToReview> topicsToReview;
        
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private InterviewPrepResponse response = new InterviewPrepResponse();
            
            public Builder resumeId(Long resumeId) { response.resumeId = resumeId; return this; }
            public Builder targetRole(String targetRole) { response.targetRole = targetRole; return this; }
            public Builder company(String company) { response.company = company; return this; }
            public Builder technicalQuestions(List<InterviewQuestion> q) { response.technicalQuestions = q; return this; }
            public Builder behavioralQuestions(List<InterviewQuestion> q) { response.behavioralQuestions = q; return this; }
            public Builder projectBasedQuestions(List<InterviewQuestion> q) { response.projectBasedQuestions = q; return this; }
            public Builder preparationTips(List<String> tips) { response.preparationTips = tips; return this; }
            public Builder topicsToReview(List<TopicToReview> topics) { response.topicsToReview = topics; return this; }
            
            public InterviewPrepResponse build() { return response; }
        }
        
        // Getters
        public Long getResumeId() { return resumeId; }
        public String getTargetRole() { return targetRole; }
        public String getCompany() { return company; }
        public List<InterviewQuestion> getTechnicalQuestions() { return technicalQuestions; }
        public List<InterviewQuestion> getBehavioralQuestions() { return behavioralQuestions; }
        public List<InterviewQuestion> getProjectBasedQuestions() { return projectBasedQuestions; }
        public List<String> getPreparationTips() { return preparationTips; }
        public List<TopicToReview> getTopicsToReview() { return topicsToReview; }
    }

    // Interview Question
    public static class InterviewQuestion {
        private String question;
        private String difficulty;
        private String category;
        private String sampleAnswer;
        private List<String> keyPoints;
        
        public InterviewQuestion() {}
        
        public InterviewQuestion(String question, String difficulty, String category, String sampleAnswer, List<String> keyPoints) {
            this.question = question;
            this.difficulty = difficulty;
            this.category = category;
            this.sampleAnswer = sampleAnswer;
            this.keyPoints = keyPoints;
        }
        
        public String getQuestion() { return question; }
        public String getDifficulty() { return difficulty; }
        public String getCategory() { return category; }
        public String getSampleAnswer() { return sampleAnswer; }
        public List<String> getKeyPoints() { return keyPoints; }
    }

    // Topic to Review
    public static class TopicToReview {
        private String topic;
        private String importance;
        private List<String> subtopics;
        private String resource;
        
        public TopicToReview() {}
        
        public TopicToReview(String topic, String importance, List<String> subtopics, String resource) {
            this.topic = topic;
            this.importance = importance;
            this.subtopics = subtopics;
            this.resource = resource;
        }
        
        public String getTopic() { return topic; }
        public String getImportance() { return importance; }
        public List<String> getSubtopics() { return subtopics; }
        public String getResource() { return resource; }
    }
}
