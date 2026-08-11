package com.foodshare.backend.dto;

import com.foodshare.backend.enumTypes.VerificationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminSubmissionDto {
    @NotNull
    private Long userId;

    @NotBlank
    private VerificationStatus status;

    @NotNull
    private Long adminId;

    private String rejectReason;



    
}
