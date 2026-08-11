package com.foodshare.backend.dto;

import java.time.LocalDateTime;
import com.foodshare.backend.entity.RequestStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FoodRequestDto {
    private Long id;
    private Long user_id;
    private Long donation_id;
    private String foodDescription;
    private String foodType;
    private String foodQuantity;
    private String pickupAddress;
    private String donorName;
    private String volunteerName;
    private RequestStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
}
