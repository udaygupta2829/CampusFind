package com.campusfind.service.impl;

import com.campusfind.dto.response.MatchSuggestionResponse;
import com.campusfind.entity.*;
import com.campusfind.exception.BadRequestException;
import com.campusfind.exception.ResourceNotFoundException;
import com.campusfind.exception.UnauthorizedException;
import com.campusfind.repository.ItemReportRepository;
import com.campusfind.repository.MatchSuggestionRepository;
import com.campusfind.service.EmailService;
import com.campusfind.service.MatchingService;
import com.campusfind.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingServiceImpl implements MatchingService {

    private static final Logger log = LoggerFactory.getLogger(MatchingServiceImpl.class);

    private final MatchSuggestionRepository matchSuggestionRepository;
    private final ItemReportRepository itemReportRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public MatchingServiceImpl(MatchSuggestionRepository matchSuggestionRepository, ItemReportRepository itemReportRepository, NotificationService notificationService, EmailService emailService) {
        this.matchSuggestionRepository = matchSuggestionRepository;
        this.itemReportRepository = itemReportRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public void evaluateAndSaveMatchesFor(ItemReport newItem) {
        if (newItem.getStatus() == ItemStatus.RETURNED || newItem.getStatus() == ItemStatus.CLOSED) {
            return;
        }

        ItemType oppositeType = (newItem.getType() == ItemType.LOST) ? ItemType.FOUND : ItemType.LOST;
        List<ItemReport> candidates = itemReportRepository.findByTypeOrderByCreatedAtDesc(oppositeType);

        for (ItemReport candidate : candidates) {
            if (candidate.getStatus() == ItemStatus.RETURNED || candidate.getStatus() == ItemStatus.CLOSED) {
                continue;
            }

            ItemReport lostItem = (newItem.getType() == ItemType.LOST) ? newItem : candidate;
            ItemReport foundItem = (newItem.getType() == ItemType.FOUND) ? newItem : candidate;

            Optional<MatchSuggestion> existingOpt = matchSuggestionRepository
                    .findByLostItemIdAndFoundItemId(lostItem.getId(), foundItem.getId());

            double score = calculateMatchScore(lostItem, foundItem);
            String reason = buildMatchReason(lostItem, foundItem, score);

            if (score >= 40.0) {
                MatchSuggestion match;
                if (existingOpt.isPresent()) {
                    match = existingOpt.get();
                    match.setMatchScore(score);
                    match.setMatchReason(reason);
                } else {
                    match = MatchSuggestion.builder()
                            .lostItem(lostItem)
                            .foundItem(foundItem)
                            .matchScore(Math.round(score * 10.0) / 10.0)
                            .matchReason(reason)
                            .status(MatchStatus.SUGGESTED)
                            .build();

                    notificationService.createNotification(
                            lostItem.getUser(),
                            "Possible Match Found (" + Math.round(score) + "% match)",
                            "A found report for '" + foundItem.getItemName() + "' matches your lost '" + lostItem.getItemName() + "'.",
                            "MATCH_FOUND",
                            foundItem.getId()
                    );

                    emailService.sendPossibleMatchNotification(
                            lostItem.getUser().getEmail(),
                            lostItem.getUser().getFullName(),
                            lostItem.getItemName(),
                            foundItem.getItemName()
                    );
                }
                matchSuggestionRepository.save(match);

                if (lostItem.getStatus() == ItemStatus.OPEN && score >= 60.0) {
                    lostItem.setStatus(ItemStatus.POSSIBLE_MATCH);
                    itemReportRepository.save(lostItem);
                }
                if (foundItem.getStatus() == ItemStatus.OPEN && score >= 60.0) {
                    foundItem.setStatus(ItemStatus.POSSIBLE_MATCH);
                    itemReportRepository.save(foundItem);
                }
            }
        }
    }

    private double calculateMatchScore(ItemReport lost, ItemReport found) {
        double score = 0.0;

        if (lost.getCategory() != null && found.getCategory() != null
                && lost.getCategory().trim().equalsIgnoreCase(found.getCategory().trim())) {
            score += 35.0;
        }

        Set<String> lostWords = extractKeywords(lost.getItemName());
        Set<String> foundWords = extractKeywords(found.getItemName());
        if (!lostWords.isEmpty() && !foundWords.isEmpty()) {
            Set<String> intersection = new HashSet<>(lostWords);
            intersection.retainAll(foundWords);
            double jaccard = (double) intersection.size() / Math.max(lostWords.size(), foundWords.size());
            score += Math.min(25.0, jaccard * 25.0 + (intersection.size() >= 1 ? 10.0 : 0.0));
        }

        if (lost.getColour() != null && found.getColour() != null) {
            String c1 = lost.getColour().trim().toLowerCase();
            String c2 = found.getColour().trim().toLowerCase();
            if (c1.equals(c2) || c1.contains(c2) || c2.contains(c1)) {
                score += 15.0;
            }
        }

        if (lost.getLocation() != null && found.getLocation() != null) {
            String l1 = lost.getLocation().trim().toLowerCase();
            String l2 = found.getLocation().trim().toLowerCase();
            if (l1.equals(l2) || l1.contains(l2) || l2.contains(l1)) {
                score += 15.0;
            }
        }

        if (lost.getEventDate() != null && found.getEventDate() != null) {
            long daysDiff = ChronoUnit.DAYS.between(lost.getEventDate(), found.getEventDate());
            if (daysDiff >= 0 && daysDiff <= 14) {
                score += 10.0;
            } else if (daysDiff >= -2 && daysDiff <= 21) {
                score += 5.0;
            }
        }

        return Math.min(100.0, score);
    }

    private Set<String> extractKeywords(String text) {
        if (text == null) return Collections.emptySet();
        String[] tokens = text.toLowerCase().replaceAll("[^a-zA-Z0-9 ]", "").split("\\s+");
        Set<String> stopWords = Set.of("the", "a", "an", "in", "on", "of", "and", "or", "for", "with", "item", "my");
        return Arrays.stream(tokens)
                .filter(t -> t.length() > 2 && !stopWords.contains(t))
                .collect(Collectors.toSet());
    }

    private String buildMatchReason(ItemReport lost, ItemReport found, double score) {
        List<String> reasons = new ArrayList<>();
        if (lost.getCategory().equalsIgnoreCase(found.getCategory())) {
            reasons.add("Exact Category Match (" + lost.getCategory() + ")");
        }
        if (lost.getColour() != null && found.getColour() != null &&
                (lost.getColour().equalsIgnoreCase(found.getColour()) || lost.getColour().toLowerCase().contains(found.getColour().toLowerCase()))) {
            reasons.add("Matching Colour (" + lost.getColour() + ")");
        }
        if (lost.getLocation() != null && found.getLocation() != null &&
                (lost.getLocation().equalsIgnoreCase(found.getLocation()) || lost.getLocation().toLowerCase().contains(found.getLocation().toLowerCase()))) {
            reasons.add("Close/Matching Location (" + lost.getLocation() + ")");
        }
        if (lost.getEventDate() != null && found.getEventDate() != null) {
            long diff = Math.abs(ChronoUnit.DAYS.between(lost.getEventDate(), found.getEventDate()));
            if (diff <= 3) {
                reasons.add("Event dates occurred within " + diff + " day(s)");
            }
        }
        return reasons.isEmpty() ? "Keyword & contextual overlap (" + Math.round(score) + "% match score)" : String.join(", ", reasons);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchSuggestionResponse> getMatchesForLostItem(Long lostItemId, Long currentUserId, boolean isAdmin) {
        ItemReport item = itemReportRepository.findById(lostItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + lostItemId));

        if (!isAdmin && !item.getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to view matches for this item.");
        }

        return matchSuggestionRepository.findByLostItemIdOrderByMatchScoreDesc(lostItemId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchSuggestionResponse> getMatchesForFoundItem(Long foundItemId, Long currentUserId, boolean isAdmin) {
        ItemReport item = itemReportRepository.findById(foundItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + foundItemId));

        if (!isAdmin && !item.getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to view matches for this item.");
        }

        return matchSuggestionRepository.findByFoundItemIdOrderByMatchScoreDesc(foundItemId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchSuggestionResponse> getAllMatchesForUser(Long userId) {
        List<ItemReport> userReports = itemReportRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<MatchSuggestion> allMatches = new ArrayList<>();

        for (ItemReport report : userReports) {
            if (report.getType() == ItemType.LOST) {
                allMatches.addAll(matchSuggestionRepository.findByLostItemIdOrderByMatchScoreDesc(report.getId()));
            } else {
                allMatches.addAll(matchSuggestionRepository.findByFoundItemIdOrderByMatchScoreDesc(report.getId()));
            }
        }

        return allMatches.stream()
                .distinct()
                .sorted(Comparator.comparing(MatchSuggestion::getMatchScore).reversed())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchSuggestionResponse> getAllMatchesForAdmin() {
        return matchSuggestionRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(MatchSuggestion::getMatchScore).reversed())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MatchSuggestionResponse updateMatchStatus(Long matchId, String statusStr) {
        MatchSuggestion match = matchSuggestionRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match suggestion not found with id: " + matchId));

        try {
            MatchStatus status = MatchStatus.valueOf(statusStr.toUpperCase());
            match.setStatus(status);
            matchSuggestionRepository.save(match);
            return mapToResponse(match);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid match status: " + statusStr);
        }
    }

    private MatchSuggestionResponse mapToResponse(MatchSuggestion m) {
        String lostImage = m.getLostItem().getImages().isEmpty() ? null : m.getLostItem().getImages().get(0).getImageUrl();
        String foundImage = m.getFoundItem().getImages().isEmpty() ? null : m.getFoundItem().getImages().get(0).getImageUrl();

        return MatchSuggestionResponse.builder()
                .id(m.getId())
                .lostItemId(m.getLostItem().getId())
                .lostItemName(m.getLostItem().getItemName())
                .lostItemCategory(m.getLostItem().getCategory())
                .lostItemLocation(m.getLostItem().getLocation())
                .lostItemImageUrl(lostImage)
                .lostItemOwnerName(m.getLostItem().getUser().getFullName())
                .foundItemId(m.getFoundItem().getId())
                .foundItemName(m.getFoundItem().getItemName())
                .foundItemCategory(m.getFoundItem().getCategory())
                .foundItemLocation(m.getFoundItem().getLocation())
                .foundItemImageUrl(foundImage)
                .foundItemHeldAt(m.getFoundItem().getItemHeldAt())
                .matchScore(m.getMatchScore())
                .matchReason(m.getMatchReason())
                .status(m.getStatus().name())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
