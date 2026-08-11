package com.foodshare.backend.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.foodshare.backend.dto.AchievementResponse;
import com.foodshare.backend.dto.BadgeResponse;
import com.foodshare.backend.dto.MilestoneResponse;
import com.foodshare.backend.dto.ProfileResponse;
import com.foodshare.backend.dto.RecipientAchievementMetric;
import com.foodshare.backend.dto.RecipientAchievements;
import com.foodshare.backend.dto.RecipientBadges;
import com.foodshare.backend.dto.RecipientMilestones;
import com.foodshare.backend.dto.RecipientProfileDto;
import com.foodshare.backend.entity.RequestStatus;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.repository.RequestRepository;
import com.foodshare.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipientProfileService {

    private final UserRepository userRepository;
    private final RequestRepository requestRepository;

    public RecipientProfileDto getProfileDetailsOfRecipient() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalRequests = requestRepository.countByUserId(user.getId());

        long approvedRequests = requestRepository.countByUserIdAndStatus(
                user.getId(),
                RequestStatus.ACCEPTED);

        List<AchievementResponse> achievements =
                RecipientAchievements.ALL.stream()
                        .map(achievement -> {

                            long current = getMetricValue(
                                    achievement.getMetric(),
                                    user,
                                    totalRequests,
                                    approvedRequests);

                            String status;

                            if (current >= achievement.getTarget()) {
                                status = "completed";
                            } else if (current > 0) {
                                status = "in-progress";
                            } else {
                                status = "locked";
                            }

                            return new AchievementResponse(
                                    achievement.getId(),
                                    achievement.getIcon(),
                                    achievement.getTitle(),
                                    achievement.getDescription(),
                                    current,
                                    achievement.getTarget(),
                                    status
                            );
                        })
                        .toList();

        List<BadgeResponse> badges =
                RecipientBadges.ALL.stream()
                        .map(badge -> {

                            int progress = getMetricValue(
                                    badge.getMetric(),
                                    user,
                                    totalRequests,
                                    approvedRequests);

                            String status;

                            if (progress >= badge.getTarget()) {
                                status = "earned";
                            } else if (progress > 0) {
                                status = "in-progress";
                            } else {
                                status = "locked";
                            }

                            return new BadgeResponse(
                                    badge.getId(),
                                    badge.getIcon(),
                                    badge.getTitle(),
                                    badge.getRarity(),
                                    status,
                                    progress,
                                    null,
                                    badge.getCriteria()
                            );
                        })
                        .toList();

        List<MilestoneResponse> milestones =
                RecipientMilestones.ALL.stream()
                        .map(milestone ->
                                new MilestoneResponse(
                                        milestone.getTitle(),
                                        getMetricValue(
                                                milestone.getMetric(),
                                                user,
                                                totalRequests,
                                                approvedRequests),
                                        milestone.getTargetValue(),
                                        milestone.getRewardName()
                                )
                        )
                        .toList();

        ProfileResponse profile = new ProfileResponse(
            user.getName(), user.getPhone(), user.getCity(), user.getCreatedAt().toString(), user.getVerified());

        int totalMealsReceived = (int) approvedRequests;

        int currentXp = totalMealsReceived * 10;

int level = (currentXp / 100) + 1;

int xpTargetForNextLevel = level * 100;

int achievementsCompleted = (int) achievements.stream()
        .filter(a -> "completed".equals(a.status()))
        .count();

int badgesEarned = (int) badges.stream()
        .filter(b -> "earned".equals(b.status()))
        .count();

/*
 * Replace this with actual business logic later.
 * Example:
 * int peopleServed = recipientImpactRepository.getPeopleServed(user.getId());
 */
int peopleServed = totalMealsReceived;

MilestoneResponse nextMilestone = milestones.stream()
        .filter(m -> m.currentValue() < m.targetValue())
        .findFirst()
        .orElse(null);

return RecipientProfileDto.builder()
        .profileResponse(profile)

        .level(level)

        .currentXp(currentXp)

        .xpTargetForNextLevel(xpTargetForNextLevel)

        .achievementsCompleted(achievementsCompleted)

        .achievementsTotal(achievements.size())

        .badgesEarned(badgesEarned)

        .badgesTotal(badges.size())

        .totalMealsReceived(totalMealsReceived)

        .peopleServed(peopleServed)

        .nextMilestone(nextMilestone)

        .achievements(achievements)

        .badges(badges)

        .build();

    }

    private int getMetricValue(
            RecipientAchievementMetric metric,
            User user,
            long totalRequests,
            long approvedRequests) {

        return switch (metric) {

            case VERIFICATION ->
                    Boolean.TRUE.equals(user.getVerified()) ? 1 : 0;

            case REQUEST_COUNT ->
                    (int) totalRequests;

            case FULFILLED_REQUESTS ->
                    (int) approvedRequests;

            case TOTAL_MEALS ->
                    (int) approvedRequests;

            default ->
                    0;
        };
    }
}