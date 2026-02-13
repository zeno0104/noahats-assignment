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
        <p>로딩 중...</p>
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
        .sort((a, b) => a.score - b.score),
    [analyses]
  );

  const topValue = useMemo(
    () =>
      analyses
        .filter((a) => a.signal === "GREEN")
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [analyses]
  );

  return (
    <div className="dashboard">
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
          <div className="dash-card-label">공유 절약 가능액</div>
          <div className="dash-card-value">
            {dashboard.totalPossibleAnnualSavings?.toLocaleString()}원
          </div>
          <div className="dash-card-sub">파티원 모집 시 (연간)</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">구독 개수</div>
          <div className="dash-card-value">{dashboard.subscriptionCount}개</div>
          <div className="dash-card-sub">
            평균{" "}
            {dashboard.totalMonthlySpending
              ? Math.round(
                  dashboard.totalMonthlySpending / dashboard.subscriptionCount
                ).toLocaleString()
              : 0}
            원
          </div>
        </div>
      </div>

      <div className="signal-bars">
        <div className="signal-bar">
          <div className="signal-indicator green">🟢</div>
          <div>
            <div className="signal-count">{signals.green}</div>
            <div className="signal-name">적극 활용</div>
          </div>
        </div>
        <div className="signal-bar">
          <div className="signal-indicator amber">🟡</div>
          <div>
            <div className="signal-count">{signals.yellow}</div>
            <div className="signal-name">적정 사용</div>
          </div>
        </div>
        <div className="signal-bar">
          <div className="signal-indicator red">🔴</div>
          <div>
            <div className="signal-count">{signals.red}</div>
            <div className="signal-name">분발 필요</div>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-section">
          <div className="dash-section-title">
            📂 카테고리별 지출 (원화 기준)
          </div>
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

        <div className="dash-section">
          {redItems.length > 0 && (
            <>
              <div className="dash-section-title">🚨 해지 검토 (목표 미달)</div>
              {redItems.map((item) => (
                <div key={item.id} className="alert-item red">
                  <div className="alert-name">{item.name}</div>
                  <div className="alert-detail">
                    월 {item.monthlyPrice.toLocaleString()}원 ·
                    {item.usageCount === 0
                      ? " 미사용"
                      : ` 목표 달성률 ${item.score}%`}
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
                🏆 베스트 활용
              </div>
              {topValue.map((item) => (
                <div key={item.id} className="alert-item green">
                  <div className="alert-name">{item.name}</div>
                  <div className="alert-detail">
                    목표 달성률 {item.score}% · 1{item.usageUnit}당{" "}
                    {item.costPerUse?.toLocaleString()}원
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
