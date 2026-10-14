package com.campusfind.service;

import com.campusfind.dto.request.ItemReportRequest;
import com.campusfind.dto.response.ItemReportResponse;
import com.campusfind.entity.ItemStatus;
import com.campusfind.entity.ItemType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ItemReportService {
    ItemReportResponse createReport(Long userId, ItemReportRequest request);
    ItemReportResponse updateReport(Long reportId, Long userId, boolean isAdmin, ItemReportRequest request);
    void deleteReport(Long reportId, Long userId, boolean isAdmin);
    ItemReportResponse getReportById(Long reportId, Long currentUserId, boolean isAdmin);
    Page<ItemReportResponse> searchReports(ItemType type, String category, String colour, String location,
                                          ItemStatus status, LocalDate fromDate, LocalDate toDate,
                                          String keyword, Pageable pageable, Long currentUserId, boolean isAdmin);
    List<ItemReportResponse> getUserReports(Long userId);
    ItemReportResponse addImageToReport(Long reportId, Long userId, boolean isAdmin, String imageUrl, String fileName);
    ItemReportResponse updateReportStatus(Long reportId, String status, Long userId, boolean isAdmin);
    List<ItemReportResponse> getAllReports(ItemType type);
}
