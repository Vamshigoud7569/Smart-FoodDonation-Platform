package com.foodshare.backend.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.foodshare.backend.entity.VerificationSubmission;
import com.foodshare.backend.enumTypes.VerificationStatus;

public interface VerificationRepository extends JpaRepository<VerificationSubmission,Long>
{

    Optional<VerificationSubmission> findByUserIdAndStatus(Long userId, VerificationStatus status);

    Optional<VerificationSubmission> findTopByUserIdOrderBySubmittedAtDesc(Long userId);

    List<VerificationSubmission> findByStatus(VerificationStatus status);
    
    List<VerificationSubmission> findAll();

    
}