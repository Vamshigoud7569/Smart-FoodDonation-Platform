package com.foodshare.backend.service;

import org.springframework.stereotype.Service;

import com.foodshare.backend.config.SecurityConfig;
import com.foodshare.backend.dto.PasswordRequest;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.exception.*;
import com.foodshare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordService {

    private final UserRepository userRepository;
    private final SecurityConfig securityConfig;
    private final JwtService jwtService;
    public String updatePassword(PasswordRequest request, String authentication) 
    {
        String token = authentication.substring(7);
        String email = jwtService.extractEmail(token);
        Optional<User> userData = Optional.ofNullable(userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found")));
        User user = userData.get();
        if(!securityConfig.passwordEncoder().matches(request.getCurrentPassword(), user.getPassword())){
            throw new InvalidPasswordException("Invalid Current Password");
        }
        if(securityConfig.passwordEncoder().matches(request.getNewPassword(), user.getPassword())){
            throw new InvalidPasswordException("New Password and Current should be different");
        }
       
        user.setPassword(securityConfig.passwordEncoder().encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password updated successfully";
        

        
        
    }
    
}
