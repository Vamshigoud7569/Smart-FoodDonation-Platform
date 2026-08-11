package com.foodshare.backend.service;

import com.foodshare.backend.dto.DonationRequestDto;
import com.foodshare.backend.dto.FoodRequestDto;
import com.foodshare.backend.dto.RecipientDashboardDto;
import com.foodshare.backend.entity.Donation;
import com.foodshare.backend.entity.FoodRequest;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.repository.DonationRepository;
import com.foodshare.backend.repository.RequestRepository;
import com.foodshare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipientDashboardService {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final RequestRepository requestRepository; 
    // Assuming you have a RequestRepository for fetching requests

    public RecipientDashboardDto getRecipientDashboardDetails() {
        // get the recipient details from the database
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        
        // get all donations near to his location
        List<Donation> donations = donationRepository.findAvailableDonationsByLocation(user.getCity());
        List<DonationRequestDto> donationRequestDtos = donations.stream()
                .map(donation -> DonationRequestDto.builder()
                        .id(donation.getId())
                        .name(donation.getUser().getName())
                        .foodQuantity(donation.getFoodQuantity())
                        .foodDescription(donation.getFoodDescription())
                        .pickupAddress(donation.getPickupAddress())
                        .status(donation.getStatus())
                        .foodType(donation.getFoodType())
                        .createdAt(donation.getCreatedAt()) 
                        .expiresAt(donation.getExpiresAt())
                        .build())
                .toList();

         // get all his requests and their status
        List<FoodRequest> requests = requestRepository.findByUserId(user.getId());

        List<FoodRequestDto> foodRequestDtos = requests.stream()
                .map(request -> FoodRequestDto.builder()
                        .id(request.getId())
                        .user_id(request.getUser().getId())
                        .donation_id(request.getDonation().getId())
                        .foodDescription(request.getDonation().getFoodDescription())
                        .foodType(request.getDonation().getFoodType())
                        .foodQuantity(request.getDonation().getFoodQuantity())
                        .pickupAddress(request.getDonation().getPickupAddress())
                        .donorName(request.getDonation().getUser().getName())
                        .volunteerName(request.getVolunteerName())
                        .status(request.getStatus())
                        .requestedAt(request.getRequestedAt() == null ? null : request.getRequestedAt())
                        .approvedAt(request.getApprovedAt() == null ? null : request.getApprovedAt())
                        .build())
                .toList();

       
        


        return RecipientDashboardDto.builder()
                .donations(donationRequestDtos)
                .requests(foodRequestDtos)
                .build();
    }
    
}
