package com.foodshare.backend.controller;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.foodshare.backend.dto.AdminResponseDto;
import com.foodshare.backend.dto.AdminSubmissionDto;
import com.foodshare.backend.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@RestController
@RequestMapping("/FoodDonation")
public class AdminDashboardController{


    private final AdminDashboardService adminDashboardService;

    @GetMapping("/adminDashboard")
    public ResponseEntity<List<AdminResponseDto>> getRecords()
    {
        return ResponseEntity.ok(adminDashboardService.getRecords());
    }

    

    @PostMapping("/adminDashboard/submitAdminStatus")
    public ResponseEntity<String> submitAdminStatus(@RequestBody AdminSubmissionDto submissionDto)
    {
        return ResponseEntity.ok(adminDashboardService.submitAdminStatus(submissionDto));
    }
}