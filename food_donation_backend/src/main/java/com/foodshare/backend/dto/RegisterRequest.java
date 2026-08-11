package com.foodshare.backend.dto;

import com.foodshare.backend.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    @Size(min = 2, max = 100)
    private String name;

    @Email(message = "Enter a valid email address")
    @NotBlank
    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@(.+)$",
        message = "Enter a valid email address"
    )
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotBlank
    @Pattern(
        regexp = "^(\\+91[6-9]\\d{9}|[6-9]\\d{9})$"
    )
    private String phone;

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotNull
    private UserRole role;

}
