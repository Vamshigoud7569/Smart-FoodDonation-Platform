package com.foodshare.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.foodshare.backend.dto.VerificationRequest;
import com.foodshare.backend.dto.VerificationResponseDto;
import com.foodshare.backend.service.VerificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/FoodDonation")
@RequiredArgsConstructor
@Validated
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping(value = "/verification", consumes = "multipart/form-data")
    public ResponseEntity<String> submit(
            @RequestPart("data") VerificationRequest request,
            @RequestPart("govId") MultipartFile govId,
            @RequestPart(value = "selfie", required = false) MultipartFile selfie,
            @RequestHeader("Authorization") String authHeader) {

        verificationService.submitDocuments(request, govId, selfie, authHeader);
        return ResponseEntity.status(HttpStatus.CREATED).body("Uploaded successfully");
    }

    @GetMapping("/verification/me")
    public ResponseEntity<VerificationResponseDto> getMine(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(verificationService.getMine(authHeader));
    }
}
