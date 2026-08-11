package com.foodshare.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
@EnableScheduling
public class FoodDonationApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodDonationApplication.class, args);
        log.info("Food Donation Platform Backend Started!");
        log.info("Server running at: http://localhost:8080/FoodDonation");
    }

    
}