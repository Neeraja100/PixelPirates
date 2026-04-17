import { useEffect, useState } from "react";

import { api } from "./api/client.js";
import Dashboard from "./components/Dashboard.jsx";
import DataInput from "./components/DataInput.jsx";
import LandingPage from "./components/LandingPage.jsx";
import OnboardingForm from "./components/OnboardingForm.jsx";

export default function App() {
  const [step, setStep] = useState(() => localStorage.getItem("financialMirrorSessionId") ? "app" : "landing");
  const [sessionId, setSessionId] = useState(() => localStorage.getItem("financialMirrorSessionId") || "");
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("financialMirrorProfile");
    return saved ? JSON.parse(saved) : null;
  });
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [insights, setInsights] = useState(null);
  const [actions, setActions] = useState(null);
  const [nudge, setNudge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    refreshSession(sessionId).catch(() => {
      localStorage.removeItem("financialMirrorSessionId");
      setSessionId("");
      setStep("landing");
    });
  }, [sessionId]);

  async function run(operation) {
    setLoading(true);
    setError("");
    try {
      return await operation();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function refreshSession(id = sessionId) {
    const session = await api.getSession(id);
    setTransactions(session.transactions || []);
    setProfile(session.profile || profile);
    if ((session.transactions || []).length > 0) {
      const latestMetrics = await api.metrics(id);
      setMetrics(latestMetrics);
    }
  }

  async function startSession(nextProfile) {
    await run(async () => {
      const response = await api.startSession(nextProfile);
      setProfile(nextProfile);
      setSessionId(response.session_id);
      localStorage.setItem("financialMirrorSessionId", response.session_id);
      localStorage.setItem("financialMirrorProfile", JSON.stringify(nextProfile));
      setStep("app");
    });
  }

  async function addTransactions(items) {
    if (!items.length) return;
    await run(async () => {
      const response = await api.addTransactions(sessionId, items);
      setTransactions(response.transactions);
      setMetrics(await api.metrics(sessionId));
    });
  }

  async function parseText(text) {
    await run(async () => {
      const response = await api.parseText(sessionId, text);
      setTransactions(response.transactions);
      setMetrics(await api.metrics(sessionId));
    });
  }

  async function uploadStatement(file) {
    await run(async () => {
      const response = await api.uploadStatement(sessionId, file);
      setTransactions(response.transactions);
      setMetrics(await api.metrics(sessionId));
    });
  }

  async function saveTransactions(items) {
    await run(async () => {
      const response = await api.replaceTransactions(sessionId, items);
      setTransactions(response.transactions);
      setMetrics(await api.metrics(sessionId));
      setPersonality(null);
      setInsights(null);
      setActions(null);
    });
  }

  async function generateAnalysis() {
    await run(async () => {
      const [nextMetrics, nextPersonality, nextInsights, nextActions] = await Promise.all([
        api.metrics(sessionId),
        api.personality(sessionId),
        api.insights(sessionId),
        api.actions(sessionId),
      ]);
      setMetrics(nextMetrics);
      setPersonality(nextPersonality);
      setInsights(nextInsights);
      setActions(nextActions.actions);
    });
  }

  async function refineInsights() {
    await run(async () => {
      const nextInsights = await api.insights(sessionId);
      setInsights(nextInsights);
    });
  }

  async function sendNudge() {
    await run(async () => {
      const response = await api.nudge(sessionId);
      setNudge(response);
    });
  }

  async function deleteAllData() {
    await run(async () => {
      if (sessionId) await api.deleteAll(sessionId);
      localStorage.removeItem("financialMirrorSessionId");
      localStorage.removeItem("financialMirrorProfile");
      setSessionId("");
      setProfile(null);
      setTransactions([]);
      setMetrics(null);
      setPersonality(null);
      setInsights(null);
      setActions(null);
      setNudge(null);
      setStep("landing");
    });
  }

  if (step === "landing") {
    return <LandingPage onStart={() => setStep("onboarding")} />;
  }

  if (step === "onboarding") {
    return <OnboardingForm onSubmit={startSession} loading={loading} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e0e", position: "relative" }}>
      {/* Ambient glow - top left */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: "-5%",
          left: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "#8a2be2",
          filter: "blur(180px)",
          opacity: 0.10,
          zIndex: 0,
        }}
      />
      {/* Ambient glow - bottom right */}
      <div
        className="pointer-events-none fixed"
        style={{
          bottom: "0",
          right: "-5%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "#080cff",
          filter: "blur(160px)",
          opacity: 0.07,
          zIndex: 0,
        }}
      />

      {/* App nav */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: "rgba(19,19,19,0.80)",
          backdropFilter: "blur(28px)",
          borderBottom: "1px solid rgba(76,67,84,0.22)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="pulse-dot" />
            <span
              className="gradient-text font-manrope"
              style={{ fontWeight: 700, fontSize: "1.0625rem", letterSpacing: "0.04em" }}
            >
              The Financial Mirror
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {profile?.name && (
              <span
                className="font-inter"
                style={{ fontSize: "0.8125rem", color: "#988ca0" }}
              >
                {profile.name}'s session
              </span>
            )}
            {loading && (
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ffb873",
                  animation: "pulse 1s ease-in-out infinite",
                }}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "2rem 1.5rem 4rem",
        }}
      >
        {/* Page heading */}
        <div style={{ marginBottom: "2rem" }}>
          <p className="overline mb-2">Analysis Dashboard</p>
          <h1
            className="font-manrope"
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "#e5e2e1",
              letterSpacing: "0.01em",
            }}
          >
            {profile?.name ? `${profile.name}'s` : "Your"}{" "}
            <span className="gradient-text">Financial Reflection</span>
          </h1>
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              marginBottom: "1.25rem",
              background: "rgba(255,180,171,0.08)",
              border: "1px solid rgba(255,180,171,0.25)",
              borderRadius: "10px",
              padding: "1rem 1.25rem",
              color: "#ffb4ab",
              fontSize: "0.9375rem",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <DataInput
            onManualSubmit={addTransactions}
            onTextSubmit={parseText}
            onUploadSubmit={uploadStatement}
            loading={loading}
          />
          {transactions.length > 0 && (
            <Dashboard
              metrics={metrics}
              personality={personality}
              insights={insights}
              actions={actions}
              nudge={nudge}
              transactions={transactions}
              onGenerate={generateAnalysis}
              onRefine={refineInsights}
              onNudge={sendNudge}
              onSaveTransactions={saveTransactions}
              onDelete={deleteAllData}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
}
