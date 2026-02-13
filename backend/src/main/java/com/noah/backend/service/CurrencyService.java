package com.noah.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class CurrencyService {
	private static final String API_URL = "https://api.exchangerate-api.com/v4/latest/USD";
	private final RestTemplate restTemplate = new RestTemplate();
	private Double cachedRate = 1450.0;
	private long lastFetchTime = 0;

	public double getUsdToKrwRate() {
		if (System.currentTimeMillis() - lastFetchTime > 3600000) {
			fetchRate();
		}
		return cachedRate;
	}

	private void fetchRate() {
		try {
			Map response = restTemplate.getForObject(API_URL, Map.class);
			if (response != null && response.containsKey("rates")) {
				Map<String, Object> rates = (Map<String, Object>) response.get("rates");
				Object krwRate = rates.get("KRW");
				if (krwRate instanceof Number) {
					this.cachedRate = ((Number) krwRate).doubleValue();
					this.lastFetchTime = System.currentTimeMillis();
				}
			}
		} catch (Exception e) {
			System.err.println("환율 API 호출 실패: " + e.getMessage());
		}
	}
}