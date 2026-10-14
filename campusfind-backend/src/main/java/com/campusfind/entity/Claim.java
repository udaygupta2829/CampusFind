package com.campusfind.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "found_item_id", nullable = false)
    private ItemReport foundItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claimant_id", nullable = false)
    private User claimant;

    @Column(name = "claim_description", nullable = false, columnDefinition = "TEXT")
    private String claimDescription;

    @Column(name = "private_ownership_proof", nullable = false, columnDefinition = "TEXT")
    private String privateOwnershipProof;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ClaimStatus status = ClaimStatus.PENDING;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_user_id")
    private User verifiedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "claim", cascade = CascadeType.ALL, orphanRemoval = true)
    private ReturnRecord returnRecord;

    public Claim() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private ItemReport foundItem;
        private User claimant;
        private String claimDescription;
        private String privateOwnershipProof;
        private ClaimStatus status = ClaimStatus.PENDING;
        private String adminNotes;
        private User verifiedBy;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder foundItem(ItemReport foundItem) { this.foundItem = foundItem; return this; }
        public Builder claimant(User claimant) { this.claimant = claimant; return this; }
        public Builder claimDescription(String claimDescription) { this.claimDescription = claimDescription; return this; }
        public Builder privateOwnershipProof(String privateOwnershipProof) { this.privateOwnershipProof = privateOwnershipProof; return this; }
        public Builder status(ClaimStatus status) { this.status = status; return this; }
        public Builder adminNotes(String adminNotes) { this.adminNotes = adminNotes; return this; }
        public Builder verifiedBy(User verifiedBy) { this.verifiedBy = verifiedBy; return this; }

        public Claim build() {
            Claim c = new Claim();
            c.setId(this.id);
            c.setFoundItem(this.foundItem);
            c.setClaimant(this.claimant);
            c.setClaimDescription(this.claimDescription);
            c.setPrivateOwnershipProof(this.privateOwnershipProof);
            if (this.status != null) c.setStatus(this.status);
            c.setAdminNotes(this.adminNotes);
            c.setVerifiedBy(this.verifiedBy);
            return c;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ItemReport getFoundItem() { return foundItem; }
    public void setFoundItem(ItemReport foundItem) { this.foundItem = foundItem; }

    public User getClaimant() { return claimant; }
    public void setClaimant(User claimant) { this.claimant = claimant; }

    public String getClaimDescription() { return claimDescription; }
    public void setClaimDescription(String claimDescription) { this.claimDescription = claimDescription; }

    public String getPrivateOwnershipProof() { return privateOwnershipProof; }
    public void setPrivateOwnershipProof(String privateOwnershipProof) { this.privateOwnershipProof = privateOwnershipProof; }

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public User getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(User verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public ReturnRecord getReturnRecord() { return returnRecord; }
    public void setReturnRecord(ReturnRecord returnRecord) { this.returnRecord = returnRecord; }
}
