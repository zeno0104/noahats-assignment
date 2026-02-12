import { useMemo } from "react";

const CATEGORY_COLORS = {
  OTT: "#f43f5e",
  음악: "#06b6d4",
  영상: "#f97316",
  생산성: "#8b5cf6",
  클라우드: "#6366f1",
  게임: "#ec4899",
  기타: "#94a3b8",
};

export default function Dashboard({ dashboard, analyses }) {
  if (!dashboard)
    return (
      <div className="loading">
        <p>대시보드 로딩 중...</p>
      </div>
    );

  const signals = dashboard.signalSummary || { green: 0, yellow: 0, red: 0 };

  const categoryData = useMemo(() => {
    const breakdown = dashboard.categoryBreakdown || {};
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return Object.entries(breakdown)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        pct: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: CATEGORY_COLORS[category] || "#94a3b8",
      }));
  }, [dashboard]);

  const redItems = useMemo(
    () =>
      analyses
        .filter((a) => a.signal === "RED")
        .sort((a, b) => b.monthlyPrice - a.monthlyPrice),
    [analyses]
  );

  const topValue = useMemo(
    () =>
      analyses
        .filter((a) => a.signal === "GREEN")
        .sort((a, b) => b.roi - a.roi)
        .slice(0, 3),
    [analyses]
  );

  return (
    <div className="dashboard">
      {/* 요약 카드 */}
      <div className="dash-summary">
        <div className="dash-card">
          <div className="dash-card-label">월 구독비 합계</div>
          <div className="dash-card-value">
            {dashboard.totalMonthlySpending?.toLocaleString()}원
          </div>
          <div className="dash-card-sub">
            연간 {dashboard.totalAnnualSpending?.toLocaleString()}원
          </div>
        </div>
        <div className="dash-card accent">
          <div className="dash-card-label">절약 가능액 (연간)</div>
          <div className="dash-card-value">
            {dashboard.totalPossibleAnnualSavings?.toLocaleString()}원
          </div>
          <div className="dash-card-sub">공유 최적화 적용 시</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">하루 평균 구독비</div>
          <div className="dash-card-value">
            {dashboard.totalMonthlySpending
              ? Math.round(dashboard.totalMonthlySpending / 30).toLocaleString()
              : 0}
            원
          </div>
          <div className="dash-card-sub">
            총 {dashboard.subscriptionCount}개 구독 운영 중
          </div>
        </div>
      </div>

      {/* 신호등 요약 */}
      <div className="signal-bars">
        <div className="signal-bar">
          <div className="signal-indicator green">🟢</div>
          <div>
            <div className="signal-count">{signals.green}</div>
            <div className="signal-name">유지 (본전 이상)</div>
          </div>
        </div>
        <div className="signal-bar">
          <div className="signal-indicator amber">🟡</div>
          <div>
            <div className="signal-count">{signals.yellow}</div>
            <div className="signal-name">공유하면 이득</div>
          </div>
        </div>
        <div className="signal-bar">
          <div className="signal-indicator red">🔴</div>
          <div>
            <div className="signal-count">{signals.red}</div>
            <div className="signal-name">해지 권장</div>
          </div>
        </div>
      </div>

      {/* 2열 그리드 */}
      <div className="dash-grid">
        {/* 카테고리별 */}
        <div className="dash-section">
          <div className="dash-section-title">📂 카테고리별 지출</div>
          {categoryData.map((item) => (
            <div key={item.category} className="cat-row">
              <div className="cat-row-top">
                <span className="cat-name">
                  <span
                    className="cat-dot"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.category}
                </span>
                <span className="cat-amount">
                  {item.amount.toLocaleString()}원 · {item.pct}%
                </span>
              </div>
              <div className="cat-track">
                <div
                  className="cat-fill"
                  style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* 주의/추천 */}
        <div className="dash-section">
          {redItems.length > 0 && (
            <>
              <div className="dash-section-title">🚨 해지 추천</div>
              {redItems.map((item) => (
                <div key={item.id} className="alert-item red">
                  <div className="alert-name">{item.name}</div>
                  <div className="alert-detail">
                    월 {item.monthlyPrice.toLocaleString()}원 ·{" "}
                    {item.usageCount === 0
                      ? "사용 기록 없음"
                      : `가성비 점수 ${item.roi}%`}
                  </div>
                </div>
              ))}
            </>
          )}

          {topValue.length > 0 && (
            <>
              <div
                className="dash-section-title"
                style={{ marginTop: redItems.length > 0 ? "1rem" : 0 }}
              >
                🏆 가성비 최고
              </div>
              {topValue.map((item) => (
                <div key={item.id} className="alert-item green">
                  <div className="alert-name">{item.name}</div>
                  <div className="alert-detail">
                    가성비 +{item.roi}% · 1{item.usageUnit}당{" "}
                    {item.costPerUse?.toLocaleString()}원
                  </div>
                </div>
              ))}
            </>
          )}

          {redItems.length === 0 && topValue.length === 0 && (
            <div className="empty">
              <p>분석할 구독을 추가해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
