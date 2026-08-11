package com.foodshare.backend.service;

import org.springframework.stereotype.Service;
import com.foodshare.backend.dto.UserStats;
import com.foodshare.backend.entity.AchievementMetric;
import com.foodshare.backend.dto.BadgeResponse;
import com.foodshare.backend.dto.Badges;
import java.time.LocalDate;

import java.util.List;
@Service
public class BadgeService {

    public List<BadgeResponse> buildBadges(UserStats stats) {

        return Badges.ALL.stream()
        .map(b -> {
            long current = extractMetric(b.metric(),stats);
            String status = current >= b.target()?"earned":current > 0 ? "in-progress"
                : "locked";
            Integer progress = status.equals("in-progress")
                ? (int) Math.min(100, (current * 100) / b.target()): null;
            return new BadgeResponse(b.id(),b.icon(),b.title(),b.rarity(),status,progress,status.equalsIgnoreCase("earned")?LocalDate.now().toString() : null,b.criteria());
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
