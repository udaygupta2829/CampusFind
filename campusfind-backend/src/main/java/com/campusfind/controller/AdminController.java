package com.campusfind.controller;

import com.campusfind.dto.request.ClaimStatusUpdateRequest;
import com.campusfind.dto.request.ReturnRecordRequest;
import com.campusfind.dto.response.*;
import com.campusfind.entity.ItemType;
import com.campusfind.security.UserPrincipal;
import com.campusfind.service.AdminService;
import com.campusfind.service.ClaimService;
import com.campusfind.service.ItemReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Operations", description = "Endpoints for staff dashboard analytics, claim reviews, and return handovers")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ClaimService claimService;
    private final ItemReportService itemReportService;

    public AdminController(AdminService adminService, ClaimService claimService, ItemReportService itemReportService) {
        this.adminService = adminService;
        this.claimService = claimService;
        this.itemReportService = itemReportService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get overall system metrics, category charts, hotspot locations, and queues")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboardStats() {
        AdminDashboardResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/claims")
    @Operation(summary = "Get all claims across the campus portal")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getAllClaims() {
        List<ClaimResponse> claims = claimService.getAllClaims();
        return ResponseEntity.ok(ApiResponse.ok(claims));
    }

    @PutMapping("/claims/{claimId}/approve")
    @Operation(summary = "Approve an ownership claim after staff verification")
    public ResponseEntity<ApiResponse<ClaimResponse>> approveClaim(
            @PathVariable Long claimId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody(required = false) ClaimStatusUpdateRequest request) {
        if (request == null) {
            request = new ClaimStatusUpdateRequest();
        }
        request.setStatus("APPROVED");
        ClaimResponse response = claimService.updateClaimStatus(claimId, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Claim approved successfully. Student notified.", response));
    }

    @PutMapping("/claims/{claimId}/reject")
    @Operation(summary = "Reject an ownership claim with staff notes")
    public ResponseEntity<ApiResponse<ClaimResponse>> rejectClaim(
            @PathVariable Long claimId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody(required = false) ClaimStatusUpdateRequest request) {
        if (request == null) {
            request = new ClaimStatusUpdateRequest();
        }
        request.setStatus("REJECTED");
        ClaimResponse response = claimService.updateClaimStatus(claimId, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Claim rejected. Student notified.", response));
    }

    @PostMapping("/return-records")
    @Operation(summary = "Record physical item handover and close item report")
    public ResponseEntity<ApiResponse<ReturnRecordResponse>> createReturnRecord(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ReturnRecordRequest request) {
        ReturnRecordResponse response = adminService.createReturnRecord(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.ok("Item handover recorded and item marked as RETURNED.", response), HttpStatus.CREATED);
    }

    @GetMapping("/return-records")
    @Operation(summary = "Get full registry of all item returns")
    public ResponseEntity<ApiResponse<List<ReturnRecordResponse>>> getAllReturnRecords() {
        List<ReturnRecordResponse> records = adminService.getAllReturnRecords();
        return ResponseEntity.ok(ApiResponse.ok(records));
    }

    @GetMapping("/reports")
    @Operation(summary = "Get all reports (Lost & Found) for admin moderation")
    public ResponseEntity<ApiResponse<List<ItemReportResponse>>> getAllReports(
            @RequestParam(required = false) ItemType type) {
        List<ItemReportResponse> reports = itemReportService.getAllReports(type);
        return ResponseEntity.ok(ApiResponse.ok(reports));
    }
}
