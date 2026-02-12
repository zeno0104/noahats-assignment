package com.noah.backend.repository;

import com.noah.backend.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

	List<Subscription> findByCategory(String category);

	@Query("SELECT COALESCE(SUM(s.monthlyPrice), 0) FROM Subscription s")
	int getTotalMonthlySpending();

	@Query("SELECT s.category, SUM(s.monthlyPrice) FROM Subscription s GROUP BY s.category")
	List<Object[]> getSpendingByCategory();
}
