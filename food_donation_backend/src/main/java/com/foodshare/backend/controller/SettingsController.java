package com.foodshare.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.foodshare.backend.dto.PasswordRequest;
import com.foodshare.backend.service.PasswordService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.repository.query.Param;

@RequestMapping("/FoodDonation")
@RequiredArgsConstructor
@RestController
public class SettingsController {
    private final PasswordService passwordService;
    @PostMapping("/updatepassword")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordRequest request,@RequestHeader("Authorization") String authentication)
    {
        return ResponseEntity.ok(passwordService.updatePassword(request, authentication));
    }
}
