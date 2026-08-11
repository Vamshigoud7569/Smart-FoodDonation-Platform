package com.foodshare.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecipientMilestone {

    private String title;

   private RecipientAchievementMetric metric;

    private int targetValue;

    private String rewardName;
}