package com.foodshare.backend.dto;

import java.time.LocalDateTime;
import com.foodshare.backend.entity.RequestStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class IncomingRequestDto {
    private Long requestId;
    private Long donationId;
    private String foodDescription;
    private String foodQuantity;
    private String pickupAddress;
    private String recipientName;
    private String recipientPhone;
    private RequestStatus status;
    private LocalDateTime requestedAt;
    private String volunteerName;
}
