package com.campusfind.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClaimRequest {

    @NotNull(message = "Found item ID is required")
    private Long foundItemId;

    @NotBlank(message = "Claim description is required")
    private String claimDescription;

    @NotBlank(message = "Private ownership proof is required to verify your claim")
    private String privateOwnershipProof;

    public ClaimRequest() {}

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public String getClaimDescription() { return claimDescription; }
    public void setClaimDescription(String claimDescription) { this.claimDescription = claimDescription; }

    public String getPrivateOwnershipProof() { return privateOwnershipProof; }
    public void setPrivateOwnershipProof(String privateOwnershipProof) { this.privateOwnershipProof = privateOwnershipProof; }
}
