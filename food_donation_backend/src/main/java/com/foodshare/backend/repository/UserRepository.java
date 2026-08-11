package com.foodshare.backend.repository;
import  com.foodshare.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User,Long> 
{
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
    
    
}
