package com.campusfind.repository;

import com.campusfind.entity.MatchStatus;
import com.campusfind.entity.MatchSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchSuggestionRepository extends JpaRepository<MatchSuggestion, Long> {
    List<MatchSuggestion> findByLostItemIdOrderByMatchScoreDesc(Long lostItemId);
    List<MatchSuggestion> findByFoundItemIdOrderByMatchScoreDesc(Long foundItemId);
    List<MatchSuggestion> findByStatusOrderByMatchScoreDesc(MatchStatus status);
    Optional<MatchSuggestion> findByLostItemIdAndFoundItemId(Long lostItemId, Long foundItemId);
    void deleteByLostItemIdOrFoundItemId(Long lostItemId, Long foundItemId);
}
