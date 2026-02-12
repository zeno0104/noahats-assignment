const SIGNAL_MAP = {
  GREEN: { emoji: "🟢", label: "유지", cls: "green" },
  YELLOW: { emoji: "🟡", label: "공유 권장", cls: "amber" },
  RED: { emoji: "🔴", label: "해지 권장", cls: "red" },
};

export default function SubscriptionList({
  subscriptions,
  analyses,
  onEdit,
  onDelete,
}) {
  if (subscriptions.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">📭</div>
        <p>등록된 구독이 없습니다</p>
        <p className="sub-text">"구독 추가" 버튼으로 시작하세요</p>
      </div>
    );
  }

  const getAnalysis = (id) => analyses.find((a) => a.id === id);

  return (
    <div className="sub-grid">
      {subscriptions.map((sub) => {
        const a = getAnalysis(sub.id);
        const sig = SIGNAL_MAP[a?.signal] || {
          emoji: "⚪",
          label: "",
          cls: "",
        };

        return (
          <div key={sub.id} className={`sub-card border-${sig.cls}`}>
            {/* 상단: 이름 + 신호 + 버튼 */}
            <div className="sub-card-top">
              <div className="sub-card-info">
                <div className={`sub-signal-dot ${sig.cls}`}>{sig.emoji}</div>
                <div>
                  <div className="sub-name">{sub.name}</div>
                  <div className="sub-badges">
                    <span className="badge badge-cat">{sub.category}</span>
                    {sig.label && (
                      <span className={`badge badge-signal badge-${sig.cls}`}>
                        {sig.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="sub-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onEdit(sub)}
                >
                  수정
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(sub.id)}
                >
                  삭제
                </button>
              </div>
            </div>

            {/* 핵심 수치 4개 */}
            <div className="sub-stats">
              <div className="sub-stat">
                <div className="sub-stat-label">월 구독료</div>
                <div className="sub-stat-value">
                  {sub.monthlyPrice.toLocaleString()}원
                </div>
              </div>
              <div className="sub-stat">
                <div className="sub-stat-label">이번 달 사용</div>
                <div className="sub-stat-value">
                  {sub.usageCount > 0
                    ? `${sub.usageCount}${sub.usageUnit}`
                    : "미사용"}
                </div>
              </div>
              <div className="sub-stat">
                <div className="sub-stat-label">1{sub.usageUnit}당 비용</div>
                <div className="sub-stat-value">
                  {a?.costPerUse > 0
                    ? `${a.costPerUse.toLocaleString()}원`
                    : "—"}
                </div>
              </div>
              <div className="sub-stat">
                <div className="sub-stat-label">
                  가성비 점수{" "}
                  <span
                    className="info-tip"
                    data-tip="시장가 대비 절약률. 높을수록 이득!"
                  >
                    ⓘ
                  </span>
                </div>
                <div
                  className={`sub-stat-value ${a?.roi >= 0 ? "green" : "red"}`}
                >
                  {a?.usageCount > 0 && a?.roi !== undefined
                    ? `${a.roi > 0 ? "+" : ""}${a.roi}%`
                    : "—"}
                </div>
              </div>
            </div>

            {/* 비교 팁 */}
            {a?.marketComparison && a.usageCount > 0 && (
              <div className="sub-tip">
                💡 {a.marketComparison}({a.marketUnitPrice?.toLocaleString()}원)
                대비{" "}
                {a.roi >= 0 ? (
                  <strong className="green">
                    {sub.usageUnit}당{" "}
                    {(a.marketUnitPrice - a.costPerUse).toLocaleString()}원 절약
                  </strong>
                ) : (
                  <strong className="red">
                    {sub.usageUnit}당{" "}
                    {(a.costPerUse - a.marketUnitPrice).toLocaleString()}원 더
                    비쌈
                  </strong>
                )}
              </div>
            )}

            {a?.usageCount === 0 && (
              <div className="sub-tip">
                ⚠️ 이번 달 사용 기록이 없습니다. 월{" "}
                {sub.monthlyPrice.toLocaleString()}원이 그대로 낭비되고 있어요.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
