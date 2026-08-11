
package com.foodshare.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.foodshare.backend.entity.Donation;
import com.foodshare.backend.dto.UserStats;
@Service
public class StatsService {

    public UserStats computeStats(List<Donation> donations) {
        long totalMeals = donations.stream()
            .mapToLong(d -> Long.parseLong(d.getFoodQuantity()))
            .sum();
        long donationCount = donations.size();
        long peopleHelped = totalMeals / 3; // placeholder ratio — confirm real rule
        return new UserStats(totalMeals, donationCount, peopleHelped);
    }
}