package com.foodshare.backend.controller;

import com.foodshare.backend.dto.IncomingRequestDto;
import com.foodshare.backend.service.DonorRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/FoodDonation/donor")
@RequiredArgsConstructor
public class DonorRequestController {

    private final DonorRequestService donorRequestService;

    @GetMapping("/requests")
    public ResponseEntity<List<IncomingRequestDto>> getIncomingRequests() {
        return ResponseEntity.ok(donorRequestService.getIncomingRequests());
    }

    @PatchMapping("/requests/{id}/approve")
    public ResponseEntity<IncomingRequestDto> approveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(donorRequestService.approveRequest(id));
    }

    @PatchMapping("/requests/{id}/reject")
    public ResponseEntity<IncomingRequestDto> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(donorRequestService.rejectRequest(id));
    }
}
