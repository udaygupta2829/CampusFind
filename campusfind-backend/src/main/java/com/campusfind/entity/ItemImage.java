package com.campusfind.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "item_images")
public class ItemImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_report_id", nullable = false)
    private ItemReport itemReport;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "is_primary")
    private Boolean isPrimary = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ItemImage() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private ItemReport itemReport;
        private String imageUrl;
        private String fileName;
        private Boolean isPrimary = true;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder itemReport(ItemReport itemReport) { this.itemReport = itemReport; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder fileName(String fileName) { this.fileName = fileName; return this; }
        public Builder isPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; return this; }

        public ItemImage build() {
            ItemImage img = new ItemImage();
            img.setId(this.id);
            img.setItemReport(this.itemReport);
            img.setImageUrl(this.imageUrl);
            img.setFileName(this.fileName);
            img.setIsPrimary(this.isPrimary);
            return img;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ItemReport getItemReport() { return itemReport; }
    public void setItemReport(ItemReport itemReport) { this.itemReport = itemReport; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
