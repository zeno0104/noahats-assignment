import { useMemo } from "react";

export default function ShareSimulator({ analyses }) {
  const shareable = useMemo(
    () =>
      analyses.filter(
        (a) =>
          a.shareSimulation?.available &&
          a.shareSimulation.currentUsers < a.shareSimulation.maxUsers
      ),
    [analyses]
  );

  const totalMonthly = shareable.reduce(
    (s, a) => s + (a.shareSimulation?.monthlySavings || 0),
    0
  );
  const totalAnnual = totalMonthly * 12;

  const funItems = useMemo(() => {
    const list = [
      { name: "치킨", price: 22000, emoji: "🍗" },
      { name: "커피", price: 4500, emoji: "☕" },
      { name: "영화", price: 15000, emoji: "🎬" },
    ];
    return list
      .map((it) => ({ ...it, count: Math.floor(totalAnnual / it.price) }))
      .filter((it) => it.count > 0);
  }, [totalAnnual]);

  if (analyses.length === 0)
    return (
      <div className="empty">
        <p>분석할 데이터가 없습니다.</p>
      </div>
    );
  if (shareable.length === 0)
    return <div className="empty">✅ 모든 구독이 공유 최적화 상태입니다.</div>;

  return (
    <div>
      <div className="page-top">
        <div>
          <h2 className="page-title">공유 절약 시뮬레이터</h2>
          <p className="page-desc">
            혼자 내는 요금을 친구와 나누면 얼마나 아낄까요?
          </p>
        </div>
      </div>

      <div className="share-hero">
        <div className="share-hero-top">
          <div className="share-hero-icon">💸</div>
          <div>
            <div className="share-hero-label">모두 공유 시 절약 가능 금액</div>
            <div className="share-hero-amount">
              월 {totalMonthly.toLocaleString()}원{" "}
              <span className="share-hero-annual">
                (연 {totalAnnual.toLocaleString()}원)
              </span>
            </div>
          </div>
        </div>
        {funItems.length > 0 && (
          <div className="fun-row">
            {funItems.map((it, i) => (
              <div key={i} className="fun-tag">
                <span>{it.emoji}</span> {it.name} <strong>{it.count}번</strong>{" "}
                가능
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="share-list">
        {shareable.map((item) => {
          const sh = item.shareSimulation;
          const barPct = Math.round(
            (sh.sharedMonthlyPrice / item.convertedPrice) * 100
          );

          return (
            <div key={item.id} className="share-card">
              <h4>
                {item.name}{" "}
                <span className="badge badge-cat">{item.category}</span>
              </h4>
              <div className="share-compare">
                <div className="share-col">
                  <div className="share-col-label">현재 (혼자)</div>
                  <div className="share-col-price">
                    {item.convertedPrice.toLocaleString()}원
                  </div>
                  <div className="share-col-bar">
                    <div
                      className="share-col-bar-fill bar-red"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                <div className="share-arrow">→</div>
                <div className="share-col">
                  <div className="share-col-label">{sh.maxUsers}명 공유 시</div>
                  <div className="share-col-price green">
                    {sh.sharedMonthlyPrice?.toLocaleString()}원
                  </div>
                  <div className="share-col-bar">
                    <div
                      className="share-col-bar-fill bar-green"
                      style={{ width: `${barPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="share-savings">
                <div className="save-row">
                  <span>월 절감액</span>
                  <strong className="green">
                    -{sh.monthlySavings?.toLocaleString()}원
                  </strong>
                </div>
                <div className="save-row">
                  <span>필요 인원</span>
                  <strong>+{sh.maxUsers - sh.currentUsers}명 모집</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
