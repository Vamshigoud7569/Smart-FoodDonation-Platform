package com.foodshare.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ActiveDonationResponse {

    private Long id;
    private String foodDescription;
    private String foodType;
    private String foodQuantity;
    private String pickupAddress;
    private String status;

    // Donor info from User entity — not stored in Donation
    private String donorName;
    private String donorContact;
    private String donorCity;
    private String donorState;

    // Time info
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private long minutesRemaining;   // how many minutes left before expiry
}
