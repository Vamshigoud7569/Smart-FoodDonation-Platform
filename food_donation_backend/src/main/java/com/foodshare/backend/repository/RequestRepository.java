package com.foodshare.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.foodshare.backend.entity.FoodRequest;
import com.foodshare.backend.entity.RequestStatus;

public interface RequestRepository extends JpaRepository<FoodRequest, Long> {
    List<FoodRequest> findByUserId(Long userId);
    Optional<FoodRequest> findById(Long id);
    long countByUserId(Long id);
    long countByUserIdAndStatus(Long id, RequestStatus status);

    @Query("SELECT r FROM FoodRequest r WHERE r.donation.user.id = :donorId ORDER BY r.requestedAt DESC")
    List<FoodRequest> findByDonorId(@Param("donorId") Long donorId);

    @Query("SELECT r FROM FoodRequest r WHERE r.donation.user.id = :donorId AND r.status = :status")
    List<FoodRequest> findByDonorIdAndStatus(@Param("donorId") Long donorId, @Param("status") RequestStatus status);

    List<FoodRequest> findByStatus(RequestStatus status);
}
