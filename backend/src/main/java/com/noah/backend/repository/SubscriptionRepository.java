package com.noah.backend.repository;

import com.noah.backend.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
	List<Subscription> findByCategory(String category);
}