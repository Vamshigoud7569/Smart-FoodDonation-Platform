package com.foodshare.backend.dto;
import java.util.List;

public class RecipientMilestones {

    public static final List<RecipientMilestone> ALL = List.of(

            new RecipientMilestone(
                    "Community Anchor",
                   RecipientAchievementMetric.TOTAL_MEALS,
                    100,
                    "Community Anchor Badge"
            ),

            new RecipientMilestone(
                    "Impact Builder",
                    RecipientAchievementMetric.TOTAL_MEALS,
                    500,
                    "Impact Builder Badge"
            )

    );
}
