package com.campusfind.controller;

import com.campusfind.dto.request.ItemReportRequest;
import com.campusfind.dto.response.ApiResponse;
import com.campusfind.dto.response.ItemReportResponse;
import com.campusfind.entity.ItemStatus;
import com.campusfind.entity.ItemType;
import com.campusfind.security.UserPrincipal;
import com.campusfind.service.FileStorageService;
import com.campusfind.service.ItemReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Item Reports", description = "Endpoints for reporting, searching, and managing lost and found items")
public class ItemReportController {

    private final ItemReportService itemReportService;
    private final FileStorageService fileStorageService;

    public ItemReportController(ItemReportService itemReportService, FileStorageService fileStorageService) {
        this.itemReportService = itemReportService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/items")
    @Operation(summary = "Get all lost or found items")
    public ResponseEntity<ApiResponse<List<ItemReportResponse>>> getAllItems(
            @RequestParam(required = false) ItemType type) {
        List<ItemReportResponse> items = itemReportService.getAllReports(type);
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @PostMapping("/items")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Create a new Lost or Found item report")
    public ResponseEntity<ApiResponse<ItemReportResponse>> createReport(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ItemReportRequest request) {
        ItemReportResponse response = itemReportService.createReport(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.ok("Report created successfully! Matching scan completed.", response), HttpStatus.CREATED);
    }

    @GetMapping("/items/{id}")
    @Operation(summary = "Get details of a specific item report")
    public ResponseEntity<ApiResponse<ItemReportResponse>> getReportById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        boolean isAdmin = userPrincipal != null && "ROLE_ADMIN".equals(userPrincipal.getRole());
        ItemReportResponse response = itemReportService.getReportById(id, currentUserId, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/items/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update an existing item report (Owner or Admin)")
    public ResponseEntity<ApiResponse<ItemReportResponse>> updateReport(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ItemReportRequest request) {
        boolean isAdmin = "ROLE_ADMIN".equals(userPrincipal.getRole());
        ItemReportResponse response = itemReportService.updateReport(id, userPrincipal.getId(), isAdmin, request);
        return ResponseEntity.ok(ApiResponse.ok("Report updated successfully", response));
    }

    @DeleteMapping("/items/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Delete an item report (Owner or Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteReport(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = "ROLE_ADMIN".equals(userPrincipal.getRole());
        itemReportService.deleteReport(id, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Report deleted successfully", null));
    }

    @GetMapping("/items/search")
    @Operation(summary = "Search items by keyword, category, colour, location, date range, and status")
    public ResponseEntity<ApiResponse<Page<ItemReportResponse>>> searchReports(
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String colour,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        boolean isAdmin = userPrincipal != null && "ROLE_ADMIN".equals(userPrincipal.getRole());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<ItemReportResponse> result = itemReportService.searchReports(
                type, category, colour, location, status, fromDate, toDate, keyword, pageable, currentUserId, isAdmin
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping({"/my-reports", "/items/my-reports"})
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get all reports submitted by the logged-in student")
    public ResponseEntity<ApiResponse<List<ItemReportResponse>>> getMyReports(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ItemReportResponse> myReports = itemReportService.getUserReports(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(myReports));
    }

    @PostMapping(value = "/items/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Upload an item image and receive its accessible URL")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(ApiResponse.ok("Image uploaded successfully", Collections.singletonMap("imageUrl", fileUrl)));
    }

    @PostMapping("/items/{id}/images")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Add an image URL to an existing report")
    public ResponseEntity<ApiResponse<ItemReportResponse>> addImageToReport(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String imageUrl = body.get("imageUrl");
        String fileName = imageUrl != null && imageUrl.contains("/") ? imageUrl.substring(imageUrl.lastIndexOf('/') + 1) : "image.jpg";
        boolean isAdmin = "ROLE_ADMIN".equals(userPrincipal.getRole());
        ItemReportResponse response = itemReportService.addImageToReport(id, userPrincipal.getId(), isAdmin, imageUrl, fileName);
        return ResponseEntity.ok(ApiResponse.ok("Image added to report", response));
    }

    @PatchMapping("/items/{id}/status")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update status of an item report")
    public ResponseEntity<ApiResponse<ItemReportResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String status = body.get("status");
        boolean isAdmin = "ROLE_ADMIN".equals(userPrincipal.getRole());
        ItemReportResponse response = itemReportService.updateReportStatus(id, status, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", response));
    }
}
