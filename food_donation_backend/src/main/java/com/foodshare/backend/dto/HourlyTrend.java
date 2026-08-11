package com.foodshare.backend.dto;

public class HourlyTrend {

    private Integer hour;
    private Long count;

    public HourlyTrend(Integer hour, Long count) {
        this.hour = hour;
        this.count = count;
    }

    public Integer getHour() {
        return hour;
    }

    public Long getCount() {
        return count;
    }
}