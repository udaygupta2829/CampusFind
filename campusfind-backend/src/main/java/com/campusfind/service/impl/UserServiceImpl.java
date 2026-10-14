package com.campusfind.service.impl;

import com.campusfind.dto.request.ProfileUpdateRequest;
import com.campusfind.dto.response.UserProfileResponse;
import com.campusfind.entity.ItemReport;
import com.campusfind.entity.ItemType;
import com.campusfind.entity.User;
import com.campusfind.exception.ResourceNotFoundException;
import com.campusfind.repository.ClaimRepository;
import com.campusfind.repository.ItemReportRepository;
import com.campusfind.repository.UserRepository;
import com.campusfind.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ItemReportRepository itemReportRepository;
    private final ClaimRepository claimRepository;

    public UserServiceImpl(UserRepository userRepository, ItemReportRepository itemReportRepository, ClaimRepository claimRepository) {
        this.userRepository = userRepository;
        this.itemReportRepository = itemReportRepository;
        this.claimRepository = claimRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<ItemReport> userReports = itemReportRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long lostCount = userReports.stream().filter(r -> r.getType() == ItemType.LOST).count();
        long foundCount = userReports.stream().filter(r -> r.getType() == ItemType.FOUND).count();
        long claimCount = claimRepository.findByClaimantIdOrderByCreatedAtDesc(userId).size();

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .collegeId(user.getCollegeId())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .totalLostReports(lostCount)
                .totalFoundReports(foundCount)
                .totalClaims(claimCount)
                .build();
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
        user.setCollegeId(request.getCollegeId() != null ? request.getCollegeId().trim() : null);

        userRepository.save(user);

        return getCurrentUserProfile(userId);
    }
}
