// src/data/mockData.js
export const initialSubscriptions = [
  {
    id: 1,
    serviceName: "넷플릭스 Premium",
    category: "OTT",
    cost: 17000,
    currency: "KRW",
    billingCycle: "MONTHLY",
    sharedCount: 1,
    usageLog: [], // 날짜 기록
    lastUsedDate: null,
  },
  {
    id: 2,
    serviceName: "유튜브 프리미엄",
    category: "OTT",
    cost: 14900,
    currency: "KRW",
    billingCycle: "MONTHLY",
    sharedCount: 1,
    usageLog: ["2026-02-10", "2026-02-11"],
    lastUsedDate: "2026-02-11",
  },
  {
    id: 3,
    serviceName: "멜론",
    category: "Music",
    cost: 13900,
    currency: "KRW",
    billingCycle: "MONTHLY",
    sharedCount: 1,
    usageLog: [],
    lastUsedDate: null,
  },
];
