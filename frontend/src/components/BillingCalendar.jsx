import { useState, useMemo } from "react";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const SIG_CLS = { GREEN: "green", YELLOW: "amber", RED: "red" };

export default function BillingCalendar({ subs, analyses }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // 구독별 결제일 + 신호 매핑
  const billingMap = useMemo(() => {
    const map = {};
    subs.forEach((sub) => {
      const day = sub.billingDay || 1;
      const actualDay = Math.min(day, daysInMonth);
      if (!map[actualDay]) map[actualDay] = [];
      const a = analyses.find((an) => an.id === sub.id);
      map[actualDay].push({
        id: sub.id,
        name: sub.name,
        price: sub.monthlyPrice,
        signal: a?.signal || "GREEN",
      });
    });
    return map;
  }, [subs, analyses, daysInMonth]);

  // 이번 달 총 결제 예정
  const totalThisMonth = subs.reduce((s, sub) => s + sub.monthlyPrice, 0);

  // 다가오는 결제 (오늘 이후)
  const upcoming = useMemo(() => {
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const isCurrentMonth = year === todayYear && month === todayMonth;

    const items = [];
    subs.forEach((sub) => {
      const day = Math.min(sub.billingDay || 1, daysInMonth);
      const a = analyses.find((an) => an.id === sub.id);
      const daysUntil = isCurrentMonth ? day - todayDay : null;
      if (!isCurrentMonth || daysUntil > 0) {
        items.push({
          id: sub.id,
          name: sub.name,
          price: sub.monthlyPrice,
          day,
          daysUntil: isCurrentMonth ? daysUntil : null,
          signal: a?.signal || "GREEN",
        });
      }
    });
    return items.sort((a, b) => a.day - b.day);
  }, [subs, analyses, year, month, today, daysInMonth]);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };
  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < firstDayOfWeek; i++)
    cells.push(<div key={`e${i}`} className="cal-day empty" />);
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const events = billingMap[d] || [];
    cells.push(
      <div key={d} className={`cal-day${isToday ? " today" : ""}`}>
        <div className="cal-day-num">{d}</div>
        {events.map((ev, i) => (
          <div key={i} className={`cal-event ${SIG_CLS[ev.signal] || ""}`}>
            {ev.name} {ev.price.toLocaleString()}원
          </div>
        ))}
      </div>
    );
  }

  if (!subs.length)
    return (
      <div className="empty">
        <div className="empty-icon">📅</div>
        <p>등록된 구독이 없습니다</p>
      </div>
    );

  return (
    <>
      <div className="cal-header">
        <div className="cal-nav">
          <button onClick={prevMonth}>◀</button>
          <div className="cal-month">
            {year}년 {month + 1}월
          </div>
          <button onClick={nextMonth}>▶</button>
          <button onClick={goToday} style={{ fontSize: ".72rem" }}>
            오늘
          </button>
        </div>
        <div className="cal-summary">
          <div className="cal-sum-chip">
            이번 달 결제:{" "}
            <strong style={{ marginLeft: ".3rem" }}>
              {totalThisMonth.toLocaleString()}원
            </strong>
          </div>
          <div className="cal-sum-chip">구독 {subs.length}개</div>
        </div>
      </div>

      <div className="cal-grid">
        {DAYS.map((d) => (
          <div key={d} className="cal-day-header">
            {d}
          </div>
        ))}
        {cells}
      </div>

      {upcoming.length > 0 && (
        <div className="cal-upcoming">
          <div className="cal-upcoming-title">📌 다가오는 결제 일정</div>
          <div className="cal-upcoming-list">
            {upcoming.map((item) => (
              <div key={item.id} className="cal-up-card">
                <div className="cal-up-day">{item.day}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="cal-up-name">{item.name}</div>
                  <div className="cal-up-price">
                    {item.price.toLocaleString()}원/월
                  </div>
                </div>
                {item.daysUntil !== null && (
                  <div
                    className={`cal-up-dday ${
                      item.daysUntil <= 5 ? "soon" : "normal"
                    }`}
                  >
                    {item.daysUntil <= 0 ? "오늘" : `D-${item.daysUntil}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
