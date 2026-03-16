package com.resumebuilder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    // Register Request DTO
    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        public RegisterRequest() {
        }

        public RegisterRequest(String fullName, String email, String password) {
            this.fullName = fullName;
            this.email = email;
            this.password = password;
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

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // Login Request DTO
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {
        }

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // Auth Response DTO
    public static class AuthResponse {
        private String token;
        private String tokenType = "Bearer";
        private UserInfo user;

        public AuthResponse() {
        }

        public AuthResponse(String token, UserInfo user) {
            this.token = token;
            this.user = user;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getTokenType() {
            return tokenType;
        }

        public void setTokenType(String tokenType) {
            this.tokenType = tokenType;
        }

        public UserInfo getUser() {
            return user;
        }

        public void setUser(UserInfo user) {
            this.user = user;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private String token;
            private UserInfo user;

            public Builder token(String token) {
                this.token = token;
                return this;
            }

            public Builder user(UserInfo user) {
                this.user = user;
                return this;
            }

            public AuthResponse build() {
                return new AuthResponse(token, user);
            }
        }
    }

    // User Info DTO
    public static class UserInfo {
        private Long id;
        private String fullName;
        private String email;
        private String role;

        public UserInfo() {
        }

        public UserInfo(Long id, String fullName, String email, String role) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private Long id;
            private String fullName;
            private String email;
            private String role;

            public Builder id(Long id) {
                this.id = id;
                return this;
            }

            public Builder fullName(String fullName) {
                this.fullName = fullName;
                return this;
            }

            public Builder email(String email) {
                this.email = email;
                return this;
            }

            public Builder role(String role) {
                this.role = role;
                return this;
            }

            public UserInfo build() {
                return new UserInfo(id, fullName, email, role);
            }
        }
    }
}
