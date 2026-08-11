package com.foodshare.backend.dto;

public record VolunteerMilestoneDef(
    String title,
    VolunteerMetric metric,
    int targetValue,
    String rewardName
) {}
