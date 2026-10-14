package com.campusfind.dto.response;

import java.time.LocalDateTime;

public class MatchSuggestionResponse {
    private Long id;
    private Long lostItemId;
    private String lostItemName;
    private String lostItemCategory;
    private String lostItemLocation;
    private String lostItemImageUrl;
    private String lostItemOwnerName;
    private Long foundItemId;
    private String foundItemName;
    private String foundItemCategory;
    private String foundItemLocation;
    private String foundItemImageUrl;
    private String foundItemHeldAt;
    private Double matchScore;
    private String matchReason;
    private String status;
    private LocalDateTime createdAt;

    public MatchSuggestionResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long lostItemId;
        private String lostItemName;
        private String lostItemCategory;
        private String lostItemLocation;
        private String lostItemImageUrl;
        private String lostItemOwnerName;
        private Long foundItemId;
        private String foundItemName;
        private String foundItemCategory;
        private String foundItemLocation;
        private String foundItemImageUrl;
        private String foundItemHeldAt;
        private Double matchScore;
        private String matchReason;
        private String status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder lostItemId(Long lostItemId) { this.lostItemId = lostItemId; return this; }
        public Builder lostItemName(String lostItemName) { this.lostItemName = lostItemName; return this; }
        public Builder lostItemCategory(String lostItemCategory) { this.lostItemCategory = lostItemCategory; return this; }
        public Builder lostItemLocation(String lostItemLocation) { this.lostItemLocation = lostItemLocation; return this; }
        public Builder lostItemImageUrl(String lostItemImageUrl) { this.lostItemImageUrl = lostItemImageUrl; return this; }
        public Builder lostItemOwnerName(String lostItemOwnerName) { this.lostItemOwnerName = lostItemOwnerName; return this; }
        public Builder foundItemId(Long foundItemId) { this.foundItemId = foundItemId; return this; }
        public Builder foundItemName(String foundItemName) { this.foundItemName = foundItemName; return this; }
        public Builder foundItemCategory(String foundItemCategory) { this.foundItemCategory = foundItemCategory; return this; }
        public Builder foundItemLocation(String foundItemLocation) { this.foundItemLocation = foundItemLocation; return this; }
        public Builder foundItemImageUrl(String foundItemImageUrl) { this.foundItemImageUrl = foundItemImageUrl; return this; }
        public Builder foundItemHeldAt(String foundItemHeldAt) { this.foundItemHeldAt = foundItemHeldAt; return this; }
        public Builder matchScore(Double matchScore) { this.matchScore = matchScore; return this; }
        public Builder matchReason(String matchReason) { this.matchReason = matchReason; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public MatchSuggestionResponse build() {
            MatchSuggestionResponse m = new MatchSuggestionResponse();
            m.setId(this.id);
            m.setLostItemId(this.lostItemId);
            m.setLostItemName(this.lostItemName);
            m.setLostItemCategory(this.lostItemCategory);
            m.setLostItemLocation(this.lostItemLocation);
            m.setLostItemImageUrl(this.lostItemImageUrl);
            m.setLostItemOwnerName(this.lostItemOwnerName);
            m.setFoundItemId(this.foundItemId);
            m.setFoundItemName(this.foundItemName);
            m.setFoundItemCategory(this.foundItemCategory);
            m.setFoundItemLocation(this.foundItemLocation);
            m.setFoundItemImageUrl(this.foundItemImageUrl);
            m.setFoundItemHeldAt(this.foundItemHeldAt);
            m.setMatchScore(this.matchScore);
            m.setMatchReason(this.matchReason);
            m.setStatus(this.status);
            m.setCreatedAt(this.createdAt);
            return m;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLostItemId() { return lostItemId; }
    public void setLostItemId(Long lostItemId) { this.lostItemId = lostItemId; }

    public String getLostItemName() { return lostItemName; }
    public void setLostItemName(String lostItemName) { this.lostItemName = lostItemName; }

    public String getLostItemCategory() { return lostItemCategory; }
    public void setLostItemCategory(String lostItemCategory) { this.lostItemCategory = lostItemCategory; }

    public String getLostItemLocation() { return lostItemLocation; }
    public void setLostItemLocation(String lostItemLocation) { this.lostItemLocation = lostItemLocation; }

    public String getLostItemImageUrl() { return lostItemImageUrl; }
    public void setLostItemImageUrl(String lostItemImageUrl) { this.lostItemImageUrl = lostItemImageUrl; }

    public String getLostItemOwnerName() { return lostItemOwnerName; }
    public void setLostItemOwnerName(String lostItemOwnerName) { this.lostItemOwnerName = lostItemOwnerName; }

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public String getFoundItemName() { return foundItemName; }
    public void setFoundItemName(String foundItemName) { this.foundItemName = foundItemName; }

    public String getFoundItemCategory() { return foundItemCategory; }
    public void setFoundItemCategory(String foundItemCategory) { this.foundItemCategory = foundItemCategory; }

    public String getFoundItemLocation() { return foundItemLocation; }
    public void setFoundItemLocation(String foundItemLocation) { this.foundItemLocation = foundItemLocation; }

    public String getFoundItemImageUrl() { return foundItemImageUrl; }
    public void setFoundItemImageUrl(String foundItemImageUrl) { this.foundItemImageUrl = foundItemImageUrl; }

    public String getFoundItemHeldAt() { return foundItemHeldAt; }
    public void setFoundItemHeldAt(String foundItemHeldAt) { this.foundItemHeldAt = foundItemHeldAt; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
