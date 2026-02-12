package com.noah.backend.service;

import com.noah.backend.entity.Subscription;
import com.noah.backend.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

	private final SubscriptionRepository repository;

	public SubscriptionService(SubscriptionRepository repository) {
		this.repository = repository;
	}

	// ============ CRUD ============

	public List<Subscription> findAll() {
		return repository.findAll();
	}

	public Optional<Subscription> findById(Long id) {
		return repository.findById(id);
	}

	public Subscription save(Subscription subscription) {
		if (subscription.getCurrentSharedUsers() < 1) {
			subscription.setCurrentSharedUsers(1);
		}
		return repository.save(subscription);
	}

	public void deleteById(Long id) {
		repository.deleteById(id);
	}

	// ============ ROI 분석 ============

	/**
	 * 개별 구독의 ROI 분석 결과를 계산합니다. - costPerUse: 1회당 비용 - roi: 시장가 대비 수익률 (%) - signal:
	 * GREEN / YELLOW / RED - 공유 시 절감액 등
	 */
	public Map<String, Object> analyzeSubscription(Subscription sub) {
		Map<String, Object> result = new LinkedHashMap<>();
		result.put("id", sub.getId());
		result.put("name", sub.getName());
		result.put("category", sub.getCategory());
		result.put("monthlyPrice", sub.getMonthlyPrice());
		result.put("usageCount", sub.getUsageCount());
		result.put("usageUnit", sub.getUsageUnit());

		// 1회당 비용 계산
		double costPerUse = 0;
		if (sub.getUsageCount() > 0) {
			costPerUse = (double) sub.getMonthlyPrice() / sub.getUsageCount();
		}
		result.put("costPerUse", Math.round(costPerUse));

		// 시장가 비교
		result.put("marketUnitPrice", sub.getMarketUnitPrice());
		result.put("marketComparison", sub.getMarketComparison());

		// ROI 계산: (시장가 - 1회당비용) / 시장가 * 100
		double roi = 0;
		if (sub.getMarketUnitPrice() > 0 && sub.getUsageCount() > 0) {
			roi = ((double) sub.getMarketUnitPrice() - costPerUse) / sub.getMarketUnitPrice() * 100;
		} else if (sub.getUsageCount() == 0) {
			roi = -100; // 사용 안 하면 완전 손해
		}
		result.put("roi", Math.round(roi * 10) / 10.0);

		// 공유 시뮬레이션
		int sharingPlanPrice = sub.getSharingPlanPrice();
		int maxShared = sub.getMaxSharedUsers();
		double sharedCostPerMonth = 0;
		double sharedCostPerUse = 0;
		double sharedRoi = 0;
		double monthlySavings = 0;
		double annualSavings = 0;

		if (sharingPlanPrice > 0 && maxShared > 1) {
			sharedCostPerMonth = (double) sharingPlanPrice / maxShared;
			if (sub.getUsageCount() > 0) {
				sharedCostPerUse = sharedCostPerMonth / sub.getUsageCount();
				if (sub.getMarketUnitPrice() > 0) {
					sharedRoi = ((double) sub.getMarketUnitPrice() - sharedCostPerUse) / sub.getMarketUnitPrice() * 100;
				}
			}
			monthlySavings = sub.getMonthlyPrice() - sharedCostPerMonth;
			annualSavings = monthlySavings * 12;
		}

		Map<String, Object> shareSimulation = new LinkedHashMap<>();
		shareSimulation.put("available", sharingPlanPrice > 0 && maxShared > 1);
		shareSimulation.put("maxUsers", maxShared);
		shareSimulation.put("currentUsers", sub.getCurrentSharedUsers());
		shareSimulation.put("sharedMonthlyPrice", Math.round(sharedCostPerMonth));
		shareSimulation.put("sharedCostPerUse", Math.round(sharedCostPerUse));
		shareSimulation.put("sharedRoi", Math.round(sharedRoi * 10) / 10.0);
		shareSimulation.put("monthlySavings", Math.round(monthlySavings));
		shareSimulation.put("annualSavings", Math.round(annualSavings));
		result.put("shareSimulation", shareSimulation);

		// 신호등 판정
		String signal;
		String verdict;
		if (sub.getUsageCount() == 0) {
			signal = "RED";
			verdict = "사용 기록이 없습니다. 즉시 해지를 권장합니다.";
		} else if (roi >= 0) {
			signal = "GREEN";
			verdict = "본전 이상! 유지하세요.";
		} else if (sharingPlanPrice > 0 && sharedRoi >= 0) {
			signal = "YELLOW";
			verdict = "지금은 손해지만, 공유하면 이득입니다! 파티원을 구하세요.";
		} else {
			signal = "RED";
			verdict = "손해입니다. 해지하거나 단건 결제를 추천합니다.";
		}
		result.put("signal", signal);
		result.put("verdict", verdict);

		// 연간 비용
		result.put("annualCost", sub.getMonthlyPrice() * 12);

		return result;
	}

	/**
	 * 전체 구독 ROI 분석
	 */
	public List<Map<String, Object>> analyzeAll() {
		return repository.findAll().stream().map(this::analyzeSubscription).collect(Collectors.toList());
	}

	// ============ 대시보드 ============

	/**
	 * 대시보드 요약 데이터를 반환합니다.
	 */
	public Map<String, Object> getDashboard() {
		List<Subscription> all = repository.findAll();
		Map<String, Object> dashboard = new LinkedHashMap<>();

		// 총 월간 비용
		int totalMonthly = all.stream().mapToInt(Subscription::getMonthlyPrice).sum();
		dashboard.put("totalMonthlySpending", totalMonthly);
		dashboard.put("totalAnnualSpending", totalMonthly * 12);
		dashboard.put("subscriptionCount", all.size());

		// 카테고리별 비용
		Map<String, Integer> categorySpending = all.stream().collect(
				Collectors.groupingBy(Subscription::getCategory, Collectors.summingInt(Subscription::getMonthlyPrice)));
		dashboard.put("categoryBreakdown", categorySpending);

		// 전체 ROI 분석 요약
		List<Map<String, Object>> analyses = analyzeAll();
		long greenCount = analyses.stream().filter(a -> "GREEN".equals(a.get("signal"))).count();
		long yellowCount = analyses.stream().filter(a -> "YELLOW".equals(a.get("signal"))).count();
		long redCount = analyses.stream().filter(a -> "RED".equals(a.get("signal"))).count();

		Map<String, Long> signalSummary = new LinkedHashMap<>();
		signalSummary.put("green", greenCount);
		signalSummary.put("yellow", yellowCount);
		signalSummary.put("red", redCount);
		dashboard.put("signalSummary", signalSummary);

		// 총 절감 가능액 (공유 최적화 시)
		double totalPossibleSavings = analyses.stream().filter(a -> {
			Map<String, Object> share = (Map<String, Object>) a.get("shareSimulation");
			return (boolean) share.get("available") && (int) share.get("currentUsers") == 1;
		}).mapToDouble(a -> {
			Map<String, Object> share = (Map<String, Object>) a.get("shareSimulation");
			Object savings = share.get("annualSavings");
			return savings instanceof Number ? ((Number) savings).doubleValue() : 0;
		}).sum();
		dashboard.put("totalPossibleAnnualSavings", Math.round(totalPossibleSavings));

		return dashboard;
	}
}
