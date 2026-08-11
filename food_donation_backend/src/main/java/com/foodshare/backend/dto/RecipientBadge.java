package com.foodshare.backend.dto;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecipientBadge {

    private String id;

    private String icon;

    private String title;

    private String rarity;

    private RecipientAchievementMetric metric;

    private Integer target;

    private String date;

    private String criteria;
}
