package com.campusfind.repository;

import com.campusfind.entity.ItemReport;
import com.campusfind.entity.ItemStatus;
import com.campusfind.entity.ItemType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface ItemReportRepository extends JpaRepository<ItemReport, Long> {

    List<ItemReport> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<ItemReport> findByTypeOrderByCreatedAtDesc(ItemType type);

    List<ItemReport> findByTypeAndStatus(ItemType type, ItemStatus status);

    @Query("SELECT r FROM ItemReport r WHERE " +
            "(:type IS NULL OR r.type = :type) AND " +
            "(:category IS NULL OR LOWER(r.category) = LOWER(:category)) AND " +
            "(:colour IS NULL OR LOWER(r.colour) LIKE LOWER(CONCAT('%', :colour, '%'))) AND " +
            "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:status IS NULL OR r.status = :status) AND " +
            "(:fromDate IS NULL OR r.eventDate >= :fromDate) AND " +
            "(:toDate IS NULL OR r.eventDate <= :toDate) AND " +
            "(:keyword IS NULL OR (LOWER(r.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')))) " +
            "ORDER BY r.createdAt DESC")
    Page<ItemReport> searchReports(
            @Param("type") ItemType type,
            @Param("category") String category,
            @Param("colour") String colour,
            @Param("location") String location,
            @Param("status") ItemStatus status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByType(ItemType type);

    long countByStatus(ItemStatus status);

    long countByTypeAndStatus(ItemType type, ItemStatus status);

    @Query("SELECT r.category AS category, COUNT(r) AS count FROM ItemReport r GROUP BY r.category ORDER BY count DESC")
    List<Map<String, Object>> findCategoryBreakdown();

    @Query("SELECT r.location AS location, COUNT(r) AS count FROM ItemReport r WHERE r.type = 'LOST' GROUP BY r.location ORDER BY count DESC")
    List<Map<String, Object>> findCommonLostLocations();
}
