package com.foodshare.backend.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class VolunteerDashboardDto {
    private List<AvailablePickupDto> availablePickups;
    private VolunteerDeliveryDto activeDelivery;
    private long totalDeliveries;
    private long deliveredCount;
    private long cancelledCount;
    private long notDeliveredCount;
}
