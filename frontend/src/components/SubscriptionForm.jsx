import { useState, useEffect } from "react";

const CATEGORIES = [
  "OTT",
  "음악",
  "영상",
  "생산성",
  "클라우드",
  "게임",
  "기타",
];
const USAGE_UNITS = ["편", "시간", "회", "곡", "건"];

// 인기 서비스 프리셋 (빠른 입력용)
const PRESETS = [
  {
    name: "넷플릭스 스탠다드",
    category: "OTT",
    monthlyPrice: 17000,
    usageUnit: "편",
    marketUnitPrice: 15000,
    marketComparison: "영화관 관람",
    maxSharedUsers: 2,
    sharingPlanPrice: 17000,
  },
  {
    name: "넷플릭스 프리미엄",
    category: "OTT",
    monthlyPrice: 23000,
    usageUnit: "편",
    marketUnitPrice: 15000,
    marketComparison: "영화관 관람",
    maxSharedUsers: 4,
    sharingPlanPrice: 23000,
  },
  {
    name: "유튜브 프리미엄",
    category: "영상",
    monthlyPrice: 14900,
    usageUnit: "시간",
    marketUnitPrice: 0,
    marketComparison: "",
    maxSharedUsers: 6,
    sharingPlanPrice: 29900,
  },
  {
    name: "스포티파이",
    category: "음악",
    monthlyPrice: 10900,
    usageUnit: "시간",
    marketUnitPrice: 1500,
    marketComparison: "음원 개별 구매",
    maxSharedUsers: 6,
    sharingPlanPrice: 16900,
  },
  {
    name: "멜론",
    category: "음악",
    monthlyPrice: 10900,
    usageUnit: "시간",
    marketUnitPrice: 1500,
    marketComparison: "음원 개별 구매",
    maxSharedUsers: 1,
    sharingPlanPrice: 0,
  },
  {
    name: "티빙 스탠다드",
    category: "OTT",
    monthlyPrice: 13900,
    usageUnit: "편",
    marketUnitPrice: 15000,
    marketComparison: "영화관 관람",
    maxSharedUsers: 4,
    sharingPlanPrice: 13900,
  },
  {
    name: "웨이브",
    category: "OTT",
    monthlyPrice: 10900,
    usageUnit: "편",
    marketUnitPrice: 15000,
    marketComparison: "영화관 관람",
    maxSharedUsers: 4,
    sharingPlanPrice: 10900,
  },
  {
    name: "쿠팡플레이",
    category: "OTT",
    monthlyPrice: 7890,
    usageUnit: "편",
    marketUnitPrice: 15000,
    marketComparison: "영화관 관람",
    maxSharedUsers: 1,
    sharingPlanPrice: 0,
  },
  {
    name: "ChatGPT Plus",
    category: "생산성",
    monthlyPrice: 29900,
    usageUnit: "회",
    marketUnitPrice: 0,
    marketComparison: "",
    maxSharedUsers: 1,
    sharingPlanPrice: 0,
  },
  {
    name: "Adobe Creative Cloud",
    category: "생산성",
    monthlyPrice: 24000,
    usageUnit: "시간",
    marketUnitPrice: 5000,
    marketComparison: "외주 디자인 시급",
    maxSharedUsers: 1,
    sharingPlanPrice: 0,
  },
];

const initialForm = {
  name: "",
  category: "OTT",
  monthlyPrice: "",
  usageCount: "",
  usageUnit: "편",
  marketUnitPrice: "",
  marketComparison: "",
  maxSharedUsers: 1,
  currentSharedUsers: 1,
  sharingPlanPrice: "",
  startDate: new Date().toISOString().split("T")[0],
};

function SubscriptionForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category || "OTT",
        monthlyPrice: initialData.monthlyPrice || "",
        usageCount: initialData.usageCount || "",
        usageUnit: initialData.usageUnit || "편",
        marketUnitPrice: initialData.marketUnitPrice || "",
        marketComparison: initialData.marketComparison || "",
        maxSharedUsers: initialData.maxSharedUsers || 1,
        currentSharedUsers: initialData.currentSharedUsers || 1,
        sharingPlanPrice: initialData.sharingPlanPrice || "",
        startDate:
          initialData.startDate || new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: [
        "monthlyPrice",
        "usageCount",
        "marketUnitPrice",
        "maxSharedUsers",
        "currentSharedUsers",
        "sharingPlanPrice",
      ].includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  const applyPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      ...preset,
      usageCount: prev.usageCount,
      currentSharedUsers: prev.currentSharedUsers,
      startDate: prev.startDate,
    }));
    setShowPresets(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      monthlyPrice: Number(form.monthlyPrice) || 0,
      usageCount: Number(form.usageCount) || 0,
      marketUnitPrice: Number(form.marketUnitPrice) || 0,
      maxSharedUsers: Number(form.maxSharedUsers) || 1,
      currentSharedUsers: Number(form.currentSharedUsers) || 1,
      sharingPlanPrice: Number(form.sharingPlanPrice) || 0,
    });
  };

  return (
    <div className="form-overlay">
      <form className="subscription-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>{initialData ? "구독 수정" : "새 구독 추가"}</h3>
          <button type="button" className="btn-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        {!initialData && (
          <div className="preset-section">
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={() => setShowPresets(!showPresets)}
            >
              ⚡ 인기 서비스 빠른 입력
            </button>
            {showPresets && (
              <div className="preset-list">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    className="preset-item"
                    onClick={() => applyPreset(p)}
                  >
                    {p.name}
                    <span className="preset-price">
                      {p.monthlyPrice.toLocaleString()}원
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="form-section">
          <h4>기본 정보</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>서비스명 *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="예: 넷플릭스"
                required
              />
            </div>
            <div className="form-group">
              <label>카테고리</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>월 구독료 (원) *</label>
              <input
                type="number"
                name="monthlyPrice"
                value={form.monthlyPrice}
                onChange={handleChange}
                placeholder="17000"
                required
              />
            </div>
            <div className="form-group">
              <label>구독 시작일</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>이용률 (ROI 계산용)</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>이번 달 사용 횟수</label>
              <input
                type="number"
                name="usageCount"
                value={form.usageCount}
                onChange={handleChange}
                placeholder="5"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>사용 단위</label>
              <select
                name="usageUnit"
                value={form.usageUnit}
                onChange={handleChange}
              >
                {USAGE_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>시장 단건 가격 (원)</label>
              <input
                type="number"
                name="marketUnitPrice"
                value={form.marketUnitPrice}
                onChange={handleChange}
                placeholder="15000 (영화관 1회)"
              />
            </div>
            <div className="form-group">
              <label>비교 대상</label>
              <input
                type="text"
                name="marketComparison"
                value={form.marketComparison}
                onChange={handleChange}
                placeholder="영화관 관람"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>공유 정보 (절감 계산용)</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>최대 공유 인원</label>
              <input
                type="number"
                name="maxSharedUsers"
                value={form.maxSharedUsers}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>현재 공유 인원</label>
              <input
                type="number"
                name="currentSharedUsers"
                value={form.currentSharedUsers}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="form-group full-width">
              <label>공유 요금제 가격 (원)</label>
              <input
                type="number"
                name="sharingPlanPrice"
                value={form.sharingPlanPrice}
                onChange={handleChange}
                placeholder="23900 (가족 요금제)"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            취소
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? "수정 완료" : "추가하기"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubscriptionForm;
