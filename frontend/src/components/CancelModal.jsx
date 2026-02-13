export default function CancelModal({ data, onClose, onDelete }) {
  if (!data) return null;

  const alts = data.alternatives || [];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box" style={{ maxWidth: 460 }}>
        <div className="modal-top">
          <h3>해지 시뮬레이션</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cancel-body">
          <div className="cancel-icon">🗑️</div>
          <div className="cancel-name">{data.name}</div>
          <div className="cancel-price">
            월 {data.monthlyPrice?.toLocaleString()}원 구독 해지 시
          </div>

          <div className="cancel-savings">
            <div className="cancel-save-card monthly">
              <div className="cancel-save-label">월 절감액</div>
              <div className="cancel-save-amount">
                {data.monthlySaved?.toLocaleString()}원
              </div>
            </div>
            <div className="cancel-save-card annual">
              <div className="cancel-save-label">연간 절감액</div>
              <div className="cancel-save-amount">
                {data.annualSaved?.toLocaleString()}원
              </div>
            </div>
          </div>

          {alts.length > 0 && (
            <>
              <div className="cancel-alt-title">
                💡 해지 대신 이런 방법은 어떨까요?
              </div>
              {alts.map((alt, i) => (
                <div key={i} className="cancel-alt">
                  <div>
                    <div className="cancel-alt-type">{alt.type}</div>
                    <div className="cancel-alt-cost">
                      {alt.description} · 월 {alt.monthlyCost?.toLocaleString()}
                      원
                    </div>
                  </div>
                  <div
                    className={`cancel-alt-save ${
                      alt.savings >= 0 ? "positive" : "negative"
                    }`}
                  >
                    {alt.savings >= 0
                      ? `월 ${alt.savings?.toLocaleString()}원 절약`
                      : `월 ${Math.abs(alt.savings)?.toLocaleString()}원 추가`}
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="cancel-actions">
            <button className="btn btn-outline" onClick={onClose}>
              돌아가기
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(data.id)}
              style={{ flex: 1 }}
            >
              🗑️ 해지하고 {data.monthlySaved?.toLocaleString()}원 절약
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
