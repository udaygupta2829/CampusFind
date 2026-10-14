package com.campusfind.dto.response;

import java.time.LocalDateTime;

public class ReturnRecordResponse {
    private Long id;
    private Long claimId;
    private Long itemReportId;
    private String itemName;
    private Long receivedByUserId;
    private String receivedByUserName;
    private String receivedByUserEmail;
    private Long returnedByUserId;
    private String returnedByUserName;
    private LocalDateTime returnDate;
    private String handoverLocation;
    private String verificationMethod;
    private String remarks;
    private LocalDateTime createdAt;

    public ReturnRecordResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long claimId;
        private Long itemReportId;
        private String itemName;
        private Long receivedByUserId;
        private String receivedByUserName;
        private String receivedByUserEmail;
        private Long returnedByUserId;
        private String returnedByUserName;
        private LocalDateTime returnDate;
        private String handoverLocation;
        private String verificationMethod;
        private String remarks;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder claimId(Long claimId) { this.claimId = claimId; return this; }
        public Builder itemReportId(Long itemReportId) { this.itemReportId = itemReportId; return this; }
        public Builder itemName(String itemName) { this.itemName = itemName; return this; }
        public Builder receivedByUserId(Long receivedByUserId) { this.receivedByUserId = receivedByUserId; return this; }
        public Builder receivedByUserName(String receivedByUserName) { this.receivedByUserName = receivedByUserName; return this; }
        public Builder receivedByUserEmail(String receivedByUserEmail) { this.receivedByUserEmail = receivedByUserEmail; return this; }
        public Builder returnedByUserId(Long returnedByUserId) { this.returnedByUserId = returnedByUserId; return this; }
        public Builder returnedByUserName(String returnedByUserName) { this.returnedByUserName = returnedByUserName; return this; }
        public Builder returnDate(LocalDateTime returnDate) { this.returnDate = returnDate; return this; }
        public Builder handoverLocation(String handoverLocation) { this.handoverLocation = handoverLocation; return this; }
        public Builder verificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ReturnRecordResponse build() {
            ReturnRecordResponse r = new ReturnRecordResponse();
            r.setId(this.id);
            r.setClaimId(this.claimId);
            r.setItemReportId(this.itemReportId);
            r.setItemName(this.itemName);
            r.setReceivedByUserId(this.receivedByUserId);
            r.setReceivedByUserName(this.receivedByUserName);
            r.setReceivedByUserEmail(this.receivedByUserEmail);
            r.setReturnedByUserId(this.returnedByUserId);
            r.setReturnedByUserName(this.returnedByUserName);
            r.setReturnDate(this.returnDate);
            r.setHandoverLocation(this.handoverLocation);
            r.setVerificationMethod(this.verificationMethod);
            r.setRemarks(this.remarks);
            r.setCreatedAt(this.createdAt);
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public Long getItemReportId() { return itemReportId; }
    public void setItemReportId(Long itemReportId) { this.itemReportId = itemReportId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Long getReceivedByUserId() { return receivedByUserId; }
    public void setReceivedByUserId(Long receivedByUserId) { this.receivedByUserId = receivedByUserId; }

    public String getReceivedByUserName() { return receivedByUserName; }
    public void setReceivedByUserName(String receivedByUserName) { this.receivedByUserName = receivedByUserName; }

    public String getReceivedByUserEmail() { return receivedByUserEmail; }
    public void setReceivedByUserEmail(String receivedByUserEmail) { this.receivedByUserEmail = receivedByUserEmail; }

    public Long getReturnedByUserId() { return returnedByUserId; }
    public void setReturnedByUserId(Long returnedByUserId) { this.returnedByUserId = returnedByUserId; }

    public String getReturnedByUserName() { return returnedByUserName; }
    public void setReturnedByUserName(String returnedByUserName) { this.returnedByUserName = returnedByUserName; }

    public LocalDateTime getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDateTime returnDate) { this.returnDate = returnDate; }

    public String getHandoverLocation() { return handoverLocation; }
    public void setHandoverLocation(String handoverLocation) { this.handoverLocation = handoverLocation; }

    public String getVerificationMethod() { return verificationMethod; }
    public void setVerificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
