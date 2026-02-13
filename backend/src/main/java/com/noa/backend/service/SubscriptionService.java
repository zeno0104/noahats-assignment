package com.noa.backend.service;

import com.noa.backend.entity.Subscription;
import com.noa.backend.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {
	private final SubscriptionRepository repository;
	private final CurrencyService currencyService;

	public SubscriptionService(SubscriptionRepository repository, CurrencyService currencyService) {
		this.repository = repository;
		this.currencyService = currencyService;
	}

	public List<Subscription> findAll() {
		return repository.findAll();
	}

	public Optional<Subscription> findById(Long id) {
		return repository.findById(id);
	}

	public Subscription save(Subscription sub) {
		return repository.save(sub);
	}

	public void deleteById(Long id) {
		repository.deleteById(id);
	}

	private int toWon(double price, String currency) {
		return "USD".equals(currency) ? (int) Math.round(price * currencyService.getUsdToKrwRate()) : (int) price;
	}

	public Map<String, Object> analyzeSubscription(Subscription sub) {
		Map<String, Object> result = new LinkedHashMap<>();
		int wonPrice = toWon(sub.getMonthlyPrice(), sub.getCurrency());

		result.put("id", sub.getId());
		result.put("name", sub.getName());
		result.put("category", sub.getCategory());
		result.put("currency", sub.getCurrency());
		result.put("monthlyPrice", sub.getMonthlyPrice());
		result.put("convertedPrice", wonPrice);
		result.put("usageCount", sub.getUsageCount());
		result.put("usageUnit", sub.getUsageUnit());
		result.put("targetUsageCount", sub.getTargetUsageCount());

		double costPerUse = sub.getUsageCount() > 0 ? (double) wonPrice / sub.getUsageCount() : 0;
		result.put("costPerUse", Math.round(costPerUse));

		double score = sub.getTargetUsageCount() > 0 ? ((double) sub.getUsageCount() / sub.getTargetUsageCount()) * 100
				: 0;
		result.put("score", Math.round(score));

		result.put("signal",
				sub.getUsageCount() == 0 ? "RED" : (score >= 100 ? "GREEN" : (score >= 50 ? "YELLOW" : "RED")));
		result.put("verdict", sub.getUsageCount() == 0 ? "미사용 중입니다." : (score >= 100 ? "목표 달성!" : "분발 필요"));

		int wonSharing = toWon(sub.getSharingPlanPrice(), sub.getCurrency());
		double sharedCost = (sub.getSharingPlanPrice() > 0 && sub.getMaxSharedUsers() > 1)
				? (double) wonSharing / sub.getMaxSharedUsers()
				: 0;

		Map<String, Object> share = new LinkedHashMap<>();
		share.put("available", sub.getSharingPlanPrice() > 0 && sub.getMaxSharedUsers() > 1);
		share.put("maxUsers", sub.getMaxSharedUsers());
		share.put("currentUsers", sub.getCurrentSharedUsers());
		share.put("sharedMonthlyPrice", Math.round(sharedCost));
		share.put("monthlySavings", Math.round(wonPrice - sharedCost));
		share.put("annualSavings", Math.round((wonPrice - sharedCost) * 12));
		result.put("shareSimulation", share);

		return result;
	}

	public List<Map<String, Object>> analyzeAll() {
		return repository.findAll().stream().map(this::analyzeSubscription).collect(Collectors.toList());
	}

	public Map<String, Object> getDashboard() {
		List<Map<String, Object>> analyses = analyzeAll();
		Map<String, Object> dash = new LinkedHashMap<>();
		int totalWon = analyses.stream().mapToInt(a -> (int) a.get("convertedPrice")).sum();
		dash.put("totalMonthlySpending", totalWon);
		dash.put("totalAnnualSpending", totalWon * 12);
		dash.put("subscriptionCount", analyses.size());

		Map<String, Integer> catWon = analyses.stream().collect(Collectors.groupingBy(a -> (String) a.get("category"),
				Collectors.summingInt(a -> (int) a.get("convertedPrice"))));
		dash.put("categoryBreakdown", catWon);

		dash.put("signalSummary",
				Map.of("green", analyses.stream().filter(a -> "GREEN".equals(a.get("signal"))).count(), "yellow",
						analyses.stream().filter(a -> "YELLOW".equals(a.get("signal"))).count(), "red",
						analyses.stream().filter(a -> "RED".equals(a.get("signal"))).count()));

		double savings = analyses.stream().filter(a -> (int) ((Map) a.get("shareSimulation")).get("currentUsers") == 1)
				.mapToDouble(a -> ((Number) ((Map) a.get("shareSimulation")).get("annualSavings")).doubleValue()).sum();
		dash.put("totalPossibleAnnualSavings", Math.round(savings));
		return dash;
	}
}