package com.foodshare.backend.dto;

import java.time.Instant;

import com.foodshare.backend.enumTypes.ReceiverType;
import com.foodshare.backend.enumTypes.VerificationStatus;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public  class VerificationResponseDto {
    private Long id;
    private ReceiverType receiverType;
    private VerificationStatus status;
    private String documentLabel;
    private String documentUrl;
    private String selfieUrl;
    private Instant submittedAt;
    private Instant reviewedAt;
    private String rejectionReason;
    // no userId, no reviewedBy — admin internals stay out of the client response
}