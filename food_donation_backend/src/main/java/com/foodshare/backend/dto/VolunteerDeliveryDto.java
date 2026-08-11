package com.foodshare.backend.dto;

import com.foodshare.backend.entity.DeliveryStatus;
import com.foodshare.backend.entity.RequestStatus;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class VolunteerDeliveryDto {
    private Long deliveryId;
    private Long foodRequestId;
    private Long donationId;
    private String foodDescription;
    private String foodQuantity;
    private String pickupAddress;
    private String donorName;
    private String donorPhone;
    private String recipientName;
    private String recipientPhone;
    private DeliveryStatus deliveryStatus;
    private RequestStatus requestStatus;
    private LocalDateTime claimedAt;
    private LocalDateTime transitStartedAt;
    private LocalDateTime completedAt;
}
