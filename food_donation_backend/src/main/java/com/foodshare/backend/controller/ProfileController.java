package com.foodshare.backend.controller;

import com.foodshare.backend.service.RecipientProfileService;
import org.springframework.web.bind.annotation.RestController;
import com.foodshare.backend.dto.DashboardResponse;
import com.foodshare.backend.dto.ProfileResponse;
import com.foodshare.backend.dto.RecipientDashboardDto;
import com.foodshare.backend.dto.RecipientProfileDto;
import com.foodshare.backend.service.ProfileDashboardService;
import com.foodshare.backend.service.RecipientDashboardService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
@RestController
@RequiredArgsConstructor
@RequestMapping("/FoodDonation")
public class ProfileController {
    
    private  final ProfileDashboardService profileService;
    private final RecipientProfileService recipientProfileService;
    private final RecipientDashboardService recipientDashboardService;
    @GetMapping("/profiledonor")
    public ResponseEntity<DashboardResponse> getDashboardDetails()
    {
       return ResponseEntity.ok(profileService.getDashboardDetails());
    }

    @GetMapping("/profilerecipient")
    public ResponseEntity<RecipientProfileDto> getDashboardDetailsOfRecipient()
    {
        return ResponseEntity.ok(recipientProfileService.getProfileDetailsOfRecipient());
    }

    @GetMapping("/recipientDashboard")
    public ResponseEntity<RecipientDashboardDto> getRecipientDashboardDetails()
    {
       return ResponseEntity.ok(recipientDashboardService.getRecipientDashboardDetails());
    }

}
