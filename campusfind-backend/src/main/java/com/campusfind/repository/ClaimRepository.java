package com.campusfind.repository;

import com.campusfind.entity.Claim;
import com.campusfind.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByClaimantIdOrderByCreatedAtDesc(Long claimantId);
    List<Claim> findByFoundItemIdOrderByCreatedAtDesc(Long foundItemId);
    List<Claim> findByStatusOrderByCreatedAtDesc(ClaimStatus status);
    long countByStatus(ClaimStatus status);
    boolean existsByFoundItemIdAndClaimantId(Long foundItemId, Long claimantId);
}
