package com.foodshare.backend.dto;

import java.util.List;

public class VolunteerAchievements {
    public static final List<VolunteerAchievementDef> ALL = List.of(
        VolunteerAchievementDef.builder().id("va-1").icon("✅").title("Verified Volunteer").description("Complete document verification").target(1).metric(VolunteerMetric.VERIFICATION).build(),
        VolunteerAchievementDef.builder().id("va-2").icon("🚴").title("First Delivery").description("Complete your first delivery").target(1).metric(VolunteerMetric.DELIVERED).build(),
        VolunteerAchievementDef.builder().id("va-3").icon("📦").title("10 Deliveries Done").description("Complete 10 deliveries").target(10).metric(VolunteerMetric.DELIVERED).build(),
        VolunteerAchievementDef.builder().id("va-4").icon("🏃").title("50 Deliveries").description("Complete 50 deliveries").target(50).metric(VolunteerMetric.DELIVERED).build(),
        VolunteerAchievementDef.builder().id("va-5").icon("🏆").title("Century Rider").description("Complete 100 deliveries").target(100).metric(VolunteerMetric.DELIVERED).build(),
        VolunteerAchievementDef.builder().id("va-6").icon("👑").title("Elite Volunteer").description("Complete 500 deliveries").target(500).metric(VolunteerMetric.DELIVERED).build()
    );
}
