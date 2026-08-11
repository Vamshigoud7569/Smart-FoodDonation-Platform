package com.foodshare.backend.service;

import com.foodshare.backend.dto.IncomingRequestDto;
import com.foodshare.backend.entity.DonationStatus;
import com.foodshare.backend.entity.FoodRequest;
import com.foodshare.backend.entity.RequestStatus;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.repository.DonationRepository;
import com.foodshare.backend.repository.RequestRepository;
import com.foodshare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonorRequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    public List<IncomingRequestDto> getIncomingRequests() {
        User donor = getAuthenticatedUser();
        return requestRepository.findByDonorId(donor.getId())
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public IncomingRequestDto approveRequest(Long requestId) {
        FoodRequest request = getRequestOwnedByDonor(requestId);
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be approved");
        }
        request.setStatus(RequestStatus.ACCEPTED);
        request.setApprovedAt(LocalDateTime.now());
        return toDto(requestRepository.save(request));
    }

    @Transactional
    public IncomingRequestDto rejectRequest(Long requestId) {
        FoodRequest request = getRequestOwnedByDonor(requestId);
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be rejected");
        }
        request.setStatus(RequestStatus.REJECTED);
        request.getDonation().setStatus(DonationStatus.ACTIVE);
        donationRepository.save(request.getDonation());
        return toDto(requestRepository.save(request));
    }

    private FoodRequest getRequestOwnedByDonor(Long requestId) {
        User donor = getAuthenticatedUser();
        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        if (!request.getDonation().getUser().getId().equals(donor.getId())) {
            throw new RuntimeException("Not authorized");
        }
        return request;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private IncomingRequestDto toDto(FoodRequest r) {
        return IncomingRequestDto.builder()
                .requestId(r.getId())
                .donationId(r.getDonation().getId())
                .foodDescription(r.getDonation().getFoodDescription())
                .foodQuantity(r.getDonation().getFoodQuantity())
                .pickupAddress(r.getDonation().getPickupAddress())
                .recipientName(r.getUser().getName())
                .recipientPhone(r.getUser().getPhone())
                .status(r.getStatus())
                .requestedAt(r.getRequestedAt())
                .volunteerName(r.getVolunteerName())
                .build();
    }
}
