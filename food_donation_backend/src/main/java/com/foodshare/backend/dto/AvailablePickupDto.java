package com.foodshare.backend.dto;

import com.foodshare.backend.entity.RequestStatus;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class AvailablePickupDto {
    private Long requestId;
    private Long donationId;
    private String foodDescription;
    private String foodType;
    private String foodQuantity;
    private String pickupAddress;
    private String donorName;
    private String recipientName;
    private RequestStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
}
