package com.foodshare.backend.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class VolunteerProfileDto {
    private ProfileResponse profileResponse;
    private int level;
    private int currentXp;
    private int xpTargetForNextLevel;
    private int achievementsCompleted;
    private int achievementsTotal;
    private int badgesEarned;
    private int badgesTotal;
    private long totalDeliveries;
    private long deliveredCount;
    private MilestoneResponse nextMilestone;
    private List<AchievementResponse> achievements;
    private List<BadgeResponse> badges;
}
