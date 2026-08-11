package com.foodshare.backend.entity;
import java.time.Instant;
import com.foodshare.backend.enumTypes.ReceiverType;
import com.foodshare.backend.enumTypes.VerificationStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "verification_submissions")
public class VerificationSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @JoinColumn(name = "receiver_type", nullable = false)
    private ReceiverType receiverType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status;

    @Column(nullable = false)
    private String documentLabel;

    @Column(nullable = false)
    private String documentUrl;

    private String selfieUrl;

    @Column(nullable = false)
    private Instant submittedAt;

    private Instant reviewedAt;

    private Long reviewedBy;

    @Column(length = 500)
    private String rejectionReason;
    
}