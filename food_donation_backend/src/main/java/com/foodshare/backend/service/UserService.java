package com.foodshare.backend.service;

import com.foodshare.backend.dto.RegisterRequest;
import com.foodshare.backend.repository.UserRepository;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.foodshare.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.foodshare.backend.dto.LoginRequest;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public void registerUser(RegisterRequest registerRequest) {
        // checking for existing user
        if(userRepository.existsByPhone(registerRequest.getPhone())) {
            throw new IllegalArgumentException("Phone number already exists");
        }
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // if user is a admin
        if(registerRequest.getRole().toString().equals(registerRequest.getRole().ADMIN.toString())) {
            throw new IllegalArgumentException("Cannot register as admin");
        }

        // create a new user entity
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());
        user.setCity(registerRequest.getCity());
        user.setState(registerRequest.getState());
        user.setRole(registerRequest.getRole());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userRepository.save(user);
    }

    // implement the method for user login
    public User login(LoginRequest loginRequest)
    {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        if(optionalUser.isEmpty())
        {
            throw new IllegalArgumentException("User does not exist");
        }
        User user = optionalUser.get();
        
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
        {
            throw new IllegalArgumentException("Password is incorrect");
        }
        return user;
        
    }
        



}

