package com.foodshare.backend.dto;

import java.util.List;

public class RecipientAchievements {
    
    public static final List<RecipientAchievement> ALL = List.of(

        new RecipientAchievement(
                "ach-1",
                "✅",
                "Verified Account",
                "Complete document verification",
                1,
                RecipientAchievementMetric.VERIFICATION
        ),

        new RecipientAchievement(
                "ach-2",
                "📨",
                "First Request Sent",
                "Send your first donation request",
                1,
                RecipientAchievementMetric.REQUEST_COUNT
        ),

        new RecipientAchievement(
                "ach-3",
                "📦",
                "5 Requests Fulfilled",
                "Have 5 requests marked fulfilled",
                5,
                RecipientAchievementMetric.FULFILLED_REQUESTS
        ),

        new RecipientAchievement(
                "ach-4",
                "🍽️",
                "50 Meals Received",
                "Receive 50 meals in total",
                50,
                RecipientAchievementMetric.TOTAL_MEALS
        ),

        new RecipientAchievement(
                "ach-5",
                "🤝",
                "100 People Served",
                "Support 100 people through received donations",
                100,
                RecipientAchievementMetric.TOTAL_MEALS
        ),

        new RecipientAchievement(
                "ach-6",
                "🗓️",
                "Consistent Requester",
                "Request at least once a week for a month",
                4,
                RecipientAchievementMetric.REQUEST_COUNT
        )
    );

}
