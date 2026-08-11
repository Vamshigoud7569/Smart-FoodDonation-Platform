package com.foodshare.backend.dto;

import com.foodshare.backend.entity.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse
{
    private String token;
    private String name;
    private String email;
    private Long userId;
    private UserRole role;

}