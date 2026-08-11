package com.foodshare.backend.dto;
import java.util.*;
public record DashboardResponse(
    ProfileResponse profile,
    int level,
    long currentXp,
    long xpTargetForNextLevel,
    long achievementsCompleted,
    long achievementsTotal,
    long badgesEarned,
    long badgesTotal,
    long totalMeals,
    long peopleHelped,
    
    MilestoneResponse nextMilestone,
    List<AchievementResponse> achievements,
    List<BadgeResponse> badges
) {}
