package com.campusfind.service;

import com.campusfind.dto.request.ReturnRecordRequest;
import com.campusfind.dto.response.AdminDashboardResponse;
import com.campusfind.dto.response.ReturnRecordResponse;

import java.util.List;

public interface AdminService {
    AdminDashboardResponse getDashboardStats();
    ReturnRecordResponse createReturnRecord(Long adminId, ReturnRecordRequest request);
    List<ReturnRecordResponse> getAllReturnRecords();
}
