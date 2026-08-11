package com.foodshare.backend.dto;

import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private String name;
    private String phone;
    private String city;
    private String createdAt;
    private boolean verified;
    // private String totalDonations;
    // private String foodQuantity;

}