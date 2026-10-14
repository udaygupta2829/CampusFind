package com.campusfind.dto.response;

import java.time.LocalDateTime;

public class ItemImageResponse {
    private Long id;
    private String imageUrl;
    private String fileName;
    private Boolean isPrimary;
    private LocalDateTime createdAt;

    public ItemImageResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String imageUrl;
        private String fileName;
        private Boolean isPrimary;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder fileName(String fileName) { this.fileName = fileName; return this; }
        public Builder isPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ItemImageResponse build() {
            ItemImageResponse img = new ItemImageResponse();
            img.setId(this.id);
            img.setImageUrl(this.imageUrl);
            img.setFileName(this.fileName);
            img.setIsPrimary(this.isPrimary);
            img.setCreatedAt(this.createdAt);
            return img;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
