package com.foodshare.backend.service;

import com.foodshare.backend.dto.ActiveDonationResponse;
import com.foodshare.backend.dto.DonationRequest;
import com.foodshare.backend.entity.Donation;
import com.foodshare.backend.entity.DonationStatus;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private static final int EXPIRY_HOURS = 6;

    private final DonationRepository donationRepository;

    public ActiveDonationResponse postDonation(DonationRequest request, User donor) {
        LocalDateTime now = LocalDateTime.now();
        Donation donation = Donation.builder()
                .foodDescription(request.getFoodDescription())
                .foodType(request.getFoodType())
                .foodQuantity(request.getFoodQuantity())
                .pickupAddress(request.getPickupAddress())
                .status(DonationStatus.ACTIVE)
                .expiresAt(now.plusHours(EXPIRY_HOURS))
                .user(donor)
                .build();

        donationRepository.save(donation);
        return toResponse(donation);
    }

   
    // getting donations that are active
    public List<ActiveDonationResponse> getActiveDonations() {
        List<Donation> donation = donationRepository.findByStatus(DonationStatus.ACTIVE);
         List<ActiveDonationResponse> donations = new ArrayList<>();
         for(Donation don : donation)
         {
            donations.add(toResponse(don));
         }
        return donations;
            
    }



    public List<ActiveDonationResponse> getMyDonations(Long userId) {
        List<Donation> donation = donationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<ActiveDonationResponse> donations = new ArrayList<>();
        for(Donation don : donation)
        {
            donations.add(toResponse(don));
        }
        return donations;  
    }

    // Called by scheduler every minute
    public void expireOldDonations() {
        List<Donation> expired = donationRepository
                .findByStatusAndExpiresAtBefore(DonationStatus.ACTIVE, LocalDateTime.now());
        expired.forEach(d -> d.setStatus(DonationStatus.EXPIRED));
        donationRepository.saveAll(expired);
    }

    // Single mapping method — DRY
    private ActiveDonationResponse toResponse(Donation d) {
        long minutesLeft = ChronoUnit.MINUTES.between(LocalDateTime.now(), d.getExpiresAt());
        return ActiveDonationResponse.builder()
                .id(d.getId())
                .foodDescription(d.getFoodDescription())
                .foodType(d.getFoodType())
                .foodQuantity(d.getFoodQuantity())
                .pickupAddress(d.getPickupAddress())
                .status(d.getStatus().name())
                .donorName(d.getUser().getName())
                .donorContact(d.getUser().getPhone())
                .donorCity(d.getUser().getCity())
                .donorState(d.getUser().getState())
                .createdAt(d.getCreatedAt())
                .expiresAt(d.getExpiresAt())
                .minutesRemaining(Math.max(minutesLeft, 0))
                .build();
    }
}
