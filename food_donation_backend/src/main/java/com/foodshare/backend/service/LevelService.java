package com.foodshare.backend.service;

import com.foodshare.backend.dto.MilestoneResponse;
import com.foodshare.backend.dto.UserStats;
import org.springframework.stereotype.Service;
import com.foodshare.backend.entity.AchievementMetric;
import com.foodshare.backend.dto.*;
@Service
public class LevelService {

    public int calculateLevel(long totalMeals) {
        return (int) (totalMeals / 100) + 1;
    }

    public long xpTargetForNextLevel(int level) {
        return (long) level * 100;
    }

    public MilestoneResponse nextMilestone(UserStats stats) {
        AchievementDef next = AchievementDefs.ALL.stream()
            .filter(def -> extractMetric(def.metric(), stats) < def.target())
            .findFirst()
            .orElse(AchievementDefs.ALL.get(AchievementDefs.ALL.size() - 1));

        long current = extractMetric(next.metric(), stats);
        return new MilestoneResponse(next.title(), current, next.target(), next.title() + " Badge");
    }

    private long extractMetric(AchievementMetric metric, UserStats stats) {
        return switch (metric) {
            case TOTAL_MEALS -> stats.totalMeals();
            case DONATION_COUNT -> stats.donationCount();
            case PEOPLE_HELPED -> stats.peopleHelped();
        };
    }
}