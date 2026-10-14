package com.campusfind.service;

import com.campusfind.dto.request.ProfileUpdateRequest;
import com.campusfind.dto.response.UserProfileResponse;

public interface UserService {
    UserProfileResponse getCurrentUserProfile(Long userId);
    UserProfileResponse updateProfile(Long userId, ProfileUpdateRequest request);
}
