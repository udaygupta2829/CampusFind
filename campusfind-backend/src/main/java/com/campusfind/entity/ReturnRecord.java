package com.campusfind.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "return_records")
public class ReturnRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false, unique = true)
    private Claim claim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_report_id", nullable = false)
    private ItemReport itemReport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by_user_id", nullable = false)
    private User receivedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "returned_by_user_id", nullable = false)
    private User returnedBy;

    @Column(name = "return_date", nullable = false)
    private LocalDateTime returnDate = LocalDateTime.now();

    @Column(name = "handover_location", nullable = false, length = 150)
    private String handoverLocation;

    @Column(name = "verification_method", nullable = false, length = 100)
    private String verificationMethod;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ReturnRecord() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Claim claim;
        private ItemReport itemReport;
        private User receivedBy;
        private User returnedBy;
        private LocalDateTime returnDate = LocalDateTime.now();
        private String handoverLocation;
        private String verificationMethod;
        private String remarks;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder claim(Claim claim) { this.claim = claim; return this; }
        public Builder itemReport(ItemReport itemReport) { this.itemReport = itemReport; return this; }
        public Builder receivedBy(User receivedBy) { this.receivedBy = receivedBy; return this; }
        public Builder returnedBy(User returnedBy) { this.returnedBy = returnedBy; return this; }
        public Builder returnDate(LocalDateTime returnDate) { this.returnDate = returnDate; return this; }
        public Builder handoverLocation(String handoverLocation) { this.handoverLocation = handoverLocation; return this; }
        public Builder verificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }

        public ReturnRecord build() {
            ReturnRecord r = new ReturnRecord();
            r.setId(this.id);
            r.setClaim(this.claim);
            r.setItemReport(this.itemReport);
            r.setReceivedBy(this.receivedBy);
            r.setReturnedBy(this.returnedBy);
            r.setReturnDate(this.returnDate != null ? this.returnDate : LocalDateTime.now());
            r.setHandoverLocation(this.handoverLocation);
            r.setVerificationMethod(this.verificationMethod);
            r.setRemarks(this.remarks);
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Claim getClaim() { return claim; }
    public void setClaim(Claim claim) { this.claim = claim; }

    public ItemReport getItemReport() { return itemReport; }
    public void setItemReport(ItemReport itemReport) { this.itemReport = itemReport; }

    public User getReceivedBy() { return receivedBy; }
    public void setReceivedBy(User receivedBy) { this.receivedBy = receivedBy; }

    public User getReturnedBy() { return returnedBy; }
    public void setReturnedBy(User returnedBy) { this.returnedBy = returnedBy; }

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
