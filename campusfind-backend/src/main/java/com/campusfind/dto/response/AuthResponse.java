package com.campusfind.dto.response;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String collegeId;
    private String phoneNumber;

    public AuthResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String tokenType = "Bearer";
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private String collegeId;
        private String phoneNumber;

        public Builder token(String token) { this.token = token; return this; }
        public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public Builder id(Long id) { this.id = id; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder collegeId(String collegeId) { this.collegeId = collegeId; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }

        public AuthResponse build() {
            AuthResponse r = new AuthResponse();
            r.setToken(this.token);
            r.setTokenType(this.tokenType != null ? this.tokenType : "Bearer");
            r.setId(this.id);
            r.setFullName(this.fullName);
            r.setEmail(this.email);
            r.setRole(this.role);
            r.setCollegeId(this.collegeId);
            r.setPhoneNumber(this.phoneNumber);
            return r;
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCollegeId() { return collegeId; }
    public void setCollegeId(String collegeId) { this.collegeId = collegeId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
