package com.campusfind.service;

import com.campusfind.dto.response.NotificationResponse;
import com.campusfind.entity.User;

import java.util.List;

public interface NotificationService {
    void createNotification(User user, String title, String message, String type, Long relatedItemId);
    List<NotificationResponse> getUserNotifications(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
    long getUnreadCount(Long userId);
}
