
package com.foodshare.backend.dto;

public record MilestoneResponse(
    String title,
    long currentValue,
    long targetValue,
    String rewardName
) {}