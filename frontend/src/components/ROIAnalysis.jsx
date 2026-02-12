import { useMemo } from "react";

const SIG = {
  GREEN: { emoji: "🟢", label: "유지", cls: "green" },
  YELLOW: { emoji: "🟡", label: "공유 권장", cls: "amber" },
  RED: { emoji: "🔴", label: "해지 권장", cls: "red" },
};

export default function ROIAnalysis({ analyses }) {
  const sorted = useMemo(
    () =>
      [...analyses].sort((a, b) => {
        const o = { RED: 0, YELLOW: 1, GREEN: 2 };
        return (o[a.signal] ?? 3) - (o[b.signal] ?? 3);
      }),
    [analyses]
  );

  const totalMonthly = analyses.reduce((s, a) => s + a.monthlyPrice, 0);
  const wastedMonthly = analyses
    .filter((a) => a.signal === "RED")
    .reduce((s, a) => s + a.monthlyPrice, 0);

  if (analyses.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">⚡</div>
        <p>분석할 구독이 없습니다</p>
        <p className="sub-text">"내 구독" 탭에서 추가해주세요</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-top">
        <div>
          <h2 className="page-title">가성비 분석 리포트</h2>
          <p className="page-desc">
            각 구독이 시장 대안 대비 이득인지 손해인지, 점수로 보여드립니다
          </p>
        </div>
      </div>

      {wastedMonthly > 0 && (
        <div className="analysis-alert">
          <div className="analysis-alert-icon">🚨</div>
          <div className="analysis-alert-text">
            <strong>
              월 {wastedMonthly.toLocaleString()}원이 낭비되고 있습니다
            </strong>
            <p>
              전체 구독비의 {Math.round((wastedMonthly / totalMonthly) * 100)}
              %가 해지 권장 항목입니다. 지금 정리하면 연간{" "}
              {(wastedMonthly * 12).toLocaleString()}원을 아낄 수 있어요.
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
  const share = item.shareSimulation;
  const gaugeW = Math.min(Math.max(item.roi, -100), 100);

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

      {/* 가성비 점수 게이지 */}
      <div className="score-section">
        <div className="score-labels">
          <span>손해</span>
          <span className={`score-value ${sig.cls}`}>
            가성비 점수 {item.roi > 0 ? "+" : ""}
            {item.roi}%
          </span>
          <span>이득</span>
        </div>
        <div className="score-track">
          <div className="score-track-center"></div>
          {gaugeW >= 0 ? (
            <div
              className="score-fill positive"
              style={{ width: `${gaugeW / 2}%` }}
            ></div>
          ) : (
            <div
              className="score-fill negative"
              style={{ width: `${Math.abs(gaugeW) / 2}%` }}
            ></div>
          )}
        </div>
      </div>

      {/* 상세 수치 */}
      <div className="detail-rows">
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
          <div className="detail-row highlight">
            <span>사용 기록</span>
            <strong className="red">없음 — 구독료 전액 낭비</strong>
          </div>
        )}
        <div className="detail-row">
          <span>연간 비용</span>
          <strong>{item.annualCost?.toLocaleString()}원</strong>
        </div>
      </div>

      {/* 공유 제안 */}
      {share?.available && share.currentUsers === 1 && (
        <div className="share-tip">
          <div className="share-tip-title">💡 공유하면?</div>
          <p>
            <strong>{share.maxUsers}명</strong> 공유 시 월{" "}
            <strong className="green">
              {share.sharedMonthlyPrice?.toLocaleString()}원
            </strong>{" "}
            · 월{" "}
            <strong className="green">
              {share.monthlySavings?.toLocaleString()}원 절약
            </strong>
          </p>
          <p className="annual">
            → 연간 {share.annualSavings?.toLocaleString()}원 절감
          </p>
        </div>
      )}

      <div className={`verdict-box ${sig.cls}`}>{item.verdict}</div>
    </div>
  );
}
