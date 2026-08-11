package com.foodshare.backend.dto;

import java.util.List;

public class RecipientBadges {
    public static final List<RecipientBadge> ALL = List.of(
        new RecipientBadge("bdg-1", "🌱", "Newcomer", "Common", RecipientAchievementMetric.FULFILLED_REQUESTS, 1, "2026-07-05", "Joined FoodShare"),
        new RecipientBadge("bdg-2", "🛡️", "Trusted Partner", "Uncommon", RecipientAchievementMetric.FULFILLED_REQUESTS, 3, "2026-07-15", "Became a verified receiver"),
        new RecipientBadge("bdg-3", "⚓", "Community Anchor", "Rare", RecipientAchievementMetric.FULFILLED_REQUESTS, 34, null, "25 requests fulfilled"),
        new RecipientBadge("bdg-4", "📆", "Steady Supporter", "Rare", RecipientAchievementMetric.FULFILLED_REQUESTS, 60, null, "Active for 3 months"),
        new RecipientBadge("bdg-5", "🏗️", "Impact Builder", "Epic", RecipientAchievementMetric.FULFILLED_REQUESTS, 100, null, "100 meals received"),
        new RecipientBadge("bdg-6", "👑", "Legacy Partner", "Legendary", RecipientAchievementMetric.FULFILLED_REQUESTS, 1000, null, "1000 Meals received on FoodShare")
    );
}
