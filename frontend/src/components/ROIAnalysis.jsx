import { useMemo } from "react";

const SIG = {
  GREEN: { emoji: "🟢", label: "적극 활용 중", cls: "green" },
  YELLOW: { emoji: "🟡", label: "적정 수준", cls: "amber" },
  RED: { emoji: "🔴", label: "활용도 낮음", cls: "red" },
};

export default function ROIAnalysis({ analyses }) {
  const sorted = useMemo(
    () => [...analyses].sort((a, b) => b.score - a.score),
    [analyses]
  );
  // 낭비 금액은 원화 환산 기준으로 계산됨
  const wastedMonthly = analyses
    .filter((a) => a.signal === "RED")
    .reduce((s, a) => s + a.convertedPrice, 0);

  if (analyses.length === 0)
    return (
      <div className="empty">
        <p>데이터가 없습니다</p>
      </div>
    );

  return (
    <div>
      <div className="page-top">
        <div>
          <h2 className="page-title">구독 활용 리포트</h2>
          <p className="page-desc">
            내가 정한 목표만큼 잘 쓰고 있는지 확인하세요
          </p>
        </div>
      </div>

      {wastedMonthly > 0 && (
        <div className="analysis-alert">
          <div className="analysis-alert-icon">💸</div>
          <div className="analysis-alert-text">
            <strong>
              월 {wastedMonthly.toLocaleString()}원이 제대로 활용되지 않고
              있어요!
            </strong>
            <p>
              활용도가 낮은 구독을 정리하면 연간{" "}
              {(wastedMonthly * 12).toLocaleString()}원을 아낄 수 있습니다.
            </p>
          </div>
        </div>
      )}

      <div className="analysis-list">
        {sorted.map((item) => (
          <AnalysisCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function AnalysisCard({ item }) {
  const sig = SIG[item.signal] || SIG.RED;
  const gaugeW = Math.min(item.score || 0, 100);

  return (
    <div className={`analysis-card signal-${sig.cls}`}>
      <div className="analysis-top">
        <div className="analysis-name">
          <span>{sig.emoji}</span>
          <div>
            <h4>{item.name}</h4>
            <span className="badge badge-cat">{item.category}</span>
          </div>
        </div>
        <span className={`badge badge-signal badge-${sig.cls}`}>
          {sig.label}
        </span>
      </div>

      <div className="score-section">
        <div className="score-labels">
          <span>0%</span>
          <span className={`score-value ${sig.cls}`}>
            목표 달성률 {item.score}%
          </span>
          <span>100%+</span>
        </div>
        <div className="score-track" style={{ background: "#e2e8f0" }}>
          <div
            className={`score-fill ${
              sig.cls === "green"
                ? "positive"
                : sig.cls === "amber"
                ? "warning"
                : "negative"
            }`}
            style={{
              width: `${gaugeW}%`,
              height: "100%",
              borderRadius: "4px",
              transition: "width 0.5s",
            }}
          ></div>
        </div>
      </div>

      <div className="detail-rows">
        <div className="detail-row">
          <span>목표 사용량</span>
          <strong>
            {item.targetUsageCount}
            {item.usageUnit}
          </strong>
        </div>
        <div className="detail-row">
          <span>실제 사용량</span>
          <strong>
            {item.usageCount}
            {item.usageUnit}
          </strong>
        </div>
        <div className="detail-row highlight">
          <span>1{item.usageUnit}당 체감 비용</span>
          <strong>{item.costPerUse?.toLocaleString()}원</strong>
        </div>
      </div>
      <div className={`verdict-box ${sig.cls}`}>{item.verdict}</div>
    </div>
  );
}
