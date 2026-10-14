package com.campusfind.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ClaimStatusUpdateRequest {

    @NotBlank(message = "Status is required (APPROVED or REJECTED)")
    private String status;

    private String adminNotes;

    public ClaimStatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
