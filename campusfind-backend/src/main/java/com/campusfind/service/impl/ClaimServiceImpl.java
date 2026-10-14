package com.campusfind.service.impl;

import com.campusfind.dto.request.ClaimRequest;
import com.campusfind.dto.request.ClaimStatusUpdateRequest;
import com.campusfind.dto.response.ClaimResponse;
import com.campusfind.dto.response.ReturnRecordResponse;
import com.campusfind.entity.*;
import com.campusfind.exception.BadRequestException;
import com.campusfind.exception.ResourceNotFoundException;
import com.campusfind.exception.UnauthorizedException;
import com.campusfind.repository.ClaimRepository;
import com.campusfind.repository.ItemReportRepository;
import com.campusfind.repository.UserRepository;
import com.campusfind.service.ClaimService;
import com.campusfind.service.EmailService;
import com.campusfind.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemReportRepository itemReportRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public ClaimServiceImpl(ClaimRepository claimRepository, ItemReportRepository itemReportRepository, UserRepository userRepository, NotificationService notificationService, EmailService emailService) {
        this.claimRepository = claimRepository;
        this.itemReportRepository = itemReportRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public ClaimResponse submitClaim(Long claimantId, ClaimRequest request) {
        User claimant = userRepository.findById(claimantId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + claimantId));

        ItemReport foundItem = itemReportRepository.findById(request.getFoundItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Found item not found with id: " + request.getFoundItemId()));

        if (foundItem.getType() != ItemType.FOUND) {
            throw new BadRequestException("Ownership claims can only be submitted against Found item reports.");
        }

        if (foundItem.getStatus() == ItemStatus.RETURNED || foundItem.getStatus() == ItemStatus.CLOSED) {
            throw new BadRequestException("This item is already returned or closed. Claims cannot be submitted.");
        }

        if (foundItem.getUser().getId().equals(claimantId)) {
            throw new BadRequestException("You cannot submit an ownership claim on an item you reported as found.");
        }

        if (claimRepository.existsByFoundItemIdAndClaimantId(foundItem.getId(), claimantId)) {
            throw new BadRequestException("You have already submitted an active claim for this item.");
        }

        Claim claim = Claim.builder()
                .foundItem(foundItem)
                .claimant(claimant)
                .claimDescription(request.getClaimDescription().trim())
                .privateOwnershipProof(request.getPrivateOwnershipProof().trim())
                .status(ClaimStatus.PENDING)
                .build();

        Claim savedClaim = claimRepository.save(claim);

        if (foundItem.getStatus() == ItemStatus.OPEN || foundItem.getStatus() == ItemStatus.POSSIBLE_MATCH) {
            foundItem.setStatus(ItemStatus.CLAIM_REQUESTED);
            itemReportRepository.save(foundItem);
        }

        notificationService.createNotification(
                claimant,
                "Claim Submitted Successfully",
                "Your ownership claim for '" + foundItem.getItemName() + "' has been received and is pending admin verification.",
                "CLAIM_STATUS",
                foundItem.getId()
        );

        return mapToResponse(savedClaim, claimantId, false);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponse> getUserClaims(Long claimantId) {
        return claimRepository.findByClaimantIdOrderByCreatedAtDesc(claimantId)
                .stream()
                .map(c -> mapToResponse(c, claimantId, false))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClaimResponse getClaimById(Long claimId, Long currentUserId, boolean isAdmin) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));

        if (!isAdmin && !claim.getClaimant().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to view this claim.");
        }

        return mapToResponse(claim, currentUserId, isAdmin);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponse> getClaimsForFoundItem(Long foundItemId, Long currentUserId, boolean isAdmin) {
        ItemReport foundItem = itemReportRepository.findById(foundItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + foundItemId));

        if (!isAdmin && !foundItem.getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to view claims for this item.");
        }

        return claimRepository.findByFoundItemIdOrderByCreatedAtDesc(foundItemId)
                .stream()
                .map(c -> mapToResponse(c, currentUserId, isAdmin))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClaimResponse updateClaimStatus(Long claimId, Long adminId, ClaimStatusUpdateRequest request) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with id: " + adminId));

        ClaimStatus newStatus;
        try {
            newStatus = ClaimStatus.valueOf(request.getStatus().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid claim status: " + request.getStatus());
        }

        claim.setStatus(newStatus);
        claim.setAdminNotes(request.getAdminNotes() != null ? request.getAdminNotes().trim() : null);
        claim.setVerifiedBy(admin);

        Claim updated = claimRepository.save(claim);
        ItemReport foundItem = claim.getFoundItem();

        if (newStatus == ClaimStatus.APPROVED) {
            foundItem.setStatus(ItemStatus.APPROVED);
            itemReportRepository.save(foundItem);
        } else if (newStatus == ClaimStatus.REJECTED) {
            List<Claim> otherClaims = claimRepository.findByFoundItemIdOrderByCreatedAtDesc(foundItem.getId());
            boolean hasOtherPending = otherClaims.stream().anyMatch(c -> c.getStatus() == ClaimStatus.PENDING && !c.getId().equals(claim.getId()));
            if (!hasOtherPending && foundItem.getStatus() == ItemStatus.CLAIM_REQUESTED) {
                foundItem.setStatus(ItemStatus.OPEN);
                itemReportRepository.save(foundItem);
            }
        }

        String notifTitle = "Claim " + (newStatus == ClaimStatus.APPROVED ? "Approved!" : "Update");
        String notifMsg = "Your claim for '" + foundItem.getItemName() + "' was marked as " + newStatus + ". "
                + (request.getAdminNotes() != null ? "Note: " + request.getAdminNotes() : "");

        notificationService.createNotification(
                claim.getClaimant(),
                notifTitle,
                notifMsg,
                "CLAIM_STATUS",
                foundItem.getId()
        );

        emailService.sendClaimStatusUpdate(
                claim.getClaimant().getEmail(),
                claim.getClaimant().getFullName(),
                foundItem.getItemName(),
                newStatus.name(),
                request.getAdminNotes()
        );

        return mapToResponse(updated, adminId, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponse> getAllPendingClaims() {
        return claimRepository.findByStatusOrderByCreatedAtDesc(ClaimStatus.PENDING)
                .stream()
                .map(c -> mapToResponse(c, null, true))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponse> getAllClaims() {
        return claimRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(c -> mapToResponse(c, null, true))
                .collect(Collectors.toList());
    }

    private ClaimResponse mapToResponse(Claim c, Long currentUserId, boolean isAdmin) {
        boolean isClaimant = currentUserId != null && c.getClaimant().getId().equals(currentUserId);
        boolean canViewPrivateProof = isClaimant || isAdmin;

        String itemImage = (c.getFoundItem().getImages() != null && !c.getFoundItem().getImages().isEmpty())
                ? c.getFoundItem().getImages().get(0).getImageUrl() : null;

        ReturnRecordResponse returnRecordDto = null;
        if (c.getReturnRecord() != null) {
            ReturnRecord r = c.getReturnRecord();
            returnRecordDto = ReturnRecordResponse.builder()
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

        return ClaimResponse.builder()
                .id(c.getId())
                .foundItemId(c.getFoundItem().getId())
                .foundItemName(c.getFoundItem().getItemName())
                .foundItemCategory(c.getFoundItem().getCategory())
                .foundItemLocation(c.getFoundItem().getLocation())
                .foundItemHeldAt(c.getFoundItem().getItemHeldAt())
                .foundItemImageUrl(itemImage)
                .claimantId(c.getClaimant().getId())
                .claimantFullName(c.getClaimant().getFullName())
                .claimantEmail(canViewPrivateProof ? c.getClaimant().getEmail() : null)
                .claimantPhone(canViewPrivateProof ? c.getClaimant().getPhoneNumber() : null)
                .claimantCollegeId(canViewPrivateProof ? c.getClaimant().getCollegeId() : null)
                .claimDescription(c.getClaimDescription())
                .privateOwnershipProof(canViewPrivateProof ? c.getPrivateOwnershipProof() : "[REDACTED FOR SECURITY]")
                .status(c.getStatus().name())
                .adminNotes(c.getAdminNotes())
                .verifiedByName(c.getVerifiedBy() != null ? c.getVerifiedBy().getFullName() : null)
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .returnRecord(returnRecordDto)
                .build();
    }
}
