package com.foodshare.backend.controller;

import com.foodshare.backend.dto.ActiveDonationResponse;
import com.foodshare.backend.dto.DonationRequest;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.repository.UserRepository;
import com.foodshare.backend.service.DonationService;
import com.foodshare.backend.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/FoodDonation")
@RequiredArgsConstructor
public class DonationController {

    private  final DonationService donationService;
    private  final JwtService jwtService;
    private  final UserRepository userRepository;

    @PostMapping("/postdonation")
    public ResponseEntity<ActiveDonationResponse> postDonation(
            @Valid @RequestBody DonationRequest request,
            @RequestHeader("Authorization") String authHeader) {

        User donor = extractUser(authHeader);
        return ResponseEntity.ok(donationService.postDonation(request, donor));
    }

    @GetMapping("/activedonations")
    public ResponseEntity<List<ActiveDonationResponse>> getActiveDonations() {
        return ResponseEntity.ok(donationService.getActiveDonations());
    }

    @GetMapping("/mydonations")
    public ResponseEntity<List<ActiveDonationResponse>> getMyDonations(
            @RequestHeader("Authorization") String authHeader) {

        User user = extractUser(authHeader);
        return ResponseEntity.ok(donationService.getMyDonations(user.getId()));
    }

    



    // DRY — extract user from JWT in one place
    private User extractUser(String authHeader) {
        String email = jwtService.extractEmail(authHeader.substring(7));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
