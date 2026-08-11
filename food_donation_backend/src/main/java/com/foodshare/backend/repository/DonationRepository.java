package com.foodshare.backend.repository;

import com.foodshare.backend.entity.Donation;
import com.foodshare.backend.entity.DonationStatus;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByStatus(DonationStatus status);

    List<Donation> findByStatusAndExpiresAtBefore(DonationStatus status, LocalDateTime time);

    List<Donation> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("""
        SELECT HOUR(f.createdAt), COUNT(f)
        FROM Donation f
        WHERE f.createdAt >= :fromDate
        GROUP BY HOUR(f.createdAt)
        ORDER BY HOUR(f.createdAt)
    """)
    List<Object[]> getHourlyTrends(@Param("fromDate") LocalDateTime fromDate);

    
    @Query(value = """
            SELECT d FROM Donation d
            WHERE d.pickupAddress LIKE %:location%
            AND d.status = 'ACTIVE'
            AND d.expiresAt > CURRENT_TIMESTAMP
            """)
    List<Donation> findAvailableDonationsByLocation(@Param("location") String location);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM Donation d WHERE d.id = :id")
    Optional<Donation> findByIdForUpdate(Long id);

}
