
package com.foodshare.backend.dto;
import   com.foodshare.backend.entity.AchievementMetric;
public record Badge(String id, String icon, String title, String rarity,long target,AchievementMetric metric, String criteria) {}