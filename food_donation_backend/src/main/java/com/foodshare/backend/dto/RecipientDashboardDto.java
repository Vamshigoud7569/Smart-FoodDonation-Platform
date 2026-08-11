package com.foodshare.backend.dto;


import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RecipientDashboardDto {

    List<DonationRequestDto> donations;
    List<FoodRequestDto> requests;
}
