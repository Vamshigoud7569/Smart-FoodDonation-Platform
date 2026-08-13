package com.foodshare.backend.entity;

public enum RequestStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    IN_TRANSIT,
    PICKED_UP, 
    DELIVERED,
    COMPLETED,
    CANCELLED
}