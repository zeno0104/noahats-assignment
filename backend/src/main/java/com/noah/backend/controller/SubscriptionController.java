package com.noah.backend.controller;

import com.noah.backend.entity.Subscription;
import com.noah.backend.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

	private final SubscriptionService service;

	public SubscriptionController(SubscriptionService service) {
		this.service = service;
	}

	@GetMapping
	public List<Subscription> getAll() {
		return service.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Subscription> getById(@PathVariable("id") Long id) {
		return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Subscription create(@RequestBody Subscription subscription) {
		return service.save(subscription);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Subscription> update(@PathVariable("id") Long id, @RequestBody Subscription subscription) {
		return service.findById(id).map(existing -> {
			existing.setName(subscription.getName());
			existing.setCategory(subscription.getCategory());
			existing.setMonthlyPrice(subscription.getMonthlyPrice());

			// 👇 환율 정보 업데이트 추가
			existing.setCurrency(subscription.getCurrency());

			existing.setUsageCount(subscription.getUsageCount());
			existing.setUsageUnit(subscription.getUsageUnit());
			existing.setTargetUsageCount(subscription.getTargetUsageCount());
			existing.setMaxSharedUsers(subscription.getMaxSharedUsers());
			existing.setCurrentSharedUsers(subscription.getCurrentSharedUsers());
			existing.setSharingPlanPrice(subscription.getSharingPlanPrice());
			existing.setStartDate(subscription.getStartDate());

			return ResponseEntity.ok(service.save(existing));
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
		if (service.findById(id).isPresent()) {
			service.deleteById(id);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}

	@GetMapping("/analysis")
	public List<Map<String, Object>> getAnalysis() {
		return service.analyzeAll();
	}

	@GetMapping("/{id}/analysis")
	public ResponseEntity<Map<String, Object>> getSubscriptionAnalysis(@PathVariable("id") Long id) {
		return service.findById(id).map(sub -> ResponseEntity.ok(service.analyzeSubscription(sub)))
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/dashboard")
	public Map<String, Object> getDashboard() {
		return service.getDashboard();
	}
}