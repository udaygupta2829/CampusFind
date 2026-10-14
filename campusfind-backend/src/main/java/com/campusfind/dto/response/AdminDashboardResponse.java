package com.campusfind.dto.response;

import java.util.List;
import java.util.Map;

public class AdminDashboardResponse {
    private long totalLostReports;
    private long totalFoundReports;
    private long openReports;
    private long pendingClaims;
    private long approvedClaims;
    private long returnedItems;
    private long totalUsers;
    private List<Map<String, Object>> popularCategories;
    private List<Map<String, Object>> commonLostLocations;
    private List<ClaimResponse> recentPendingClaims;
    private List<ItemReportResponse> recentReports;
    private List<ReturnRecordResponse> recentReturnRecords;

    public AdminDashboardResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalLostReports;
        private long totalFoundReports;
        private long openReports;
        private long pendingClaims;
        private long approvedClaims;
        private long returnedItems;
        private long totalUsers;
        private List<Map<String, Object>> popularCategories;
        private List<Map<String, Object>> commonLostLocations;
        private List<ClaimResponse> recentPendingClaims;
        private List<ItemReportResponse> recentReports;
        private List<ReturnRecordResponse> recentReturnRecords;

        public Builder totalLostReports(long totalLostReports) { this.totalLostReports = totalLostReports; return this; }
        public Builder totalFoundReports(long totalFoundReports) { this.totalFoundReports = totalFoundReports; return this; }
        public Builder openReports(long openReports) { this.openReports = openReports; return this; }
        public Builder pendingClaims(long pendingClaims) { this.pendingClaims = pendingClaims; return this; }
        public Builder approvedClaims(long approvedClaims) { this.approvedClaims = approvedClaims; return this; }
        public Builder returnedItems(long returnedItems) { this.returnedItems = returnedItems; return this; }
        public Builder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
        public Builder popularCategories(List<Map<String, Object>> popularCategories) { this.popularCategories = popularCategories; return this; }
        public Builder commonLostLocations(List<Map<String, Object>> commonLostLocations) { this.commonLostLocations = commonLostLocations; return this; }
        public Builder recentPendingClaims(List<ClaimResponse> recentPendingClaims) { this.recentPendingClaims = recentPendingClaims; return this; }
        public Builder recentReports(List<ItemReportResponse> recentReports) { this.recentReports = recentReports; return this; }
        public Builder recentReturnRecords(List<ReturnRecordResponse> recentReturnRecords) { this.recentReturnRecords = recentReturnRecords; return this; }

        public AdminDashboardResponse build() {
            AdminDashboardResponse r = new AdminDashboardResponse();
            r.setTotalLostReports(this.totalLostReports);
            r.setTotalFoundReports(this.totalFoundReports);
            r.setOpenReports(this.openReports);
            r.setPendingClaims(this.pendingClaims);
            r.setApprovedClaims(this.approvedClaims);
            r.setReturnedItems(this.returnedItems);
            r.setTotalUsers(this.totalUsers);
            r.setPopularCategories(this.popularCategories);
            r.setCommonLostLocations(this.commonLostLocations);
            r.setRecentPendingClaims(this.recentPendingClaims);
            r.setRecentReports(this.recentReports);
            r.setRecentReturnRecords(this.recentReturnRecords);
            return r;
        }
    }

    public long getTotalLostReports() { return totalLostReports; }
    public void setTotalLostReports(long totalLostReports) { this.totalLostReports = totalLostReports; }

    public long getTotalFoundReports() { return totalFoundReports; }
    public void setTotalFoundReports(long totalFoundReports) { this.totalFoundReports = totalFoundReports; }

    public long getOpenReports() { return openReports; }
    public void setOpenReports(long openReports) { this.openReports = openReports; }

    public long getPendingClaims() { return pendingClaims; }
    public void setPendingClaims(long pendingClaims) { this.pendingClaims = pendingClaims; }

    public long getApprovedClaims() { return approvedClaims; }
    public void setApprovedClaims(long approvedClaims) { this.approvedClaims = approvedClaims; }

    public long getReturnedItems() { return returnedItems; }
    public void setReturnedItems(long returnedItems) { this.returnedItems = returnedItems; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public List<Map<String, Object>> getPopularCategories() { return popularCategories; }
    public void setPopularCategories(List<Map<String, Object>> popularCategories) { this.popularCategories = popularCategories; }

    public List<Map<String, Object>> getCommonLostLocations() { return commonLostLocations; }
    public void setCommonLostLocations(List<Map<String, Object>> commonLostLocations) { this.commonLostLocations = commonLostLocations; }

    public List<ClaimResponse> getRecentPendingClaims() { return recentPendingClaims; }
    public void setRecentPendingClaims(List<ClaimResponse> recentPendingClaims) { this.recentPendingClaims = recentPendingClaims; }

    public List<ItemReportResponse> getRecentReports() { return recentReports; }
    public void setRecentReports(List<ItemReportResponse> recentReports) { this.recentReports = recentReports; }

    public List<ReturnRecordResponse> getRecentReturnRecords() { return recentReturnRecords; }
    public void setRecentReturnRecords(List<ReturnRecordResponse> recentReturnRecords) { this.recentReturnRecords = recentReturnRecords; }
}
