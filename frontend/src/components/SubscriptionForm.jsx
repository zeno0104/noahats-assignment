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
const UNITS = ["편", "시간", "회", "곡", "건"];

export default function SubscriptionForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "OTT",
    currency: "KRW",
    monthlyPrice: "",
    usageCount: "",
    usageUnit: "편",
    targetUsageCount: "",
    maxSharedUsers: 1,
    currentSharedUsers: 1,
    sharingPlanPrice: "",
    startDate: new Date().toISOString().split("T")[0],
  });

  const [rate, setRate] = useState(1446.2);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data.rates?.KRW) setRate(data.rates.KRW);
      })
      .catch(() => {});

    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({ ...initialData, currency: initialData.currency || "KRW" });
    }
  }, [initialData]);

  const set = (e) => {
    const { name, value } = e.target;
    const numFields = [
      "monthlyPrice",
      "usageCount",
      "targetUsageCount",
      "maxSharedUsers",
      "currentSharedUsers",
      "sharingPlanPrice",
    ];
    setForm((prev) => ({
      ...prev,
      [name]: numFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  const wonPreview =
    form.currency === "USD" && form.monthlyPrice
      ? Math.round(form.monthlyPrice * rate).toLocaleString()
      : null;

  return (
    <div className="form-card">
      <div className="form-top">
        <h3>{initialData ? "구독 수정" : "새 구독 추가"}</h3>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          ✕
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <div className="form-section">
          <div className="form-section-title">기본 정보</div>
          <div className="form-grid">
            <div className="form-group">
              <label>서비스명 *</label>
              <input
                name="name"
                value={form.name}
                onChange={set}
                required
                placeholder="예: 넷플릭스"
              />
            </div>
            <div className="form-group">
              <label>카테고리</label>
              <select name="category" value={form.category} onChange={set}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>결제 통화</label>
              <select name="currency" value={form.currency} onChange={set}>
                <option value="KRW">KRW (원)</option>
                <option value="USD">USD (달러)</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                월 구독료 ({form.currency === "USD" ? "$" : "원"}) *
              </label>
              <input
                type="number"
                step="0.01"
                name="monthlyPrice"
                value={form.monthlyPrice}
                onChange={set}
                required
              />
              {wonPreview && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#2563eb",
                    marginTop: "4px",
                    fontWeight: "600",
                  }}
                >
                  ≈ 약 {wonPreview}원 (현재 환율 {rate.toFixed(2)}원)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">활용도 분석 (목표 설정)</div>
          <div className="form-grid">
            <div className="form-group">
              <label>이번 달 사용량</label>
              <input
                type="number"
                name="usageCount"
                value={form.usageCount}
                onChange={set}
              />
            </div>
            <div className="form-group">
              <label>사용 단위</label>
              <select name="usageUnit" value={form.usageUnit} onChange={set}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group full">
              <label>나의 목표 사용량 (월) *</label>
              <input
                type="number"
                name="targetUsageCount"
                value={form.targetUsageCount}
                onChange={set}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">공유 정보</div>
          <div className="form-grid">
            <div className="form-group">
              <label>최대 공유 인원</label>
              <input
                type="number"
                name="maxSharedUsers"
                value={form.maxSharedUsers}
                onChange={set}
              />
            </div>
            <div className="form-group">
              <label>현재 공유 인원</label>
              <input
                type="number"
                name="currentSharedUsers"
                value={form.currentSharedUsers}
                onChange={set}
              />
            </div>
            <div className="form-group full">
              <label>
                다인용 요금제 총액 ({form.currency === "USD" ? "$" : "원"})
              </label>
              <input
                type="number"
                step="0.01"
                name="sharingPlanPrice"
                value={form.sharingPlanPrice}
                onChange={set}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {initialData ? "수정 완료" : "추가하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
