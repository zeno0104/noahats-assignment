package com.noah.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subscriptions")
public class Subscription {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name; // 구독 서비스명 (넷플릭스, 유튜브 등)
	private String category; // 카테고리 (OTT, 음악, 클라우드, 생산성, 게임, 기타)
	private int monthlyPrice; // 월 구독료 (원)
	private int usageCount; // 이번 달 사용 횟수
	private String usageUnit; // 사용 단위 (편, 시간, 회)
	private int marketUnitPrice; // 시장 단건 가격 (영화관 15000원 등)
	private String marketComparison; // 비교 대상명 (영화관, 음원구매, PC방 등)
	private int maxSharedUsers; // 최대 공유 가능 인원
	private int currentSharedUsers; // 현재 공유 인원 (1 = 혼자 사용)
	private int sharingPlanPrice; // 공유 요금제 가격 (없으면 0)
	private String startDate; // 구독 시작일 (yyyy-MM-dd)

	public Subscription() {
	}

	// Getters and Setters
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

	public int getMonthlyPrice() {
		return monthlyPrice;
	}

	public void setMonthlyPrice(int monthlyPrice) {
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

	public int getMarketUnitPrice() {
		return marketUnitPrice;
	}

	public void setMarketUnitPrice(int marketUnitPrice) {
		this.marketUnitPrice = marketUnitPrice;
	}

	public String getMarketComparison() {
		return marketComparison;
	}

	public void setMarketComparison(String marketComparison) {
		this.marketComparison = marketComparison;
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

	public int getSharingPlanPrice() {
		return sharingPlanPrice;
	}

	public void setSharingPlanPrice(int sharingPlanPrice) {
		this.sharingPlanPrice = sharingPlanPrice;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
}
