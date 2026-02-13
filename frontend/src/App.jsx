import { useState, useEffect, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import SubscriptionList from "./components/SubscriptionList";
import SubscriptionForm from "./components/SubscriptionForm";
import UsageReport from "./components/UsageReport";
import ShareSimulator from "./components/ShareSimulator";
import "./App.css";
// const API_BASE =
const API_BASE =
  "https://noaats-assignment-ajh.onrender.com/api/subscriptions" ||
  "http://localhost:8080/api/subscriptions";

// 만약 로컬에서 기능이 제대로 동작하지 않는다면
// const API_BASE에 http://localhost:8080/api/subscriptions만 넣어주시면 됩니다!
function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [subscriptions, setSubscriptions] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [subRes, analysisRes, dashRes] = await Promise.all([
        fetch(API_BASE),
        fetch(`${API_BASE}/analysis`),
        fetch(`${API_BASE}/dashboard`),
      ]);
      setSubscriptions(await subRes.json());
      setAnalyses(await analysisRes.json());
      setDashboard(await dashRes.json());
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (subscription) => {
    try {
      const url = editingItem ? `${API_BASE}/${editingItem.id}` : API_BASE;
      const method = editingItem ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      setShowForm(false);
      setEditingItem(null);
      await fetchData();
    } catch (err) {
      console.error("저장 실패:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };
  const handleEdit = async (data) => {
    try {
      await fetch(`${API_BASE}/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await fetchData();
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };

  const tabs = [
    { id: "dashboard", label: "대시보드", icon: "📊" },
    { id: "subscriptions", label: "내 구독", icon: "📋" },
    { id: "analysis", label: "가성비 분석", icon: "⚡" },
    { id: "share", label: "공유 절약", icon: "👥" },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-left">
            <h1 className="app-title">
              <span className="logo-icon">◎</span> GuDokCheck
            </h1>
            <p className="app-subtitle">내 구독, 진짜 쓸 만큼 쓰고 있을까?</p>
          </div>
        </div>
      </header>

      <div className="layout-center">
        <nav className="tab-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <main className="app-main my-sub">
          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>불러오는 중...</p>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Dashboard dashboard={dashboard} analyses={analyses} />
              )}
              {activeTab === "subscriptions" && (
                <>
                  <div className="page-top">
                    <div>
                      <h2 className="page-title">내 구독 목록</h2>
                      <p className="page-desc">
                        각 구독의 가성비를 한눈에 확인하세요
                      </p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setEditingItem(null);
                        setShowForm(true);
                      }}
                    >
                      + 구독 추가
                    </button>
                  </div>
                  {showForm && (
                    <SubscriptionForm
                      initialData={editingItem}
                      onSave={handleSave}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingItem(null);
                      }}
                    />
                  )}
                  <SubscriptionList
                    subscriptions={subscriptions}
                    analyses={analyses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </>
              )}
              {activeTab === "analysis" && <UsageReport analyses={analyses} />}
              {activeTab === "share" && <ShareSimulator analyses={analyses} />}
            </>
          )}
        </main>
      </div>

      <footer className="app-footer">GuDokCheck</footer>
    </div>
  );
}

export default App;
