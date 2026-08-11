package com.foodshare.backend.service;

import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.foodshare.backend.dto.VerificationRequest;
import com.foodshare.backend.dto.VerificationResponseDto;
import com.foodshare.backend.entity.User;
import com.foodshare.backend.entity.VerificationSubmission;
import com.foodshare.backend.enumTypes.FileStorageService;
import com.foodshare.backend.enumTypes.VerificationStatus;
import com.foodshare.backend.exception.ConflictException;
import com.foodshare.backend.repository.UserRepository;
import com.foodshare.backend.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public VerificationResponseDto submitDocuments(VerificationRequest dto, MultipartFile govId, MultipartFile selfie, String auth) {
        User user = extractUser(auth);

        boolean alreadyPending = verificationRepository
            .findByUserIdAndStatus(user.getId(), VerificationStatus.PENDING)
            .isPresent();
        if (alreadyPending) throw new ConflictException("A submission is already pending review");

        boolean alreadyVerified = verificationRepository
            .findByUserIdAndStatus(user.getId(), VerificationStatus.VERIFIED)
            .isPresent();
        if (alreadyVerified) throw new ConflictException("You are already verified");

        String govIdUrl = fileStorageService.store(govId);
        String selfieUrl = (selfie != null && !selfie.isEmpty()) ? fileStorageService.store(selfie) : null;

        VerificationSubmission entity = VerificationSubmission.builder()
            .userId(user.getId())
            .receiverType(dto.getReceiverType())
            .documentLabel(dto.getDocumentLabel())
            .documentUrl(govIdUrl)
            .selfieUrl(selfieUrl)
            .status(VerificationStatus.PENDING)
            .submittedAt(Instant.now())
            .build();

        return toResponseDto(verificationRepository.save(entity));
    }

    public VerificationResponseDto getMine(String authHeader) {
        User user = extractUser(authHeader);
        return verificationRepository
            .findTopByUserIdOrderBySubmittedAtDesc(user.getId())
            .map(this::toResponseDto)
            .orElseGet(this::unverifiedDefault);
    }

    private VerificationResponseDto unverifiedDefault() {
        return VerificationResponseDto.builder().status(VerificationStatus.UNVERIFIED).build();
    }

    private VerificationResponseDto toResponseDto(VerificationSubmission s) {
        return VerificationResponseDto.builder()
            .id(s.getId())
            .receiverType(s.getReceiverType())
            .documentLabel(s.getDocumentLabel())
            .documentUrl(s.getDocumentUrl())
            .selfieUrl(s.getSelfieUrl())
            .status(s.getStatus())
            .submittedAt(s.getSubmittedAt())
            .rejectionReason(s.getRejectionReason())
            .reviewedAt(s.getReviewedAt())
            .build();
    }

    private User extractUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new IllegalArgumentException("Missing or malformed Authorization header");
        String email = jwtService.extractEmail(authHeader.substring(7));
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
