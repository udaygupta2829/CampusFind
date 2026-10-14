package com.campusfind.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ItemReportResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String userCollegeId;
    private String type;
    private String itemName;
    private String category;
    private String colour;
    private String description;
    private String uniqueMarks;
    private String location;
    private LocalDate eventDate;
    private String contactPreference;
    private String itemHeldAt;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ItemImageResponse> images;
    private int claimCount;
    private int matchSuggestionCount;
    private boolean isOwner;

    public ItemReportResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long userId;
        private String userFullName;
        private String userEmail;
        private String userCollegeId;
        private String type;
        private String itemName;
        private String category;
        private String colour;
        private String description;
        private String uniqueMarks;
        private String location;
        private LocalDate eventDate;
        private String contactPreference;
        private String itemHeldAt;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<ItemImageResponse> images;
        private int claimCount;
        private int matchSuggestionCount;
        private boolean isOwner;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder userFullName(String userFullName) { this.userFullName = userFullName; return this; }
        public Builder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public Builder userCollegeId(String userCollegeId) { this.userCollegeId = userCollegeId; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder itemName(String itemName) { this.itemName = itemName; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder colour(String colour) { this.colour = colour; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder uniqueMarks(String uniqueMarks) { this.uniqueMarks = uniqueMarks; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder eventDate(LocalDate eventDate) { this.eventDate = eventDate; return this; }
        public Builder contactPreference(String contactPreference) { this.contactPreference = contactPreference; return this; }
        public Builder itemHeldAt(String itemHeldAt) { this.itemHeldAt = itemHeldAt; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder images(List<ItemImageResponse> images) { this.images = images; return this; }
        public Builder claimCount(int claimCount) { this.claimCount = claimCount; return this; }
        public Builder matchSuggestionCount(int matchSuggestionCount) { this.matchSuggestionCount = matchSuggestionCount; return this; }
        public Builder isOwner(boolean isOwner) { this.isOwner = isOwner; return this; }

        public ItemReportResponse build() {
            ItemReportResponse r = new ItemReportResponse();
            r.setId(this.id);
            r.setUserId(this.userId);
            r.setUserFullName(this.userFullName);
            r.setUserEmail(this.userEmail);
            r.setUserCollegeId(this.userCollegeId);
            r.setType(this.type);
            r.setItemName(this.itemName);
            r.setCategory(this.category);
            r.setColour(this.colour);
            r.setDescription(this.description);
            r.setUniqueMarks(this.uniqueMarks);
            r.setLocation(this.location);
            r.setEventDate(this.eventDate);
            r.setContactPreference(this.contactPreference);
            r.setItemHeldAt(this.itemHeldAt);
            r.setStatus(this.status);
            r.setCreatedAt(this.createdAt);
            r.setUpdatedAt(this.updatedAt);
            r.setImages(this.images);
            r.setClaimCount(this.claimCount);
            r.setMatchSuggestionCount(this.matchSuggestionCount);
            r.setOwner(this.isOwner);
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserCollegeId() { return userCollegeId; }
    public void setUserCollegeId(String userCollegeId) { this.userCollegeId = userCollegeId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColour() { return colour; }
    public void setColour(String colour) { this.colour = colour; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUniqueMarks() { return uniqueMarks; }
    public void setUniqueMarks(String uniqueMarks) { this.uniqueMarks = uniqueMarks; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getContactPreference() { return contactPreference; }
    public void setContactPreference(String contactPreference) { this.contactPreference = contactPreference; }

    public String getItemHeldAt() { return itemHeldAt; }
    public void setItemHeldAt(String itemHeldAt) { this.itemHeldAt = itemHeldAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ItemImageResponse> getImages() { return images; }
    public void setImages(List<ItemImageResponse> images) { this.images = images; }

    public int getClaimCount() { return claimCount; }
    public void setClaimCount(int claimCount) { this.claimCount = claimCount; }

    public int getMatchSuggestionCount() { return matchSuggestionCount; }
    public void setMatchSuggestionCount(int matchSuggestionCount) { this.matchSuggestionCount = matchSuggestionCount; }

    public boolean isOwner() { return isOwner; }
    public void setOwner(boolean owner) { isOwner = owner; }
}
