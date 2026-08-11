package com.foodshare.backend.dto;

import com.foodshare.backend.enumTypes.ReceiverType;
import com.foodshare.backend.enumTypes.VerificationStatus;
import com.foodshare.backend.entity.UserRole;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class AdminResponseDto{

    private String Name;
    private Long userId;
    private ReceiverType receiverType;
    private UserRole Role;
    private String SubmittedAt;
    private VerificationStatus Status;
    private String documentUrl;
    private String documentLabel;
    private Long approvedCount;
    private Long rejectedCount;
    private String approvedOn;
    private String approvedBy;
    private String reason;
}

