package com.campusfind.service.impl;

import com.campusfind.dto.request.ItemReportRequest;
import com.campusfind.dto.response.ItemImageResponse;
import com.campusfind.dto.response.ItemReportResponse;
import com.campusfind.entity.*;
import com.campusfind.exception.BadRequestException;
import com.campusfind.exception.ResourceNotFoundException;
import com.campusfind.exception.UnauthorizedException;
import com.campusfind.repository.ItemImageRepository;
import com.campusfind.repository.ItemReportRepository;
import com.campusfind.repository.UserRepository;
import com.campusfind.service.ItemReportService;
import com.campusfind.service.MatchingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemReportServiceImpl implements ItemReportService {

    private final ItemReportRepository itemReportRepository;
    private final ItemImageRepository itemImageRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;

    public ItemReportServiceImpl(ItemReportRepository itemReportRepository, ItemImageRepository itemImageRepository, UserRepository userRepository, MatchingService matchingService) {
        this.itemReportRepository = itemReportRepository;
        this.itemImageRepository = itemImageRepository;
        this.userRepository = userRepository;
        this.matchingService = matchingService;
    }

    @Override
    @Transactional
    public ItemReportResponse createReport(Long userId, ItemReportRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        ItemType type;
        try {
            type = ItemType.valueOf(request.getType().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid item type. Must be LOST or FOUND.");
        }

        ItemReport report = ItemReport.builder()
                .user(user)
                .type(type)
                .itemName(request.getItemName().trim())
                .category(request.getCategory().trim())
                .colour(request.getColour().trim())
                .description(request.getDescription().trim())
                .uniqueMarks(type == ItemType.LOST && request.getUniqueMarks() != null ? request.getUniqueMarks().trim() : null)
                .location(request.getLocation().trim())
                .eventDate(request.getEventDate())
                .contactPreference(type == ItemType.LOST && request.getContactPreference() != null ? request.getContactPreference().trim() : "Campus Portal")
                .itemHeldAt(type == ItemType.FOUND && request.getItemHeldAt() != null ? request.getItemHeldAt().trim() : "Security Office")
                .status(ItemStatus.OPEN)
                .build();

        ItemReport savedReport = itemReportRepository.save(report);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ItemImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                ItemImage image = ItemImage.builder()
                        .itemReport(savedReport)
                        .imageUrl(url)
                        .fileName(url.substring(url.lastIndexOf('/') + 1))
                        .isPrimary(i == 0)
                        .build();
                images.add(image);
            }
            itemImageRepository.saveAll(images);
            savedReport.setImages(images);
        }

        try {
            matchingService.evaluateAndSaveMatchesFor(savedReport);
        } catch (Exception ignored) {}

        return mapToResponse(savedReport, userId, true);
    }

    @Override
    @Transactional
    public ItemReportResponse updateReport(Long reportId, Long userId, boolean isAdmin, ItemReportRequest request) {
        ItemReport report = itemReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        if (!isAdmin && !report.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to edit this report.");
        }

        report.setItemName(request.getItemName().trim());
        report.setCategory(request.getCategory().trim());
        report.setColour(request.getColour().trim());
        report.setDescription(request.getDescription().trim());
        report.setLocation(request.getLocation().trim());
        report.setEventDate(request.getEventDate());

        if (report.getType() == ItemType.LOST) {
            report.setUniqueMarks(request.getUniqueMarks() != null ? request.getUniqueMarks().trim() : null);
            report.setContactPreference(request.getContactPreference() != null ? request.getContactPreference().trim() : "Campus Portal");
        } else {
            report.setItemHeldAt(request.getItemHeldAt() != null ? request.getItemHeldAt().trim() : report.getItemHeldAt());
        }

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            itemImageRepository.deleteByItemReportId(report.getId());
            List<ItemImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                ItemImage image = ItemImage.builder()
                        .itemReport(report)
                        .imageUrl(url)
                        .fileName(url.substring(url.lastIndexOf('/') + 1))
                        .isPrimary(i == 0)
                        .build();
                images.add(image);
            }
            itemImageRepository.saveAll(images);
            report.setImages(images);
        }

        ItemReport updated = itemReportRepository.save(report);

        try {
            matchingService.evaluateAndSaveMatchesFor(updated);
        } catch (Exception ignored) {}

        return mapToResponse(updated, userId, isAdmin);
    }

    @Override
    @Transactional
    public void deleteReport(Long reportId, Long userId, boolean isAdmin) {
        ItemReport report = itemReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        if (!isAdmin && !report.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this report.");
        }

        itemReportRepository.delete(report);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemReportResponse getReportById(Long reportId, Long currentUserId, boolean isAdmin) {
        ItemReport report = itemReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        return mapToResponse(report, currentUserId, isAdmin);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemReportResponse> searchReports(ItemType type, String category, String colour, String location,
                                                 ItemStatus status, LocalDate fromDate, LocalDate toDate,
                                                 String keyword, Pageable pageable, Long currentUserId, boolean isAdmin) {
        Page<ItemReport> page = itemReportRepository.searchReports(type, category, colour, location, status, fromDate, toDate, keyword, pageable);
        return page.map(r -> mapToResponse(r, currentUserId, isAdmin));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemReportResponse> getUserReports(Long userId) {
        return itemReportRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(r -> mapToResponse(r, userId, true))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ItemReportResponse addImageToReport(Long reportId, Long userId, boolean isAdmin, String imageUrl, String fileName) {
        ItemReport report = itemReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        if (!isAdmin && !report.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to add images to this report.");
        }

        ItemImage image = ItemImage.builder()
                .itemReport(report)
                .imageUrl(imageUrl)
                .fileName(fileName)
                .isPrimary(report.getImages().isEmpty())
                .build();

        itemImageRepository.save(image);
        report.getImages().add(image);

        return mapToResponse(report, userId, isAdmin);
    }

    @Override
    @Transactional
    public ItemReportResponse updateReportStatus(Long reportId, String statusStr, Long userId, boolean isAdmin) {
        ItemReport report = itemReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        if (!isAdmin && !report.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify status for this report.");
        }

        try {
            ItemStatus status = ItemStatus.valueOf(statusStr.trim().toUpperCase());
            report.setStatus(status);
            ItemReport saved = itemReportRepository.save(report);
            return mapToResponse(saved, userId, isAdmin);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status value: " + statusStr);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemReportResponse> getAllReports(ItemType type) {
        List<ItemReport> reports = (type != null) ? itemReportRepository.findByTypeOrderByCreatedAtDesc(type) : itemReportRepository.findAll();
        return reports.stream().map(r -> mapToResponse(r, null, true)).collect(Collectors.toList());
    }

    private ItemReportResponse mapToResponse(ItemReport report, Long currentUserId, boolean isAdmin) {
        boolean isOwner = currentUserId != null && report.getUser().getId().equals(currentUserId);
        boolean canViewPrivateMarks = isOwner || isAdmin;

        List<ItemImageResponse> imageResponses = report.getImages() != null ? report.getImages().stream()
                .map(img -> ItemImageResponse.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .fileName(img.getFileName())
                        .isPrimary(img.getIsPrimary())
                        .createdAt(img.getCreatedAt())
                        .build())
                .collect(Collectors.toList()) : new ArrayList<>();

        int matchCount = report.getType() == ItemType.LOST
                ? (report.getLostMatchSuggestions() != null ? report.getLostMatchSuggestions().size() : 0)
                : (report.getFoundMatchSuggestions() != null ? report.getFoundMatchSuggestions().size() : 0);

        return ItemReportResponse.builder()
                .id(report.getId())
                .userId(report.getUser().getId())
                .userFullName(report.getUser().getFullName())
                .userEmail(canViewPrivateMarks ? report.getUser().getEmail() : null)
                .userCollegeId(canViewPrivateMarks ? report.getUser().getCollegeId() : null)
                .type(report.getType().name())
                .itemName(report.getItemName())
                .category(report.getCategory())
                .colour(report.getColour())
                .description(report.getDescription())
                .uniqueMarks(canViewPrivateMarks ? report.getUniqueMarks() : null)
                .location(report.getLocation())
                .eventDate(report.getEventDate())
                .contactPreference(report.getContactPreference())
                .itemHeldAt(report.getItemHeldAt())
                .status(report.getStatus().name())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .images(imageResponses)
                .claimCount(report.getClaims() != null ? report.getClaims().size() : 0)
                .matchSuggestionCount(matchCount)
                .isOwner(isOwner)
                .build();
    }
}
