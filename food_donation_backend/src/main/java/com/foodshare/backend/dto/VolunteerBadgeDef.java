package com.foodshare.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VolunteerBadgeDef {
    private String id;
    private String icon;
    private String title;
    private String rarity;
    private int target;
    private VolunteerMetric metric;
    private String criteria;
}
