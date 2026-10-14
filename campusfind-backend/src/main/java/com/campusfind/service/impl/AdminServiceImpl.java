package com.campusfind.service.impl;

import com.campusfind.dto.request.ReturnRecordRequest;
import com.campusfind.dto.response.AdminDashboardResponse;
import com.campusfind.dto.response.ClaimResponse;
import com.campusfind.dto.response.ItemReportResponse;
import com.campusfind.dto.response.ReturnRecordResponse;
import com.campusfind.entity.*;
import com.campusfind.exception.BadRequestException;
import com.campusfind.exception.ResourceNotFoundException;
import com.campusfind.repository.*;
import com.campusfind.service.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ItemReportRepository itemReportRepository;
    private final ClaimRepository claimRepository;
    private final ReturnRecordRepository returnRecordRepository;
    private final ItemReportService itemReportService;
    private final ClaimService claimService;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public AdminServiceImpl(UserRepository userRepository, ItemReportRepository itemReportRepository, ClaimRepository claimRepository, ReturnRecordRepository returnRecordRepository, ItemReportService itemReportService, ClaimService claimService, NotificationService notificationService, EmailService emailService) {
        this.userRepository = userRepository;
        this.itemReportRepository = itemReportRepository;
        this.claimRepository = claimRepository;
        this.returnRecordRepository = returnRecordRepository;
        this.itemReportService = itemReportService;
        this.claimService = claimService;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats() {
        long totalLost = itemReportRepository.countByType(ItemType.LOST);
        long totalFound = itemReportRepository.countByType(ItemType.FOUND);
        long openReports = itemReportRepository.countByStatus(ItemStatus.OPEN);
        long pendingClaims = claimRepository.countByStatus(ClaimStatus.PENDING);
        long approvedClaims = claimRepository.countByStatus(ClaimStatus.APPROVED);
        long returnedItems = itemReportRepository.countByStatus(ItemStatus.RETURNED);
        long totalUsers = userRepository.count();

        List<Map<String, Object>> popularCategories = itemReportRepository.findCategoryBreakdown();
        List<Map<String, Object>> commonLostLocations = itemReportRepository.findCommonLostLocations();

        List<ClaimResponse> recentPending = claimService.getAllPendingClaims().stream()
                .limit(5)
                .collect(Collectors.toList());

        List<ItemReportResponse> recentReports = itemReportService.getAllReports(null).stream()
                .limit(6)
                .collect(Collectors.toList());

        List<ReturnRecordResponse> recentReturns = getAllReturnRecords().stream()
                .limit(5)
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalLostReports(totalLost)
                .totalFoundReports(totalFound)
                .openReports(openReports)
                .pendingClaims(pendingClaims)
                .approvedClaims(approvedClaims)
                .returnedItems(returnedItems)
                .totalUsers(totalUsers)
                .popularCategories(popularCategories)
                .commonLostLocations(commonLostLocations)
                .recentPendingClaims(recentPending)
                .recentReports(recentReports)
                .recentReturnRecords(recentReturns)
                .build();
    }

    @Override
    @Transactional
    public ReturnRecordResponse createReturnRecord(Long adminId, ReturnRecordRequest request) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        Claim claim = claimRepository.findById(request.getClaimId())
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + request.getClaimId()));

        if (returnRecordRepository.findByClaimId(claim.getId()).isPresent()) {
            throw new BadRequestException("A return record already exists for this claim.");
        }

        ItemReport foundItem = claim.getFoundItem();
        User recipient = claim.getClaimant();

        claim.setStatus(ClaimStatus.RETURNED);
        foundItem.setStatus(ItemStatus.RETURNED);

        claimRepository.save(claim);
        itemReportRepository.save(foundItem);

        ReturnRecord record = ReturnRecord.builder()
                .claim(claim)
                .itemReport(foundItem)
                .receivedBy(recipient)
                .returnedBy(admin)
                .returnDate(LocalDateTime.now())
                .handoverLocation(request.getHandoverLocation().trim())
                .verificationMethod(request.getVerificationMethod().trim())
                .remarks(request.getRemarks() != null ? request.getRemarks().trim() : null)
                .build();

        ReturnRecord savedRecord = returnRecordRepository.save(record);

        notificationService.createNotification(
                recipient,
                "Item Return Completed",
                "Your item '" + foundItem.getItemName() + "' has been successfully handed over to you at " + request.getHandoverLocation() + ".",
                "ITEM_RETURNED",
                foundItem.getId()
        );

        emailService.sendItemReturnConfirmation(
                recipient.getEmail(),
                recipient.getFullName(),
                foundItem.getItemName(),
                request.getHandoverLocation()
        );

        return mapToResponse(savedRecord);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReturnRecordResponse> getAllReturnRecords() {
        return returnRecordRepository.findAllByOrderByReturnDateDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReturnRecordResponse mapToResponse(ReturnRecord r) {
        return ReturnRecordResponse.builder()
                .id(r.getId())
                .claimId(r.getClaim().getId())
                .itemReportId(r.getItemReport().getId())
                .itemName(r.getItemReport().getItemName())
                .receivedByUserId(r.getReceivedBy().getId())
                .receivedByUserName(r.getReceivedBy().getFullName())
                .receivedByUserEmail(r.getReceivedBy().getEmail())
                .returnedByUserId(r.getReturnedBy().getId())
                .returnedByUserName(r.getReturnedBy().getFullName())
                .returnDate(r.getReturnDate())
                .handoverLocation(r.getHandoverLocation())
                .verificationMethod(r.getVerificationMethod())
                .remarks(r.getRemarks())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
