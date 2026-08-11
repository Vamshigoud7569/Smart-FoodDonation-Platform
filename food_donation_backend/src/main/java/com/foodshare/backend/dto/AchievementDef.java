package com.foodshare.backend.dto;
import com.foodshare.backend.entity.AchievementMetric;
public record AchievementDef(
    String id, String icon, String title, String description,
    long target, AchievementMetric metric
) {}
