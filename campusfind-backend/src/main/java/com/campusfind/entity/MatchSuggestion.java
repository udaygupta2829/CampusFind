package com.campusfind.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_suggestions")
public class MatchSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lost_item_id", nullable = false)
    private ItemReport lostItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "found_item_id", nullable = false)
    private ItemReport foundItem;

    @Column(name = "match_score", nullable = false)
    private Double matchScore;

    @Column(name = "match_reason", columnDefinition = "TEXT")
    private String matchReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MatchStatus status = MatchStatus.SUGGESTED;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public MatchSuggestion() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private ItemReport lostItem;
        private ItemReport foundItem;
        private Double matchScore;
        private String matchReason;
        private MatchStatus status = MatchStatus.SUGGESTED;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder lostItem(ItemReport lostItem) { this.lostItem = lostItem; return this; }
        public Builder foundItem(ItemReport foundItem) { this.foundItem = foundItem; return this; }
        public Builder matchScore(Double matchScore) { this.matchScore = matchScore; return this; }
        public Builder matchReason(String matchReason) { this.matchReason = matchReason; return this; }
        public Builder status(MatchStatus status) { this.status = status; return this; }

        public MatchSuggestion build() {
            MatchSuggestion m = new MatchSuggestion();
            m.setId(this.id);
            m.setLostItem(this.lostItem);
            m.setFoundItem(this.foundItem);
            m.setMatchScore(this.matchScore);
            m.setMatchReason(this.matchReason);
            if (this.status != null) m.setStatus(this.status);
            return m;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ItemReport getLostItem() { return lostItem; }
    public void setLostItem(ItemReport lostItem) { this.lostItem = lostItem; }

    public ItemReport getFoundItem() { return foundItem; }
    public void setFoundItem(ItemReport foundItem) { this.foundItem = foundItem; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
