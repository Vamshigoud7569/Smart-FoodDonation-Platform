package com.foodshare.backend.dto;
import java.util.List;
import com.foodshare.backend.entity.AchievementMetric;

public class AchievementDefs {
    public static final List<AchievementDef> ALL = List.of(
        new AchievementDef("1", "🥉", "First Helping Hand", "Complete your first donation", 1, AchievementMetric.DONATION_COUNT),
        new AchievementDef("2", "🥈", "Meal Maker", "Donate 100 meals", 100, AchievementMetric.TOTAL_MEALS),
        new AchievementDef("3", "🥇", "Hunger Fighter", "Help 500 people", 500, AchievementMetric.PEOPLE_HELPED),
        new AchievementDef("4", "🏆", "Community Hero", "Complete 50 donations", 50, AchievementMetric.DONATION_COUNT),
        new AchievementDef("5", "👑", "FoodShare Legend", "Share 1000 meals", 1000, AchievementMetric.TOTAL_MEALS)
    );
}