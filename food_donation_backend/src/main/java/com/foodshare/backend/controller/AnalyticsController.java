package com.foodshare.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.foodshare.backend.dto.HourlyTrend;
import com.foodshare.backend.service.*;
import java.util.*;

@RestController
@RequestMapping("/FoodDonation")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/analytics")
    public List<HourlyTrend> getHourlyTrends() {
        return analyticsService.getHourlyTrends();
    }
}
