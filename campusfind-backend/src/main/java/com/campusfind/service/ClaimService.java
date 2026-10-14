package com.campusfind.service;

import com.campusfind.dto.request.ClaimRequest;
import com.campusfind.dto.request.ClaimStatusUpdateRequest;
import com.campusfind.dto.response.ClaimResponse;

import java.util.List;

public interface ClaimService {
    ClaimResponse submitClaim(Long claimantId, ClaimRequest request);
    List<ClaimResponse> getUserClaims(Long claimantId);
    ClaimResponse getClaimById(Long claimId, Long currentUserId, boolean isAdmin);
    List<ClaimResponse> getClaimsForFoundItem(Long foundItemId, Long currentUserId, boolean isAdmin);
    ClaimResponse updateClaimStatus(Long claimId, Long adminId, ClaimStatusUpdateRequest request);
    List<ClaimResponse> getAllPendingClaims();
    List<ClaimResponse> getAllClaims();
}
