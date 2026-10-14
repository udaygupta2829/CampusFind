package com.campusfind.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "item_reports")
public class ItemReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ItemType type;

    @Column(name = "item_name", nullable = false, length = 150)
    private String itemName;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 50)
    private String colour;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "unique_marks", columnDefinition = "TEXT")
    private String uniqueMarks;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "contact_preference", length = 50)
    private String contactPreference;

    @Column(name = "item_held_at", length = 100)
    private String itemHeldAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ItemStatus status = ItemStatus.OPEN;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "itemReport", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "foundItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Claim> claims = new ArrayList<>();

    @OneToMany(mappedBy = "lostItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MatchSuggestion> lostMatchSuggestions = new ArrayList<>();

    @OneToMany(mappedBy = "foundItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MatchSuggestion> foundMatchSuggestions = new ArrayList<>();

    public ItemReport() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private ItemType type;
        private String itemName;
        private String category;
        private String colour;
        private String description;
        private String uniqueMarks;
        private String location;
        private LocalDate eventDate;
        private String contactPreference;
        private String itemHeldAt;
        private ItemStatus status = ItemStatus.OPEN;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder type(ItemType type) { this.type = type; return this; }
        public Builder itemName(String itemName) { this.itemName = itemName; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder colour(String colour) { this.colour = colour; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder uniqueMarks(String uniqueMarks) { this.uniqueMarks = uniqueMarks; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder eventDate(LocalDate eventDate) { this.eventDate = eventDate; return this; }
        public Builder contactPreference(String contactPreference) { this.contactPreference = contactPreference; return this; }
        public Builder itemHeldAt(String itemHeldAt) { this.itemHeldAt = itemHeldAt; return this; }
        public Builder status(ItemStatus status) { this.status = status; return this; }

        public ItemReport build() {
            ItemReport r = new ItemReport();
            r.setId(this.id);
            r.setUser(this.user);
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
            if (this.status != null) r.setStatus(this.status);
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ItemType getType() { return type; }
    public void setType(ItemType type) { this.type = type; }

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

    public ItemStatus getStatus() { return status; }
    public void setStatus(ItemStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ItemImage> getImages() { return images; }
    public void setImages(List<ItemImage> images) { this.images = images; }

    public List<Claim> getClaims() { return claims; }
    public void setClaims(List<Claim> claims) { this.claims = claims; }

    public List<MatchSuggestion> getLostMatchSuggestions() { return lostMatchSuggestions; }
    public void setLostMatchSuggestions(List<MatchSuggestion> lostMatchSuggestions) { this.lostMatchSuggestions = lostMatchSuggestions; }

    public List<MatchSuggestion> getFoundMatchSuggestions() { return foundMatchSuggestions; }
    public void setFoundMatchSuggestions(List<MatchSuggestion> foundMatchSuggestions) { this.foundMatchSuggestions = foundMatchSuggestions; }
}
