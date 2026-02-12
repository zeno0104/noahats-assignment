import { useMemo } from "react";

function Dashboard({ dashboard, analyses }) {
  if (!dashboard) return <div className="loading">대시보드 로딩 중...</div>;

  const categoryColors = {
    OTT: "#FF6B6B",
    음악: "#4ECDC4",
    영상: "#FF8E53",
    생산성: "#667EEA",
    클라우드: "#764BA2",
    게임: "#F093FB",
    기타: "#A0AEC0",
  };

  const categoryData = useMemo(() => {
    const breakdown = dashboard.categoryBreakdown || {};
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: categoryColors[category] || "#A0AEC0",
    }));
  }, [dashboard]);

  const signals = dashboard.signalSummary || { green: 0, yellow: 0, red: 0 };

  const topWaste = useMemo(() => {
    return analyses
      .filter((a) => a.signal === "RED")
      .sort((a, b) => b.monthlyPrice - a.monthlyPrice);
  }, [analyses]);

  const topValue = useMemo(() => {
    return analyses
      .filter((a) => a.signal === "GREEN")
      .sort((a, b) => b.roi - a.roi);
  }, [analyses]);

  return (
    <div className="dashboard">
      {/* 요약 카드 */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-label">월간 총 구독비</div>
          <div className="card-value">
            {dashboard.totalMonthlySpending?.toLocaleString()}원
          </div>
          <div className="card-sub">
            연간 {dashboard.totalAnnualSpending?.toLocaleString()}원
          </div>
        </div>

        <div className="summary-card highlight-green">
          <div className="card-label">절감 가능액 (연간)</div>
          <div className="card-value">
            {dashboard.totalPossibleAnnualSavings?.toLocaleString()}원
          </div>
          <div className="card-sub">공유 최적화 시</div>
        </div>

        <div className="summary-card">
          <div className="card-label">구독 서비스 수</div>
          <div className="card-value">{dashboard.subscriptionCount}개</div>
          <div className="card-sub">
            하루 평균{" "}
            {dashboard.totalMonthlySpending
              ? Math.round(dashboard.totalMonthlySpending / 30).toLocaleString()
              : 0}
            원
          </div>
        </div>
      </div>

      {/* 신호등 요약 */}
      <div className="section">
        <h3 className="section-title">구독 건강 상태</h3>
        <div className="signal-summary">
          <div className="signal-card signal-green">
            <div className="signal-dot green"></div>
            <div className="signal-info">
              <div className="signal-count">{signals.green}</div>
              <div className="signal-label">유지 (이득)</div>
            </div>
          </div>
          <div className="signal-card signal-yellow">
            <div className="signal-dot yellow"></div>
            <div className="signal-info">
              <div className="signal-count">{signals.yellow}</div>
              <div className="signal-label">공유 권장</div>
            </div>
          </div>
          <div className="signal-card signal-red">
            <div className="signal-dot red"></div>
            <div className="signal-info">
              <div className="signal-count">{signals.red}</div>
              <div className="signal-label">해지 권장</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* 카테고리 비중 */}
        <div className="section">
          <h3 className="section-title">카테고리별 지출</h3>
          <div className="category-bars">
            {categoryData.map((item) => (
              <div key={item.category} className="category-bar-item">
                <div className="category-bar-header">
                  <span className="category-name">
                    <span
                      className="category-dot"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.category}
                  </span>
                  <span className="category-amount">
                    {item.amount.toLocaleString()}원 ({item.percentage}%)
                  </span>
                </div>
                <div className="category-bar-track">
                  <div
                    className="category-bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주의 필요 구독 */}
        <div className="section">
          <h3 className="section-title">
            {topWaste.length > 0 ? "🚨 해지 추천" : "✅ 모든 구독이 건강합니다"}
          </h3>
          {topWaste.length > 0 ? (
            <div className="alert-list">
              {topWaste.map((item) => (
                <div key={item.id} className="alert-item alert-red">
                  <div className="alert-name">{item.name}</div>
                  <div className="alert-detail">
                    월 {item.monthlyPrice.toLocaleString()}원 ·{" "}
                    {item.usageCount === 0
                      ? "사용 기록 없음"
                      : `ROI ${item.roi}%`}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {topValue.length > 0 && (
            <>
              <h3 className="section-title" style={{ marginTop: "1rem" }}>
                🏆 가성비 최고
              </h3>
              <div className="alert-list">
                {topValue.slice(0, 3).map((item) => (
                  <div key={item.id} className="alert-item alert-green">
                    <div className="alert-name">{item.name}</div>
                    <div className="alert-detail">
                      ROI +{item.roi}% · 1{item.usageUnit}당{" "}
                      {item.costPerUse?.toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
