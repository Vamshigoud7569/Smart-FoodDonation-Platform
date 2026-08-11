package com.foodshare.backend.dto;

import java.util.List;

public class VolunteerMilestones {
    public static final List<VolunteerMilestoneDef> ALL = List.of(
        new VolunteerMilestoneDef("First Milestone", VolunteerMetric.DELIVERED, 10, "Road Runner Badge"),
        new VolunteerMilestoneDef("Swift Rider",     VolunteerMetric.DELIVERED, 25, "Swift Rider Badge"),
        new VolunteerMilestoneDef("Delivery Hero",   VolunteerMetric.DELIVERED, 100, "Delivery Hero Badge"),
        new VolunteerMilestoneDef("Platinum Legend", VolunteerMetric.DELIVERED, 500, "Platinum Volunteer Badge")
    );
}
