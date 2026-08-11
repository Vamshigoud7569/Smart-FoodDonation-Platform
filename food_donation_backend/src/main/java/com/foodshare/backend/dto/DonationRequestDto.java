package com.foodshare.backend.dto;
import java.time.LocalDateTime;
import com.foodshare.backend.entity.DonationStatus;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DonationRequestDto {
    private Long id;

    private String foodDescription;

    private String foodType;

    private String foodQuantity;

    private String pickupAddress;

    private DonationStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    private String name;
}
