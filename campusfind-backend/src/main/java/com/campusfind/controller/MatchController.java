package com.campusfind.controller;

import com.campusfind.dto.response.ApiResponse;
import com.campusfind.dto.response.MatchSuggestionResponse;
import com.campusfind.security.UserPrincipal;
import com.campusfind.service.MatchingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
@Tag(name = "Matching Engine", description = "Endpoints for rule-based match suggestions between lost and found reports")
@SecurityRequirement(name = "Bearer Authentication")
public class MatchController {

    private final MatchingService matchingService;

    public MatchController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping
    @Operation(summary = "Get suggested matches for current user or all if admin")
    public ResponseEntity<ApiResponse<List<MatchSuggestionResponse>>> getMatches(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = "ROLE_ADMIN".equals(userPrincipal.getRole());
        List<MatchSuggestionResponse> matches = isAdmin
                ? matchingService.getAllMatchesForAdmin()
                : matchingService.getAllMatchesForUser(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    @GetMapping("/lost/{lostItemId}")
    @Operation(summary = "Get matches for a specific lost item report")
    public ResponseEntity<ApiResponse<List<MatchSuggestionResponse>>> getMatchesForLost(
            @PathVariable Long lostItemId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = "ROLE_ADMIN".equals(userPrincipal.getRole());
        List<MatchSuggestionResponse> matches = matchingService.getMatchesForLostItem(lostItemId, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    @GetMapping("/found/{foundItemId}")
    @Operation(summary = "Get matches for a specific found item report")
    public ResponseEntity<ApiResponse<List<MatchSuggestionResponse>>> getMatchesForFound(
            @PathVariable Long foundItemId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = "ROLE_ADMIN".equals(userPrincipal.getRole());
        List<MatchSuggestionResponse> matches = matchingService.getMatchesForFoundItem(foundItemId, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin confirm or reject a match suggestion")
    public ResponseEntity<ApiResponse<MatchSuggestionResponse>> updateMatchStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        MatchSuggestionResponse updated = matchingService.updateMatchStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Match status updated", updated));
    }
}
