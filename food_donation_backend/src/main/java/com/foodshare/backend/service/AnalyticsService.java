package com.foodshare.backend.service;
import com.foodshare.backend.dto.HourlyTrend;
import com.foodshare.backend.repository.DonationRepository;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final DonationRepository donationRepository;

    public List<HourlyTrend> getHourlyTrends() {

        LocalDateTime fromDate = LocalDateTime.now().minusDays(30);

        List<Object[]> results =
                donationRepository.getHourlyTrends(fromDate);

        List<HourlyTrend> hourlyTrends = new ArrayList<>();
        for (Object[] r : results) {
            hourlyTrends.add(new HourlyTrend(
                    (int) r[0],
                    (long) r[1]
            ));
        }
        return hourlyTrends;
    }
}
