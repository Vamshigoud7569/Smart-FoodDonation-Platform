package com.foodshare.backend.dto;
public record BadgeResponse(
    String id,
    String icon,
    String title,
    String rarity,   // "Bronze" | "Silver" | "Gold" | "Platinum"
    String status,   // "earned" | "in-progress" | "locked"
    Integer progress, // nullable
    String date,      // nullable
    String criteria
) {}

