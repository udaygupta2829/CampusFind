package com.campusfind.dto.response;

import java.time.LocalDateTime;

public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String collegeId;
    private String role;
    private LocalDateTime createdAt;
    private long totalLostReports;
    private long totalFoundReports;
    private long totalClaims;

    public UserProfileResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String collegeId;
        private String role;
        private LocalDateTime createdAt;
        private long totalLostReports;
        private long totalFoundReports;
        private long totalClaims;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder collegeId(String collegeId) { this.collegeId = collegeId; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder totalLostReports(long totalLostReports) { this.totalLostReports = totalLostReports; return this; }
        public Builder totalFoundReports(long totalFoundReports) { this.totalFoundReports = totalFoundReports; return this; }
        public Builder totalClaims(long totalClaims) { this.totalClaims = totalClaims; return this; }

        public UserProfileResponse build() {
            UserProfileResponse p = new UserProfileResponse();
            p.setId(this.id);
            p.setFullName(this.fullName);
            p.setEmail(this.email);
            p.setPhoneNumber(this.phoneNumber);
            p.setCollegeId(this.collegeId);
            p.setRole(this.role);
            p.setCreatedAt(this.createdAt);
            p.setTotalLostReports(this.totalLostReports);
            p.setTotalFoundReports(this.totalFoundReports);
            p.setTotalClaims(this.totalClaims);
            return p;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCollegeId() { return collegeId; }
    public void setCollegeId(String collegeId) { this.collegeId = collegeId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public long getTotalLostReports() { return totalLostReports; }
    public void setTotalLostReports(long totalLostReports) { this.totalLostReports = totalLostReports; }

    public long getTotalFoundReports() { return totalFoundReports; }
    public void setTotalFoundReports(long totalFoundReports) { this.totalFoundReports = totalFoundReports; }

    public long getTotalClaims() { return totalClaims; }
    public void setTotalClaims(long totalClaims) { this.totalClaims = totalClaims; }
}
