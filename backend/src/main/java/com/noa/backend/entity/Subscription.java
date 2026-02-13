package com.noa.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subscriptions")
public class Subscription {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private String category;

	private String currency = "KRW";

	private double monthlyPrice;

	private int usageCount;
	private String usageUnit;
	private int targetUsageCount;
	private int maxSharedUsers;
	private int currentSharedUsers;

	private double sharingPlanPrice;

	private String startDate;

	public Subscription() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public double getMonthlyPrice() {
		return monthlyPrice;
	}

	public void setMonthlyPrice(double monthlyPrice) {
		this.monthlyPrice = monthlyPrice;
	}

	public int getUsageCount() {
		return usageCount;
	}

	public void setUsageCount(int usageCount) {
		this.usageCount = usageCount;
	}

	public String getUsageUnit() {
		return usageUnit;
	}

	public void setUsageUnit(String usageUnit) {
		this.usageUnit = usageUnit;
	}

	public int getTargetUsageCount() {
		return targetUsageCount;
	}

	public void setTargetUsageCount(int targetUsageCount) {
		this.targetUsageCount = targetUsageCount;
	}

	public int getMaxSharedUsers() {
		return maxSharedUsers;
	}

	public void setMaxSharedUsers(int maxSharedUsers) {
		this.maxSharedUsers = maxSharedUsers;
	}

	public int getCurrentSharedUsers() {
		return currentSharedUsers;
	}

	public void setCurrentSharedUsers(int currentSharedUsers) {
		this.currentSharedUsers = currentSharedUsers;
	}

	public double getSharingPlanPrice() {
		return sharingPlanPrice;
	}

	public void setSharingPlanPrice(double sharingPlanPrice) {
		this.sharingPlanPrice = sharingPlanPrice;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
}