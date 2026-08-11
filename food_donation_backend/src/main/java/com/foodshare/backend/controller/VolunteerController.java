package com.foodshare.backend.controller;

import com.foodshare.backend.dto.*;
import com.foodshare.backend.entity.DeliveryStatus;
import com.foodshare.backend.service.VolunteerProfileService;
import com.foodshare.backend.service.VolunteerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/FoodDonation/volunteer")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;
    private final VolunteerProfileService volunteerProfileService;

    @GetMapping("/dashboard")
    public ResponseEntity<VolunteerDashboardDto> getDashboard() {
        return ResponseEntity.ok(volunteerService.getDashboard());
    }

    @GetMapping("/available-pickups")
    public ResponseEntity<List<AvailablePickupDto>> getAvailablePickups() {
        return ResponseEntity.ok(volunteerService.getAvailablePickups());
    }

    @PostMapping("/claim/{requestId}")
    public ResponseEntity<VolunteerDeliveryDto> claimPickup(@PathVariable Long requestId) {
        return ResponseEntity.ok(volunteerService.claimPickup(requestId));
    }

    @PatchMapping("/delivery/{deliveryId}/status")
    public ResponseEntity<VolunteerDeliveryDto> updateStatus(
            @PathVariable Long deliveryId,
            @RequestBody Map<String, String> body) {
        DeliveryStatus status = DeliveryStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(volunteerService.updateStatus(deliveryId, status));
    }

    @GetMapping("/my-delivery")
    public ResponseEntity<VolunteerDeliveryDto> getActiveDelivery() {
        return ResponseEntity.ok(volunteerService.getActiveDelivery());
    }

    @GetMapping("/profile")
    public ResponseEntity<VolunteerProfileDto> getProfile() {
        return ResponseEntity.ok(volunteerProfileService.getProfile());
    }

    @GetMapping("/analytics")
    public ResponseEntity<VolunteerAnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(volunteerService.getAnalytics());
    }
}
