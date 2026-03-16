package com.resumebuilder.dto;

import java.time.LocalDateTime;

public class UserDTO {

    // User Response
    public static class UserResponse {
        private Long id;
        private String fullName;
        private String email;
        private String profilePicture;
        private String role;
        private int totalResumes;
        private int averageAtsScore;
        private LocalDateTime createdAt;
        
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private UserResponse response = new UserResponse();
            
            public Builder id(Long id) { response.id = id; return this; }
            public Builder fullName(String fullName) { response.fullName = fullName; return this; }
            public Builder email(String email) { response.email = email; return this; }
            public Builder profilePicture(String profilePicture) { response.profilePicture = profilePicture; return this; }
            public Builder role(String role) { response.role = role; return this; }
            public Builder totalResumes(int totalResumes) { response.totalResumes = totalResumes; return this; }
            public Builder averageAtsScore(int averageAtsScore) { response.averageAtsScore = averageAtsScore; return this; }
            public Builder createdAt(LocalDateTime createdAt) { response.createdAt = createdAt; return this; }
            
            public UserResponse build() { return response; }
        }
        
        // Getters
        public Long getId() { return id; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getProfilePicture() { return profilePicture; }
        public String getRole() { return role; }
        public int getTotalResumes() { return totalResumes; }
        public int getAverageAtsScore() { return averageAtsScore; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }

    // Update Profile Request
    public static class UpdateProfileRequest {
        private String fullName;
        private String profilePicture;
        
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        
        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    }

    // Update User Request (alias for UpdateProfileRequest)
    public static class UpdateUserRequest {
        private String fullName;
        private String profilePicture;
        
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        
        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    }
}
