package com.foodshare.backend.repository;

import com.foodshare.backend.entity.DeliveryStatus;
import com.foodshare.backend.entity.VolunteerDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VolunteerDeliveryRepository extends JpaRepository<VolunteerDelivery, Long> {

    @Query("SELECT v FROM VolunteerDelivery v WHERE v.volunteer.id = :volunteerId AND v.status IN (com.foodshare.backend.entity.DeliveryStatus.PICKED_UP, com.foodshare.backend.entity.DeliveryStatus.IN_TRANSIT)")
    Optional<VolunteerDelivery> findActiveByVolunteerId(@Param("volunteerId") Long volunteerId);

    List<VolunteerDelivery> findByVolunteer_Id(Long volunteerId);

    long countByVolunteer_IdAndStatus(Long volunteerId, DeliveryStatus status);
}
