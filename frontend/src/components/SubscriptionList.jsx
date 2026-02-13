import { useState } from "react";
import SubscriptionForm from "./SubscriptionForm";

const SIG = {
  GREEN: { emoji: "🟢", label: "적극 활용 중", c: "green" },
  YELLOW: { emoji: "🟡", label: "적정 수준", c: "amber" },
  RED: { emoji: "🔴", label: "활용도 낮음", c: "red" },
  GRAY: { emoji: "⚪", label: "목표 미설정", c: "gray" },
};

export default function SubscriptionList({
  subscriptions,
  analyses,
  onEdit,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  if (!subscriptions.length)
    return (
      <div className="empty">
        <p>등록된 구독이 없습니다.</p>
      </div>
    );

  const getA = (id) => analyses.find((a) => a.id === id);

  return (
    <div className="sub-grid">
      {subscriptions.map((sub) => {
        const a = getA(sub.id);
        const isTargetZero =
          !sub.targetUsageCount || sub.targetUsageCount === 0;
        const s = isTargetZero ? SIG.GRAY : SIG[a?.signal] || SIG.GRAY;
        const isUsd = sub.currency === "USD";

        if (editingId === sub.id) {
          return (
            <div key={sub.id} className="sub-card-edit-wrapper">
              <SubscriptionForm
                initialData={sub}
                onSave={(updated) => {
                  onEdit(updated);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          );
        }

        return (
          <div key={sub.id} className={`sub-card border-${s.c}`}>
            <div className="sub-card-top">
              <div className="sub-card-info">
                <div className={`sub-signal-dot ${s.c}`}>{s.emoji}</div>
                <div>
                  <div className="sub-name">{sub.name}</div>
                  <div className="sub-badges">
                    <span className="badge badge-cat">{sub.category}</span>
                    {s.label && (
                      <span className={`badge badge-${s.c}`}>{s.label}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="sub-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditingId(sub.id)}
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

            <div className="sub-stats">
              <div className="sub-stat">
                <div className="sub-stat-label">월 구독료</div>
                <div className="sub-stat-value">
                  {isUsd
                    ? `$${sub.monthlyPrice.toLocaleString()}`
                    : `${sub.monthlyPrice.toLocaleString()}원`}
                  {isUsd && a?.convertedPrice && (
                    <div
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: "400",
                        color: "#64748b",
                      }}
                    >
                      ≈ {a.convertedPrice.toLocaleString()}원
                    </div>
                  )}
                </div>
              </div>
              <div className="sub-stat">
                <div className="sub-stat-label">사용 / 목표</div>
                <div className="sub-stat-value">
                  {sub.usageCount} / {sub.targetUsageCount || "?"}
                  {sub.usageUnit}
                </div>
              </div>
              <div className="sub-stat">
                <div className="sub-stat-label">1{sub.usageUnit}당 체감가</div>
                <div className="sub-stat-value">
                  {a?.costPerUse > 0
                    ? `${a.costPerUse.toLocaleString()}원`
                    : "—"}
                </div>
              </div>
              <div className="sub-stat">
                <div className="sub-stat-label">목표 달성률</div>
                <div className={`sub-stat-value ${s.c}`}>
                  {sub.targetUsageCount ? `${a?.score}%` : "설정 필요"}
                </div>
              </div>
            </div>
            <div className="sub-tip">
              {!sub.targetUsageCount
                ? "⚙️ [수정]을 눌러 목표를 설정하세요."
                : a?.score >= 100
                ? "🎉 목표 달성! 아주 잘 활용하고 계시네요."
                : `💪 ${sub.targetUsageCount - sub.usageCount}${
                    sub.usageUnit
                  } 더 쓰면 목표 달성!`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
