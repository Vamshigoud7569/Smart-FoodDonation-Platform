package com.foodshare.backend.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@RequiredArgsConstructor
public class PasswordRequest {
    private String currentPassword;
    private String newPassword;
}
