package com.foodshare.backend.dto;

import com.foodshare.backend.entity.UserRole;
import com.foodshare.backend.enumTypes.VerificationStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class VerifiedUsersResponseDto {
    
    private String Name;
    private UserRole Role;
    private String approvedOn;
    private String approvedBy;
    private VerificationStatus status;
}
