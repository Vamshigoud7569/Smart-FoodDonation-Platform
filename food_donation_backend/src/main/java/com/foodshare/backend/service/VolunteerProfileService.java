package com.foodshare.backend.service;

import com.foodshare.backend.dto.*;
import com.foodshare.backend.entity.DeliveryStatus;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.repository.UserRepository;
import com.foodshare.backend.repository.VerificationRepository;
import com.foodshare.backend.repository.VolunteerDeliveryRepository;
import com.foodshare.backend.enumTypes.VerificationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VolunteerProfileService {

    private final UserRepository userRepository;
    private final VolunteerDeliveryRepository deliveryRepository;
    private final VerificationRepository verificationRepository;

    public VolunteerProfileDto getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long delivered    = deliveryRepository.countByVolunteer_IdAndStatus(user.getId(), DeliveryStatus.DELIVERED);
        long total        = deliveryRepository.findByVolunteer_Id(user.getId()).size();

        boolean isVerified = verificationRepository
                .findByUserIdAndStatus(user.getId(), VerificationStatus.VERIFIED)
                .isPresent();

        List<AchievementResponse> achievements = VolunteerAchievements.ALL.stream()
                .map(def -> {
                    long current = getMetric(def.getMetric(), isVerified, delivered, total);
                    String status = current >= def.getTarget() ? "completed"
                            : current > 0 ? "in-progress" : "locked";
                    return new AchievementResponse(def.getId(), def.getIcon(), def.getTitle(),
                            def.getDescription(), Math.min(current, def.getTarget()), def.getTarget(), status);
                }).toList();

        List<BadgeResponse> badges = VolunteerBadges.ALL.stream()
                .map(def -> {
                    long current = getMetric(def.getMetric(), isVerified, delivered, total);
                    String status = current >= def.getTarget() ? "earned"
                            : current > 0 ? "in-progress" : "locked";
                    Integer progress = "in-progress".equals(status)
                            ? (int) Math.min(100, (current * 100) / def.getTarget()) : null;
                    return new BadgeResponse(def.getId(), def.getIcon(), def.getTitle(),
                            def.getRarity(), status, progress, null, def.getCriteria());
                }).toList();

        MilestoneResponse nextMilestone = VolunteerMilestones.ALL.stream()
                .map(m -> {
                    long current = getMetric(m.metric(), isVerified, delivered, total);
                    return new MilestoneResponse(m.title(), current, m.targetValue(), m.rewardName());
                })
                .filter(m -> m.currentValue() < m.targetValue())
                .findFirst()
                .orElse(new MilestoneResponse("All milestones complete!", delivered, delivered, "Legend"));

        int currentXp = (int) delivered * 15;
        int level = (currentXp / 100) + 1;
        int xpTarget = level * 100;

        int achievementsCompleted = (int) achievements.stream().filter(a -> "completed".equals(a.status())).count();
        int badgesEarned = (int) badges.stream().filter(b -> "earned".equals(b.status())).count();

        ProfileResponse profile = new ProfileResponse(
                user.getName(), user.getPhone(), user.getCity(),
                user.getCreatedAt().toString(), user.getVerified());

        return VolunteerProfileDto.builder()
                .profileResponse(profile)
                .level(level)
                .currentXp(currentXp)
                .xpTargetForNextLevel(xpTarget)
                .achievementsCompleted(achievementsCompleted)
                .achievementsTotal(achievements.size())
                .badgesEarned(badgesEarned)
                .badgesTotal(badges.size())
                .totalDeliveries(total)
                .deliveredCount(delivered)
                .nextMilestone(nextMilestone)
                .achievements(achievements)
                .badges(badges)
                .build();
    }

    private long getMetric(VolunteerMetric metric, boolean isVerified, long delivered, long total) {
        return switch (metric) {
            case VERIFICATION   -> isVerified ? 1 : 0;
            case DELIVERED      -> delivered;
            case DELIVERY_COUNT -> total;
            default             -> 0;
        };
    }
}
