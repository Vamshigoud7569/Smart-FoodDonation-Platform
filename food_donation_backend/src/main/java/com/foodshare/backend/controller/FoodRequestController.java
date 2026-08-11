package com.foodshare.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodshare.backend.dto.FoodDonationRequest;
import com.foodshare.backend.service.FoodDonationRequestService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
@RestController
@RequestMapping("/FoodDonation")
@RequiredArgsConstructor
public class FoodRequestController {

    private final FoodDonationRequestService foodRequestService;

    @PostMapping("/requestdonation")
    public  ResponseEntity<?> postfooddonation(@RequestBody FoodDonationRequest request,@RequestHeader("Authorization") String authHeader) {
        authHeader = authHeader.replace("Bearer ", "");
        return ResponseEntity.ok(foodRequestService.requestDonation(request,authHeader));
    }

}
