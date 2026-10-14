package com.campusfind.controller;

import com.campusfind.dto.request.ClaimRequest;
import com.campusfind.dto.response.ApiResponse;
import com.campusfind.dto.response.ClaimResponse;
import com.campusfind.security.UserPrincipal;
import com.campusfind.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@Tag(name = "Claims", description = "Endpoints for submitting and viewing item ownership claims")
@SecurityRequirement(name = "Bearer Authentication")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    @Operation(summary = "Submit an ownership claim for a found item with private proof")
    public ResponseEntity<ApiResponse<ClaimResponse>> submitClaim(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ClaimRequest request) {
        ClaimResponse response = claimService.submitClaim(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.ok("Claim submitted successfully! Staff will review your proof.", response), HttpStatus.CREATED);
    }

    @GetMapping("/my-claims")
    @Operation(summary = "Get all claims submitted by current student")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getMyClaims(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ClaimResponse> claims = claimService.getUserClaims(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(claims));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of a specific claim")
    public ResponseEntity<ApiResponse<ClaimResponse>> getClaimById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = "ROLE_ADMIN".equals(userPrincipal.getRole());
        ClaimResponse response = claimService.getClaimById(id, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/item/{foundItemId}")
    @Operation(summary = "Get all claims submitted for a specific found item")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getClaimsForFoundItem(
            @PathVariable Long foundItemId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = "ROLE_ADMIN".equals(userPrincipal.getRole());
        List<ClaimResponse> responses = claimService.getClaimsForFoundItem(foundItemId, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }
}
