package com.foodshare.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class RejectDto {
    @NotBlank(message = "A rejection reason is required")
    private String reason;
}