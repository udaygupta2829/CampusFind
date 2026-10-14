package com.campusfind.service;

public interface EmailService {
    void sendClaimStatusUpdate(String toEmail, String studentName, String itemName, String status, String notes);
    void sendPossibleMatchNotification(String toEmail, String studentName, String lostItemName, String foundItemName);
    void sendItemReturnConfirmation(String toEmail, String studentName, String itemName, String location);
}
