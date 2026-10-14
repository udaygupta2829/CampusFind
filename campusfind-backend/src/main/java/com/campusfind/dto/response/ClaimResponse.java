package com.campusfind.dto.response;

import java.time.LocalDateTime;

public class ClaimResponse {
    private Long id;
    private Long foundItemId;
    private String foundItemName;
    private String foundItemCategory;
    private String foundItemLocation;
    private String foundItemHeldAt;
    private String foundItemImageUrl;
    private Long claimantId;
    private String claimantFullName;
    private String claimantEmail;
    private String claimantPhone;
    private String claimantCollegeId;
    private String claimDescription;
    private String privateOwnershipProof;
    private String status;
    private String adminNotes;
    private String verifiedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ReturnRecordResponse returnRecord;

    public ClaimResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long foundItemId;
        private String foundItemName;
        private String foundItemCategory;
        private String foundItemLocation;
        private String foundItemHeldAt;
        private String foundItemImageUrl;
        private Long claimantId;
        private String claimantFullName;
        private String claimantEmail;
        private String claimantPhone;
        private String claimantCollegeId;
        private String claimDescription;
        private String privateOwnershipProof;
        private String status;
        private String adminNotes;
        private String verifiedByName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private ReturnRecordResponse returnRecord;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder foundItemId(Long foundItemId) { this.foundItemId = foundItemId; return this; }
        public Builder foundItemName(String foundItemName) { this.foundItemName = foundItemName; return this; }
        public Builder foundItemCategory(String foundItemCategory) { this.foundItemCategory = foundItemCategory; return this; }
        public Builder foundItemLocation(String foundItemLocation) { this.foundItemLocation = foundItemLocation; return this; }
        public Builder foundItemHeldAt(String foundItemHeldAt) { this.foundItemHeldAt = foundItemHeldAt; return this; }
        public Builder foundItemImageUrl(String foundItemImageUrl) { this.foundItemImageUrl = foundItemImageUrl; return this; }
        public Builder claimantId(Long claimantId) { this.claimantId = claimantId; return this; }
        public Builder claimantFullName(String claimantFullName) { this.claimantFullName = claimantFullName; return this; }
        public Builder claimantEmail(String claimantEmail) { this.claimantEmail = claimantEmail; return this; }
        public Builder claimantPhone(String claimantPhone) { this.claimantPhone = claimantPhone; return this; }
        public Builder claimantCollegeId(String claimantCollegeId) { this.claimantCollegeId = claimantCollegeId; return this; }
        public Builder claimDescription(String claimDescription) { this.claimDescription = claimDescription; return this; }
        public Builder privateOwnershipProof(String privateOwnershipProof) { this.privateOwnershipProof = privateOwnershipProof; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder adminNotes(String adminNotes) { this.adminNotes = adminNotes; return this; }
        public Builder verifiedByName(String verifiedByName) { this.verifiedByName = verifiedByName; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder returnRecord(ReturnRecordResponse returnRecord) { this.returnRecord = returnRecord; return this; }

        public ClaimResponse build() {
            ClaimResponse c = new ClaimResponse();
            c.setId(this.id);
            c.setFoundItemId(this.foundItemId);
            c.setFoundItemName(this.foundItemName);
            c.setFoundItemCategory(this.foundItemCategory);
            c.setFoundItemLocation(this.foundItemLocation);
            c.setFoundItemHeldAt(this.foundItemHeldAt);
            c.setFoundItemImageUrl(this.foundItemImageUrl);
            c.setClaimantId(this.claimantId);
            c.setClaimantFullName(this.claimantFullName);
            c.setClaimantEmail(this.claimantEmail);
            c.setClaimantPhone(this.claimantPhone);
            c.setClaimantCollegeId(this.claimantCollegeId);
            c.setClaimDescription(this.claimDescription);
            c.setPrivateOwnershipProof(this.privateOwnershipProof);
            c.setStatus(this.status);
            c.setAdminNotes(this.adminNotes);
            c.setVerifiedByName(this.verifiedByName);
            c.setCreatedAt(this.createdAt);
            c.setUpdatedAt(this.updatedAt);
            c.setReturnRecord(this.returnRecord);
            return c;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public String getFoundItemName() { return foundItemName; }
    public void setFoundItemName(String foundItemName) { this.foundItemName = foundItemName; }

    public String getFoundItemCategory() { return foundItemCategory; }
    public void setFoundItemCategory(String foundItemCategory) { this.foundItemCategory = foundItemCategory; }

    public String getFoundItemLocation() { return foundItemLocation; }
    public void setFoundItemLocation(String foundItemLocation) { this.foundItemLocation = foundItemLocation; }

    public String getFoundItemHeldAt() { return foundItemHeldAt; }
    public void setFoundItemHeldAt(String foundItemHeldAt) { this.foundItemHeldAt = foundItemHeldAt; }

    public String getFoundItemImageUrl() { return foundItemImageUrl; }
    public void setFoundItemImageUrl(String foundItemImageUrl) { this.foundItemImageUrl = foundItemImageUrl; }

    public Long getClaimantId() { return claimantId; }
    public void setClaimantId(Long claimantId) { this.claimantId = claimantId; }

    public String getClaimantFullName() { return claimantFullName; }
    public void setClaimantFullName(String claimantFullName) { this.claimantFullName = claimantFullName; }

    public String getClaimantEmail() { return claimantEmail; }
    public void setClaimantEmail(String claimantEmail) { this.claimantEmail = claimantEmail; }

    public String getClaimantPhone() { return claimantPhone; }
    public void setClaimantPhone(String claimantPhone) { this.claimantPhone = claimantPhone; }

    public String getClaimantCollegeId() { return claimantCollegeId; }
    public void setClaimantCollegeId(String claimantCollegeId) { this.claimantCollegeId = claimantCollegeId; }

    public String getClaimDescription() { return claimDescription; }
    public void setClaimDescription(String claimDescription) { this.claimDescription = claimDescription; }

    public String getPrivateOwnershipProof() { return privateOwnershipProof; }
    public void setPrivateOwnershipProof(String privateOwnershipProof) { this.privateOwnershipProof = privateOwnershipProof; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getVerifiedByName() { return verifiedByName; }
    public void setVerifiedByName(String verifiedByName) { this.verifiedByName = verifiedByName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public ReturnRecordResponse getReturnRecord() { return returnRecord; }
    public void setReturnRecord(ReturnRecordResponse returnRecord) { this.returnRecord = returnRecord; }
}
