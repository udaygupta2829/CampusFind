package com.campusfind.service;

import com.campusfind.dto.response.MatchSuggestionResponse;
import com.campusfind.entity.ItemReport;

import java.util.List;

public interface MatchingService {
    void evaluateAndSaveMatchesFor(ItemReport itemReport);
    List<MatchSuggestionResponse> getMatchesForLostItem(Long lostItemId, Long currentUserId, boolean isAdmin);
    List<MatchSuggestionResponse> getMatchesForFoundItem(Long foundItemId, Long currentUserId, boolean isAdmin);
    List<MatchSuggestionResponse> getAllMatchesForUser(Long userId);
    List<MatchSuggestionResponse> getAllMatchesForAdmin();
    MatchSuggestionResponse updateMatchStatus(Long matchId, String status);
}
