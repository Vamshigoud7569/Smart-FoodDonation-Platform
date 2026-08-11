package com.foodshare.backend.service;

import com.foodshare.backend.dto.*;
import com.foodshare.backend.entity.*;
import com.foodshare.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final UserRepository userRepository;
    private final RequestRepository requestRepository;
    private final VolunteerDeliveryRepository deliveryRepository;

    // Get all ACCEPTED food requests available for pickup
    public List<AvailablePickupDto> getAvailablePickups() {
        return requestRepository.findByStatus(RequestStatus.ACCEPTED)
                .stream()
                .map(r -> AvailablePickupDto.builder()
                        .requestId(r.getId())
                        .donationId(r.getDonation().getId())
                        .foodDescription(r.getDonation().getFoodDescription())
                        .foodType(r.getDonation().getFoodType())
                        .foodQuantity(r.getDonation().getFoodQuantity())
                        .pickupAddress(r.getDonation().getPickupAddress())
                        .donorName(r.getDonation().getUser().getName())
                        .recipientName(r.getUser().getName())
                        .status(r.getStatus())
                        .requestedAt(r.getRequestedAt())
                        .approvedAt(r.getApprovedAt())
                        .build())
                .toList();
    }

    // Claim a pickup — one at a time enforced
    @Transactional
    public VolunteerDeliveryDto claimPickup(Long requestId) {
        User volunteer = getAuthenticatedUser();

        deliveryRepository.findActiveByVolunteerId(volunteer.getId()).ifPresent(d -> {
            throw new RuntimeException("Complete your current delivery before claiming a new one");
        });

        FoodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.ACCEPTED) {
            throw new RuntimeException("This pickup is no longer available");
        }

        request.setStatus(RequestStatus.IN_TRANSIT);
        request.setVolunteerName(volunteer.getName());
        requestRepository.save(request);

        VolunteerDelivery delivery = VolunteerDelivery.builder()
                .volunteer(volunteer)
                .foodRequest(request)
                .status(DeliveryStatus.PICKED_UP)
                .claimedAt(LocalDateTime.now())
                .build();

        return toDto(deliveryRepository.save(delivery));
    }

    // Update delivery status
    @Transactional
    public VolunteerDeliveryDto updateStatus(Long deliveryId, DeliveryStatus newStatus) {
        User volunteer = getAuthenticatedUser();

        VolunteerDelivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        if (!delivery.getVolunteer().getId().equals(volunteer.getId())) {
            throw new RuntimeException("Not authorized");
        }

        delivery.setStatus(newStatus);
        FoodRequest request = delivery.getFoodRequest();

        switch (newStatus) {
            case IN_TRANSIT -> delivery.setTransitStartedAt(LocalDateTime.now());
            case DELIVERED -> {
                delivery.setCompletedAt(LocalDateTime.now());
                request.setStatus(RequestStatus.COMPLETED);
                request.getDonation().setStatus(DonationStatus.COMPLETED);
                requestRepository.save(request);
            }
            case CANCELLED -> {
                delivery.setCompletedAt(LocalDateTime.now());
                request.setStatus(RequestStatus.ACCEPTED); // back to queue
                request.setVolunteerName(null);
                requestRepository.save(request);
            }
            case NOT_DELIVERED -> {
                delivery.setCompletedAt(LocalDateTime.now());
                request.setStatus(RequestStatus.ACCEPTED); // back to queue
                request.setVolunteerName(null);
                requestRepository.save(request);
            }
            default -> {}
        }

        return toDto(deliveryRepository.save(delivery));
    }

    // Get volunteer's current active delivery
    public VolunteerDeliveryDto getActiveDelivery() {
        User volunteer = getAuthenticatedUser();
        return deliveryRepository.findActiveByVolunteerId(volunteer.getId())
                .map(this::toDto)
                .orElse(null);
    }

    // Full dashboard
    public VolunteerDashboardDto getDashboard() {
        User volunteer = getAuthenticatedUser();
        List<AvailablePickupDto> pickups = getAvailablePickups();
        VolunteerDeliveryDto active = deliveryRepository.findActiveByVolunteerId(volunteer.getId())
                .map(this::toDto).orElse(null);

        long delivered    = deliveryRepository.countByVolunteer_IdAndStatus(volunteer.getId(), DeliveryStatus.DELIVERED);
        long cancelled    = deliveryRepository.countByVolunteer_IdAndStatus(volunteer.getId(), DeliveryStatus.CANCELLED);
        long notDelivered = deliveryRepository.countByVolunteer_IdAndStatus(volunteer.getId(), DeliveryStatus.NOT_DELIVERED);
        long total        = deliveryRepository.findByVolunteer_Id(volunteer.getId()).size();

        return VolunteerDashboardDto.builder()
                .availablePickups(pickups)
                .activeDelivery(active)
                .totalDeliveries(total)
                .deliveredCount(delivered)
                .cancelledCount(cancelled)
                .notDeliveredCount(notDelivered)
                .build();
    }

    // Analytics
    public VolunteerAnalyticsDto getAnalytics() {
        User volunteer = getAuthenticatedUser();
        long delivered    = deliveryRepository.countByVolunteer_IdAndStatus(volunteer.getId(), DeliveryStatus.DELIVERED);
        long cancelled    = deliveryRepository.countByVolunteer_IdAndStatus(volunteer.getId(), DeliveryStatus.CANCELLED);
        long notDelivered = deliveryRepository.countByVolunteer_IdAndStatus(volunteer.getId(), DeliveryStatus.NOT_DELIVERED);
        long inProgress   = deliveryRepository.findActiveByVolunteerId(volunteer.getId()).isPresent() ? 1 : 0;
        long total        = delivered + cancelled + notDelivered + inProgress;

        return VolunteerAnalyticsDto.builder()
                .totalDeliveries(total)
                .delivered(delivered)
                .cancelled(cancelled)
                .notDelivered(notDelivered)
                .inProgress(inProgress)
                .build();
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private VolunteerDeliveryDto toDto(VolunteerDelivery d) {
        FoodRequest r = d.getFoodRequest();
        return VolunteerDeliveryDto.builder()
                .deliveryId(d.getId())
                .foodRequestId(r.getId())
                .donationId(r.getDonation().getId())
                .foodDescription(r.getDonation().getFoodDescription())
                .foodQuantity(r.getDonation().getFoodQuantity())
                .pickupAddress(r.getDonation().getPickupAddress())
                .donorName(r.getDonation().getUser().getName())
                .donorPhone(r.getDonation().getUser().getPhone())
                .recipientName(r.getUser().getName())
                .recipientPhone(r.getUser().getPhone())
                .deliveryStatus(d.getStatus())
                .requestStatus(r.getStatus())
                .claimedAt(d.getClaimedAt())
                .transitStartedAt(d.getTransitStartedAt())
                .completedAt(d.getCompletedAt())
                .build();
    }
}
