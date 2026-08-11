package com.foodshare.backend.service;

import java.util.ArrayList;
import java.util.List;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.entity.VerificationSubmission;
import com.foodshare.backend.enumTypes.VerificationStatus;

import org.springframework.stereotype.Service;
import com.foodshare.backend.dto.AdminResponseDto;
import com.foodshare.backend.dto.AdminSubmissionDto;
import com.foodshare.backend.repository.UserRepository;
import com.foodshare.backend.repository.VerificationRepository;

import java.time.Instant;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Service
public class AdminDashboardService {

    
    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;


    public List<AdminResponseDto> getRecords() {

        List<VerificationSubmission> userRecords = verificationRepository.findAll();
        Long approved = userRecords.stream()
            .filter(record -> record.getStatus() == VerificationStatus.VERIFIED)
            .count();
        Long rejected = userRecords.stream()
            .filter(record -> record.getStatus() == VerificationStatus.REJECTED)
            .count();
            
        List<AdminResponseDto> Records = new ArrayList<>();
        for(int i=0;i<userRecords.size();i++)
        {
            
                AdminResponseDto response = toAdminresponse(userRecords.get(i),approved,rejected);
                Records.add(response);
            
        }
        return Records;        
    }


    private AdminResponseDto toAdminresponse(VerificationSubmission verificationSubmission,Long approved,Long rejected) {

        User user = userRepository.findById(verificationSubmission.getUserId()).orElseThrow(() -> new RuntimeException("user not found"));
        

        Long adminid = verificationSubmission.getReviewedBy();
        User admin = (adminid != null) ? userRepository.findById(adminid).orElse(null) : null;
        
        
        return AdminResponseDto.builder()
        .Name(user.getName())
        .userId(verificationSubmission.getUserId())
        .receiverType(verificationSubmission.getReceiverType())
        .Role(user.getRole())
        .SubmittedAt(String.valueOf(verificationSubmission.getSubmittedAt()))
        .Status(verificationSubmission.getStatus())
        .documentUrl(verificationSubmission.getDocumentUrl())
        .documentLabel(verificationSubmission.getDocumentLabel())
        .approvedCount(approved)
        .rejectedCount(rejected)
        .approvedOn((verificationSubmission.getReviewedAt() != null)?String.valueOf(verificationSubmission.getReviewedAt()):null)
        .approvedBy(admin == null?null:admin.getName())
        .reason(verificationSubmission.getStatus() == VerificationStatus.REJECTED?verificationSubmission.getRejectionReason():null)
        .build();
    }
    

    


    
    public String submitAdminStatus(AdminSubmissionDto submissionDto)
    {
        User user = userRepository.findById(submissionDto.getUserId()).orElseThrow(() -> new RuntimeException("user not found"));
        if(submissionDto.getStatus() == VerificationStatus.REJECTED && submissionDto.getRejectReason() == null)
        {
            throw new RuntimeException("Reject Reason is required when status is REJECTED");
        }
        VerificationSubmission  verificationSubmission =  verificationRepository.findTopByUserIdOrderBySubmittedAtDesc(submissionDto.getUserId()).orElseThrow(() -> new RuntimeException("Submission not found"));
        if(submissionDto.getStatus() == VerificationStatus.VERIFIED)
        {
            user.setVerified(true);
        }
        verificationSubmission.setReviewedAt(Instant.now());
        verificationSubmission.setStatus(submissionDto.getStatus());
        if(submissionDto.getStatus() == VerificationStatus.REJECTED)
            verificationSubmission.setRejectionReason(submissionDto.getRejectReason());
        
        verificationSubmission.setReviewedBy(submissionDto.getAdminId());
        verificationRepository.save(verificationSubmission);
        return "succesfully submitted";
        
    }
    
    
}
