package com.foodshare.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VolunteerAnalyticsDto {
    private long totalDeliveries;
    private long delivered;
    private long cancelled;
    private long notDelivered;
    private long inProgress;
}
