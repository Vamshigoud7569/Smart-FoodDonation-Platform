package com.foodshare.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DonationExpiryScheduler {

    private final DonationService donationService;

    // Runs every 60 seconds
    @Scheduled(fixedRate = 20_000)
    public void expireOldDonations() {
        donationService.expireOldDonations();
    }
}
