package com.foodshare.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonationRequest {

    @NotBlank
    private String foodDescription;

    @NotBlank
    private String foodType;

    @NotBlank
    private String foodQuantity;

    @NotBlank
    private String pickupAddress;
}
