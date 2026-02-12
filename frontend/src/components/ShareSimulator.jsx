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
      { name: "아메리카노", price: 4500, emoji: "☕" },
      { name: "영화 관람", price: 15000, emoji: "🎬" },
      { name: "점심 한 끼", price: 10000, emoji: "🍱" },
      { name: "택시 (5km)", price: 8000, emoji: "🚕" },
    ];
    return list
      .map((it) => ({ ...it, count: Math.floor(totalAnnual / it.price) }))
      .filter((it) => it.count > 0);
  }, [totalAnnual]);

  if (analyses.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">👥</div>
        <p>분석할 구독이 없습니다</p>
      </div>
    );
  }

  if (shareable.length === 0) {
    return (
      <>
        <div className="page-top">
          <div>
            <h2 className="page-title">공유 절약 시뮬레이터</h2>
            <p className="page-desc">
              혼자 쓰는 구독을 공유하면 얼마를 아끼는지 계산합니다
            </p>
          </div>
        </div>
        <div className="empty">
          <div className="empty-icon">✅</div>
          <p>공유 최적화 가능한 구독이 없습니다</p>
          <p className="sub-text">
            이미 모두 공유 중이거나, 공유 요금제가 없는 서비스입니다
          </p>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="page-top">
        <div>
          <h2 className="page-title">공유 절약 시뮬레이터</h2>
          <p className="page-desc">
            혼자 쓰는 구독을 공유하면 얼마를 아끼는지 계산합니다
          </p>
        </div>
      </div>

      {/* 히어로 카드 */}
      <div className="share-hero">
        <div className="share-hero-top">
          <div className="share-hero-icon">💸</div>
          <div>
            <div className="share-hero-label">
              모두 공유하면 아낄 수 있는 금액
            </div>
            <div className="share-hero-amount">
              월 {totalMonthly.toLocaleString()}원
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
                <span>{it.emoji}</span>
                {it.name} <strong>{it.count}번</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2열 그리드 카드 */}
      <div className="share-list">
        {shareable
          .sort(
            (a, b) =>
              (b.shareSimulation?.annualSavings || 0) -
              (a.shareSimulation?.annualSavings || 0)
          )
          .map((item) => {
            const sh = item.shareSimulation;
            const needed = sh.maxUsers - sh.currentUsers;
            const barPct = Math.round(
              (sh.sharedMonthlyPrice / item.monthlyPrice) * 100
            );

            return (
              <div key={item.id} className="share-card">
                <h4>
                  {item.name}
                  <span className="badge badge-cat">{item.category}</span>
                </h4>

                {/* 비교 바 */}
                <div className="share-compare">
                  <div className="share-col">
                    <div className="share-col-label">혼자 사용</div>
                    <div className="share-col-price">
                      {item.monthlyPrice.toLocaleString()}원<span>/월</span>
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
                    <div className="share-col-label">{sh.maxUsers}명 공유</div>
                    <div className="share-col-price green">
                      {sh.sharedMonthlyPrice?.toLocaleString()}원
                      <span>/월</span>
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
                    <span>연 절감액</span>
                    <strong className="green">
                      -{sh.annualSavings?.toLocaleString()}원
                    </strong>
                  </div>
                  <div className="save-row">
                    <span>필요 인원</span>
                    <strong>+{needed}명 더 모집</strong>
                  </div>
                </div>

                {item.usageCount > 0 && (
                  <div className="share-unit-box">
                    <div className="share-unit-row">
                      <span>현재 1{item.usageUnit}당</span>
                      <span>{item.costPerUse?.toLocaleString()}원</span>
                    </div>
                    <div className="share-unit-row green">
                      <span>공유 시 1{item.usageUnit}당</span>
                      <span>{sh.sharedCostPerUse?.toLocaleString()}원</span>
                    </div>
                    {sh.sharedRoi > 0 && item.marketComparison && (
                      <div className="share-unit-verdict">
                        📊 공유 시 {item.marketComparison} 대비 가성비 +
                        {sh.sharedRoi}%
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
