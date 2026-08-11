package com.foodshare.backend.dto;
import java.util.List;
import com.foodshare.backend.entity.AchievementMetric;


public class Badges{
    public static final List<Badge> ALL = List.of(
        new Badge("b1", "🌱", "Eco Hero", "Bronze", 50, AchievementMetric.TOTAL_MEALS, "Save 50kg of food waste"),
        new Badge("b2", "🍱", "Food Saver", "Silver", 100, AchievementMetric.TOTAL_MEALS, "Donate 100 hot meals"),
        new Badge("b3", "❤️", "Helping Heart", "silver", 10, AchievementMetric.DONATION_COUNT, "Donate food 1000 hot meals"),
        new Badge("b4", "⭐", "Top Donor", "Gold", 2000, AchievementMetric.DONATION_COUNT, "Donate 2000 hot meals"),
        new Badge("b5", "♻️", "Waste Warrior", "Silver", 500, AchievementMetric.TOTAL_MEALS, "Recycle or redirect 500lbs of organics"),
        new Badge("b6", "👑", "Elite Contributor", "Platinum", 4000, AchievementMetric.DONATION_COUNT, "Sustain weekly donations for 1 year"),
        new Badge("b7", "💎", "Platinum Donor", "Diamond", 5000, AchievementMetric.TOTAL_MEALS, "Exceed 5,000 total meals donated")
    );
}