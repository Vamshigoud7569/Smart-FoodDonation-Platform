package com.foodshare.backend.dto;
public record AchievementResponse(
    String id, String icon, String title, String description,
    long current, long target, String status) 
{}