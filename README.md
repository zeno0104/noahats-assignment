# ◎ GuDokCheck — 구독 활용 지수 판독기

> **"내 구독 서비스, 진짜 쓸 만큼 쓰고 있을까?"**

GuDokCheck은 사용자의 **주관적인 목표 사용량**과 실제 이용 데이터를 비교 분석하여,
구독의 실질적인 가치를 숫자로 판독해 주는 스마트 구독 관리 솔루션입니다.

---

## 🚀 주요 차별점

**구독 활용 지수 (Score)**
단순한 지출 목록 관리를 넘어, 사용자 목표 대비 실제 이용률을 %로 산출합니다.
100% 초과 달성 시에도 실제 수치를 투명하게 반영합니다.

**실시간 환율 기반 글로벌 분석**
달러($) 결제 서비스 입력 시 외부 API를 통해 실시간 환율을 적용,
원화 환산액을 즉시 계산하여 대시보드에 통합합니다.

**공유 절약 시뮬레이터**
혼자 이용할 때와 다인용 요금제 공유 시의 비용 차이를 분석하여
연간 최대 절감 가능액을 제시합니다.

**데이터 정합성 최적화**
모든 통계 및 합계 계산은 원화(KRW) 기준으로 통합하되,
개별 목록에서는 원본 통화 심볼($, 원)을 유지하여 가독성을 높였습니다.

---

## 🛠 기술 스택

### Backend

| 항목         | 기술                           |
| ------------ | ------------------------------ |
| Framework    | Spring Boot 3.4.2              |
| Language     | Java 21                        |
| Build Tool   | Gradle                         |
| Database     | H2 (In-Memory)                 |
| ORM          | Spring Data JPA                |
| External API | ExchangeRate-API (실시간 환율) |


### Frontend

| 항목    | 기술                  |
| ------- | --------------------- |
| Library | React 19              |
| Bundler | Vite                  |
| Styling | CSS3 (Fintech Design) |

---

## ⚙️ 실행 방법

### 1. Backend (Eclipse IDE)

**프로젝트 불러오기**

Eclipse에서 `File` → `Import` → `Existing Gradle Project`를 선택합니다.
`backend` 폴더를 루트로 지정하여 프로젝트를 불러옵니다.

**실행**

`src/main/java/com/noa/backend/BackendApplication.java` 파일을 우클릭하여
`Run As` → `Spring Boot App`으로 실행합니다.

**H2 Console**

- 접속: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:subscriptiondb`
- User Name: `sa` / Password: (비워둠)

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속 후 서비스를 이용합니다.

🚨 주의사항

<pre>만약 로컬에서 기능이 제대로 동작하지 않는다면 
App.jsx에서 9번 줄에 있는 const API_BASE에 http://localhost:8080/api/subscriptions만 넣어주시면 됩니다!</pre>

---

## 📊 핵심 로직 설명

### 활용 지수 산출

```
활용 지수(%) = (실제 사용량 / 사용자 설정 목표 사용량) × 100
```

| 신호      | 조건                        | 의미         |
| --------- | --------------------------- | ------------ |
| 🟢 GREEN  | 활용 지수 ≥ 100%            | 적극 활용 중 |
| 🟡 YELLOW | 50% ≤ 활용 지수 < 100%      | 적정 수준    |
| 🔴 RED    | 활용 지수 < 50% 또는 미사용 | 활용도 낮음  |

### 실시간 환율 변환

`CurrencyService`에서 외부 환율 API를 호출하고 1시간 주기로 캐싱하여
서버 성능과 데이터 최신성을 동시에 확보했습니다.

### 단위 통합 계산

대시보드의 통계 데이터는 달러와 원화가 혼재되어도
백엔드에서 원화 환산액(`convertedPrice`)을 기준으로 통합 산출하여
정확한 지출 총액을 제공합니다.

---

## 📂 프로젝트 구조

```
root/
├── backend/
│   ├── src/main/java/com/noa/backend/
│   │   ├── controller/      # REST API (대시보드, 분석, CRUD)
│   │   ├── service/
│   │   │   ├── SubscriptionService.java   # 활용 지수 분석 엔진
│   │   │   └── CurrencyService.java       # 환율 API 연동 (1시간 캐싱)
│   │   ├── entity/          # DB 스키마 (Subscription)
│   │   └── repository/      # JPA 데이터 접근
│   └── src/main/resources/
│       └── data.sql         # 초기 샘플 데이터 (6건)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx        # 대시보드 (요약, 신호등, 카테고리)
    │   │   ├── SubscriptionList.jsx # 구독 목록 (2열 그리드, 인라인 수정)
    │   │   ├── SubscriptionForm.jsx # 추가/수정 폼 (통화 토글)
    │   │   ├── UsageReport.jsx      # 활용 리포트 (목표 달성률 게이지)
    │   │   └── ShareSimulator.jsx   # 공유 절약 시뮬레이터
    │   ├── App.jsx          # 네비게이션 및 전역 상태 관리
    │   └── App.css          # Fintech 스타일 가이드
    └── index.html
```

---

## 📮 과제 제출 정보

| 항목          | 내용                                                      |
| ------------- | --------------------------------------------------------- |
| 주제          | 6. 구독 서비스 관리 (구독 비용 분석, 공유 최적화, 이용률) |
| 배포 사이트 | https://noaats-assignment-plum.vercel.app/                |
| 기획서 및 개발문서(Notion) | https://stream-chopper-e5d.notion.site/_-3043121c234280309894dc41939d9dc0 |
