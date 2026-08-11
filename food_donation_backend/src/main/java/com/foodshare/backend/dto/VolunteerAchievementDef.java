package com.foodshare.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VolunteerAchievementDef {
    private String id;
    private String icon;
    private String title;
    private String description;
    private int target;
    private VolunteerMetric metric;
}
