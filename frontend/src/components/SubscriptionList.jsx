function SubscriptionList({ subscriptions, analyses, onEdit, onDelete }) {
  if (subscriptions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <p>등록된 구독이 없습니다.</p>
        <p className="empty-sub">위의 "구독 추가" 버튼을 눌러 시작하세요!</p>
      </div>
    );
  }

  const getAnalysis = (id) => analyses.find((a) => a.id === id);

  const signalEmoji = { GREEN: "🟢", YELLOW: "🟡", RED: "🔴" };
  const signalText = { GREEN: "유지", YELLOW: "공유 권장", RED: "해지 권장" };

  return (
    <div className="subscription-list">
      {subscriptions.map((sub) => {
        const analysis = getAnalysis(sub.id);
        return (
          <div
            key={sub.id}
            className={`sub-card signal-border-${
              analysis?.signal?.toLowerCase() || "none"
            }`}
          >
            <div className="sub-card-header">
              <div className="sub-card-title">
                <span className="sub-signal">
                  {signalEmoji[analysis?.signal] || "⚪"}
                </span>
                <div>
                  <h4>{sub.name}</h4>
                  <span className="sub-category-badge">{sub.category}</span>
                  {analysis?.signal && (
                    <span
                      className={`sub-verdict-badge badge-${analysis.signal.toLowerCase()}`}
                    >
                      {signalText[analysis.signal]}
                    </span>
                  )}
                </div>
              </div>
              <div className="sub-card-actions">
                <button
                  className="btn btn-small btn-outline"
                  onClick={() => onEdit(sub)}
                >
                  수정
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => onDelete(sub.id)}
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="sub-card-stats">
              <div className="stat">
                <div className="stat-label">월 구독료</div>
                <div className="stat-value">
                  {sub.monthlyPrice.toLocaleString()}원
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">이번 달 사용</div>
                <div className="stat-value">
                  {sub.usageCount > 0
                    ? `${sub.usageCount}${sub.usageUnit}`
                    : "미사용"}
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">1{sub.usageUnit}당 비용</div>
                <div className="stat-value">
                  {analysis?.costPerUse > 0
                    ? `${analysis.costPerUse.toLocaleString()}원`
                    : "-"}
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">ROI</div>
                <div
                  className={`stat-value ${
                    analysis?.roi >= 0 ? "text-green" : "text-red"
                  }`}
                >
                  {analysis?.roi !== undefined && analysis?.usageCount > 0
                    ? `${analysis.roi > 0 ? "+" : ""}${analysis.roi}%`
                    : "-"}
                </div>
              </div>
            </div>

            {analysis?.marketComparison && analysis.usageCount > 0 && (
              <div className="sub-card-comparison">
                💡 {analysis.marketComparison} (
                {analysis.marketUnitPrice?.toLocaleString()}원) 대비{" "}
                {analysis.roi >= 0 ? (
                  <strong className="text-green">
                    {sub.usageUnit}당{" "}
                    {(
                      analysis.marketUnitPrice - analysis.costPerUse
                    ).toLocaleString()}
                    원 절약
                  </strong>
                ) : (
                  <strong className="text-red">
                    {sub.usageUnit}당{" "}
                    {(
                      analysis.costPerUse - analysis.marketUnitPrice
                    ).toLocaleString()}
                    원 더 비쌈
                  </strong>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SubscriptionList;
