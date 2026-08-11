package com.foodshare.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.foodshare.backend.dto.LoginRequest;
import com.foodshare.backend.dto.RegisterRequest;
import com.foodshare.backend.service.UserService;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.dto.LoginResponse;
import jakarta.validation.Valid;


import com.foodshare.backend.service.JwtService;

@RestController

@RequestMapping("/FoodDonation")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public UserController(UserService userService, JwtService jwtService)
    {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    @PostMapping("/registration")
    public void registerUser(@Valid @RequestBody RegisterRequest registerRequest)
    {
        userService.registerUser(registerRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> Login(@Valid @RequestBody LoginRequest loginRequest)
    {
        User user = userService.login(loginRequest);
        String token = jwtService.generateToken(user);
        LoginResponse response = new LoginResponse();

        response.setToken(token);
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        return ResponseEntity.ok(response);



    }
    
}
