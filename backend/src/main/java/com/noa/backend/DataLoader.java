package com.noa.backend;

import com.noa.backend.entity.Subscription;
import com.noa.backend.repository.SubscriptionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

	private final SubscriptionRepository repository;

	public DataLoader(SubscriptionRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... args) throws Exception {
		// 데이터가 이미 있으면 실행하지 않음 (중복 방지)
		if (repository.count() > 0)
			return;

		System.out.println("🚀 초기 데이터 적재 시작...");

		// 1. 넷플릭스
		Subscription s1 = new Subscription();
		s1.setName("넷플릭스 스탠다드");
		s1.setCategory("OTT");
		s1.setCurrency("KRW");
		s1.setMonthlyPrice(17000);
		s1.setUsageCount(5);
		s1.setUsageUnit("편");
		s1.setTargetUsageCount(4);
		s1.setMaxSharedUsers(2);
		s1.setCurrentSharedUsers(1);
		s1.setSharingPlanPrice(17000);
		s1.setStartDate("2024-03-01");
		repository.save(s1);

		// 2. 유튜브
		Subscription s2 = new Subscription();
		s2.setName("유튜브 프리미엄");
		s2.setCategory("영상");
		s2.setCurrency("KRW");
		s2.setMonthlyPrice(14900);
		s2.setUsageCount(60);
		s2.setUsageUnit("시간");
		s2.setTargetUsageCount(20);
		s2.setMaxSharedUsers(6);
		s2.setCurrentSharedUsers(1);
		s2.setSharingPlanPrice(29900);
		s2.setStartDate("2023-12-15");
		repository.save(s2);

		// 3. ChatGPT (소수점 테스트용: $23.23 입력해봄)
		Subscription s3 = new Subscription();
		s3.setName("ChatGPT Plus");
		s3.setCategory("생산성");
		s3.setCurrency("USD");
		s3.setMonthlyPrice(23.23); // ✨ 소수점 값이 확실히 들어갑니다!
		s3.setUsageCount(45);
		s3.setUsageUnit("회");
		s3.setTargetUsageCount(50);
		s3.setMaxSharedUsers(1);
		s3.setCurrentSharedUsers(1);
		s3.setSharingPlanPrice(0);
		s3.setStartDate("2024-01-05");
		repository.save(s3);

		// 4. Adobe
		Subscription s4 = new Subscription();
		s4.setName("Adobe Creative Cloud");
		s4.setCategory("생산성");
		s4.setCurrency("KRW");
		s4.setMonthlyPrice(24000);
		s4.setUsageCount(10);
		s4.setUsageUnit("시간");
		s4.setTargetUsageCount(10);
		s4.setMaxSharedUsers(1);
		s4.setCurrentSharedUsers(1);
		s4.setSharingPlanPrice(0);
		s4.setStartDate("2023-11-20");
		repository.save(s4);

		System.out.println("✅ 초기 데이터 적재 완료!");
	}
}