package com.foodshare.backend.service;
import com.foodshare.backend.dto.*;
import com.foodshare.backend.entity.Donation;
import com.foodshare.backend.entity.DonationStatus;
import com.foodshare.backend.entity.FoodRequest;
import com.foodshare.backend.entity.RequestStatus;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.repository.DonationRepository;
import com.foodshare.backend.repository.RequestRepository;
import com.foodshare.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FoodDonationRequestService {
    private final DonationRepository donationRepository;
    private final RequestRepository requestRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Transactional
    public String requestDonation(FoodDonationRequest request,String authHeader) {
        String email = jwtService.extractEmail(authHeader);
        User user = userRepository.findByEmail(email).orElseThrow();
        Long donationId = request.getDonationId();
        Donation donation = donationRepository.findByIdForUpdate(donationId).orElseThrow();

        if (donation.getStatus() != DonationStatus.ACTIVE) {
            throw new RuntimeException("Donation is not available for requests");
        }

        boolean alreadyRequested = requestRepository.findByUserId(user.getId())
                .stream()
                .anyMatch(r -> r.getDonation().getId().equals(donationId));
        if (alreadyRequested) {
            throw new RuntimeException("You have already requested this donation");
        }

        // Mark donation as PROCESSING so others can't request it simultaneously
        donation.setStatus(DonationStatus.PROCESSING);

        FoodRequest foodRequest = FoodRequest.builder()
            .approvedAt(null)
            .donation(donation)
            .requestedAt(LocalDateTime.now())
            .status(RequestStatus.PENDING)
            .user(user)
            .build();

        requestRepository.save(foodRequest);
        return "Request sent! Waiting for donor approval.";
    }


}
