package com.foodshare.backend.service;

import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.foodshare.backend.dto.AchievementResponse;
import com.foodshare.backend.dto.BadgeResponse;
import com.foodshare.backend.dto.DashboardResponse;
import com.foodshare.backend.dto.MilestoneResponse;
import com.foodshare.backend.dto.ProfileResponse;
import com.foodshare.backend.dto.UserStats;
import com.foodshare.backend.entity.Donation;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.repository.DonationRepository;
import com.foodshare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileDashboardService {
    
    private final AchievementService achievementService;
    private final BadgeService badgeService;
    private final StatsService statsService;
    private final LevelService levelService;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboardDetails()
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Donation> donations = donationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        UserStats stats = statsService.computeStats(donations);
        List<AchievementResponse> achievements = achievementService.buildAchievements(stats);
        List<BadgeResponse> badges = badgeService.buildBadges(stats);

         long achievementsCompleted = achievements.stream().filter(a -> "completed".equals(a.status())).count();
        long badgesEarned = badges.stream().filter(b -> "earned".equals(b.status())).count();

        int level = levelService.calculateLevel(stats.totalMeals());
        long xpTarget = levelService.xpTargetForNextLevel(level);

        MilestoneResponse milestone = levelService.nextMilestone(stats);

        

        ProfileResponse profile = new ProfileResponse(
            user.getName(), user.getPhone(), user.getCity(), user.getCreatedAt().toString(), user.getVerified());
        
        return new DashboardResponse(
            profile, level, stats.totalMeals(), xpTarget,
            achievementsCompleted, achievements.size(),
            badgesEarned, badges.size(),
            stats.totalMeals(), stats.peopleHelped(),
            milestone, achievements, badges
        );


    }
}
