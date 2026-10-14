package com.campusfind.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public class ItemReportRequest {

    @NotBlank(message = "Report type (LOST or FOUND) is required")
    private String type;

    @NotBlank(message = "Item name is required")
    @Size(max = 150, message = "Item name must not exceed 150 characters")
    private String itemName;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Colour is required")
    private String colour;

    @NotBlank(message = "Description is required")
    private String description;

    private String uniqueMarks;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Event date is required")
    private LocalDate eventDate;

    private String contactPreference;
    private String itemHeldAt;
    private List<String> imageUrls;

    public ItemReportRequest() {}

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

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
