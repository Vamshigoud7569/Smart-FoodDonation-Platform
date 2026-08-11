package com.foodshare.backend.dto;

import com.foodshare.backend.enumTypes.ReceiverType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerificationRequest {
    private ReceiverType receiverType;   // null for VOLUNTEER
    private String documentLabel;        // null for VOLUNTEER
}
