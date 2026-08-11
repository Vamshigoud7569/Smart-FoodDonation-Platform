package com.foodshare.backend.service;
import org.springframework.stereotype.Service;
import com.foodshare.backend.dto.AchievementResponse;
import com.foodshare.backend.dto.UserStats;
import com.foodshare.backend.entity.AchievementMetric;
import com.foodshare.backend.dto.AchievementDefs;
import java.util.List;

@Service
public class AchievementService {

    public List<AchievementResponse> buildAchievements(UserStats stats) 
    {
        return AchievementDefs.ALL.stream()
            .map(def -> {
                long current = extractMetric(def.metric(), stats);
                String status = current >= def.target() ? "completed"
                    : current > 0 ? "in-progress"
                    : "locked";
                return new AchievementResponse(
                    def.id(), def.icon(), def.title(), def.description(),
                    Math.min(current, def.target()), def.target(), status
                );
            })
            .toList();
    }

    private long extractMetric(AchievementMetric metric, UserStats stats) {
        return switch (metric) {
            case TOTAL_MEALS -> stats.totalMeals();
            case DONATION_COUNT -> stats.donationCount();
            case PEOPLE_HELPED -> stats.peopleHelped();
        };
    }
}