package com.foodshare.backend.dto;

import java.util.List;

public class VolunteerBadges {
    public static final List<VolunteerBadgeDef> ALL = List.of(
        VolunteerBadgeDef.builder().id("vb-1").icon("🌱").title("Newcomer").rarity("Common").target(1).metric(VolunteerMetric.DELIVERY_COUNT).criteria("Joined FoodShare as a volunteer").build(),
        VolunteerBadgeDef.builder().id("vb-2").icon("🚴").title("Road Runner").rarity("Uncommon").target(5).metric(VolunteerMetric.DELIVERED).criteria("Complete 5 deliveries").build(),
        VolunteerBadgeDef.builder().id("vb-3").icon("⚡").title("Swift Rider").rarity("Rare").target(25).metric(VolunteerMetric.DELIVERED).criteria("Complete 25 deliveries").build(),
        VolunteerBadgeDef.builder().id("vb-4").icon("🔥").title("Delivery Hero").rarity("Epic").target(100).metric(VolunteerMetric.DELIVERED).criteria("Complete 100 deliveries").build(),
        VolunteerBadgeDef.builder().id("vb-5").icon("💎").title("Platinum Volunteer").rarity("Legendary").target(500).metric(VolunteerMetric.DELIVERED).criteria("Complete 500 deliveries").build()
    );
}
