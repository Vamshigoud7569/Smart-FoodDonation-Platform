package com.foodshare.backend.dto;
import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class RecipientProfileDto {
private ProfileResponse profileResponse;
private int level;
private int currentXp;
private int xpTargetForNextLevel;
private int achievementsCompleted;
private int achievementsTotal;
private int badgesEarned;
private int badgesTotal;
private int totalMealsReceived;
private int peopleServed;
private MilestoneResponse nextMilestone;
private List<AchievementResponse> achievements;
private List<BadgeResponse> badges;

}