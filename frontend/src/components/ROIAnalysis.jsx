import { useMemo } from "react";

function ROIAnalysis({ analyses }) {
  const sorted = useMemo(() => {
    return [...analyses].sort((a, b) => {
      const order = { RED: 0, YELLOW: 1, GREEN: 2 };
      return (order[a.signal] || 3) - (order[b.signal] || 3);
    });
  }, [analyses]);

  const totalMonthly = analyses.reduce((sum, a) => sum + a.monthlyPrice, 0);
  const wastedMonthly = analyses
    .filter((a) => a.signal === "RED")
    .reduce((sum, a) => sum + a.monthlyPrice, 0);

  if (analyses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <p>분석할 구독이 없습니다.</p>
        <p className="empty-sub">"내 구독" 탭에서 구독을 추가해주세요.</p>
      </div>
    );
  }

  return (
    <div className="roi-analysis">
      <div className="page-header">
        <h2>ROI 분석 리포트</h2>
        <p className="page-desc">
          각 구독이 시장 대안 대비 이득인지 손해인지 분석합니다
        </p>
      </div>

      {/* 요약 경고 */}
      {wastedMonthly > 0 && (
        <div className="roi-alert">
          <div className="roi-alert-icon">🚨</div>
          <div className="roi-alert-content">
            <strong>
              월 {wastedMonthly.toLocaleString()}원이 낭비되고 있습니다
            </strong>
            <p>
              전체 구독비의 {Math.round((wastedMonthly / totalMonthly) * 100)}
              %가 해지 권장 항목입니다. 연간{" "}
              {(wastedMonthly * 12).toLocaleString()}원을 아낄 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 분석 카드들 */}
      <div className="analysis-cards">
        {sorted.map((item) => (
          <AnalysisCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function AnalysisCard({ item }) {
  const signalConfig = {
    GREEN: { emoji: "🟢", label: "유지", className: "green", bg: "#f0fdf4" },
    YELLOW: {
      emoji: "🟡",
      label: "공유 권장",
      className: "yellow",
      bg: "#fefce8",
    },
    RED: { emoji: "🔴", label: "해지 권장", className: "red", bg: "#fef2f2" },
  };

  const config = signalConfig[item.signal] || signalConfig.RED;
  const share = item.shareSimulation;

  // ROI 게이지 계산 (-100 ~ 100 범위로 정규화)
  const gaugeWidth = Math.min(Math.max(item.roi, -100), 100);

  return (
    <div
      className="analysis-card"
      style={{ borderLeftColor: `var(--color-${config.className})` }}
    >
      <div className="analysis-card-header">
        <div className="analysis-title">
          <span className="analysis-signal">{config.emoji}</span>
          <div>
            <h4>{item.name}</h4>
            <span className="sub-category-badge">{item.category}</span>
          </div>
        </div>
        <div className={`analysis-verdict badge-${config.className}`}>
          {config.label}
        </div>
      </div>

      {/* ROI 게이지 */}
      <div className="roi-gauge-section">
        <div className="roi-gauge-labels">
          <span>손해</span>
          <span
            className="roi-gauge-value"
            style={{ color: `var(--color-${config.className})` }}
          >
            ROI {item.roi > 0 ? "+" : ""}
            {item.roi}%
          </span>
          <span>이득</span>
        </div>
        <div className="roi-gauge-track">
          <div className="roi-gauge-center"></div>
          {gaugeWidth >= 0 ? (
            <div
              className="roi-gauge-fill roi-gauge-positive"
              style={{ width: `${gaugeWidth / 2}%`, left: "50%" }}
            ></div>
          ) : (
            <div
              className="roi-gauge-fill roi-gauge-negative"
              style={{ width: `${Math.abs(gaugeWidth) / 2}%`, right: "50%" }}
            ></div>
          )}
        </div>
      </div>

      {/* 비용 분석 상세 */}
      <div className="analysis-details">
        <div className="detail-row">
          <span>월 구독료</span>
          <strong>{item.monthlyPrice.toLocaleString()}원</strong>
        </div>
        {item.usageCount > 0 ? (
          <>
            <div className="detail-row">
              <span>이번 달 사용량</span>
              <strong>
                {item.usageCount}
                {item.usageUnit}
              </strong>
            </div>
            <div className="detail-row highlight">
              <span>1{item.usageUnit}당 비용</span>
              <strong>{item.costPerUse?.toLocaleString()}원</strong>
            </div>
            {item.marketUnitPrice > 0 && (
              <div className="detail-row">
                <span>{item.marketComparison} 가격</span>
                <strong>
                  {item.marketUnitPrice?.toLocaleString()}원/{item.usageUnit}
                </strong>
              </div>
            )}
          </>
        ) : (
          <div className="detail-row highlight text-red">
            <span>사용 기록</span>
            <strong>없음 — 구독료 전액 낭비</strong>
          </div>
        )}
        <div className="detail-row">
          <span>연간 비용</span>
          <strong>{item.annualCost?.toLocaleString()}원</strong>
        </div>
      </div>

      {/* 공유 최적화 제안 */}
      {share?.available && share.currentUsers === 1 && (
        <div className="share-suggestion">
          <div className="share-suggestion-header">💡 공유하면?</div>
          <div className="share-suggestion-body">
            <p>
              <strong>{share.maxUsers}명</strong> 공유 시 월{" "}
              <strong className="text-green">
                {share.sharedMonthlyPrice?.toLocaleString()}원
              </strong>{" "}
              (현재 대비{" "}
              <strong className="text-green">
                월 {share.monthlySavings?.toLocaleString()}원 절약
              </strong>
              )
            </p>
            <p className="share-annual">
              → 연간 <strong>{share.annualSavings?.toLocaleString()}원</strong>{" "}
              절감 가능
            </p>
          </div>
        </div>
      )}

      {/* 판정 메시지 */}
      <div className={`analysis-verdict-msg verdict-${config.className}`}>
        {item.verdict}
      </div>
    </div>
  );
}

export default ROIAnalysis;
