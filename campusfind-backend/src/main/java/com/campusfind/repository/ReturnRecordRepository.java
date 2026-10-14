package com.campusfind.repository;

import com.campusfind.entity.ReturnRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReturnRecordRepository extends JpaRepository<ReturnRecord, Long> {
    Optional<ReturnRecord> findByClaimId(Long claimId);
    List<ReturnRecord> findByReceivedByIdOrderByReturnDateDesc(Long userId);
    List<ReturnRecord> findByReturnedByIdOrderByReturnDateDesc(Long adminId);
    List<ReturnRecord> findAllByOrderByReturnDateDesc();
}
