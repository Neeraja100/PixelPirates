import { useEffect, useState } from "react";

import { api } from "./api/client.js";
import LandingPage from "./components/LandingPage.jsx";
import AuthPage from "./components/AuthPage.jsx";
import OnboardingForm from "./components/OnboardingForm.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [step, setStep] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['landing', 'auth', 'onboarding', 'app'].includes(hash)) return hash;
    return localStorage.getItem("financialMirrorSessionId") ? "app" : "landing";
  });
  
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
    // Push the initial state so back-navigating always finds a valid state
    window.history.replaceState({ step }, '', window.location.pathname + '#' + step);
    
    const handlePopState = (e) => {
      if (e.state && e.state.step) {
        setStep(e.state.step);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (['landing', 'auth', 'onboarding', 'app'].includes(hash)) setStep(hash);
        else setStep(localStorage.getItem("financialMirrorSessionId") ? "app" : "landing");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const changeStep = (newStep) => {
    setStep(newStep);
    window.history.pushState({ step: newStep }, '', window.location.pathname + '#' + newStep);
  };

  useEffect(() => {
    if (!sessionId) return;
    refreshSession(sessionId).catch(() => {
      localStorage.removeItem("financialMirrorSessionId");
      setSessionId("");
      changeStep("landing");
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
      // Automatically attempt to fetch insight data if trans exist but no insight exists
      api.personality(id).then(setPersonality).catch(()=>{});
      api.insights(id).then(setInsights).catch(()=>{});
    }
  }

  async function startSession(nextProfile) {
    await run(async () => {
      const response = await api.startSession(nextProfile);
      setProfile(nextProfile);
      setSessionId(response.session_id);
      localStorage.setItem("financialMirrorSessionId", response.session_id);
      localStorage.setItem("financialMirrorProfile", JSON.stringify(nextProfile));
      changeStep("app");
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
      changeStep("landing");
    });
  }

  if (step === "landing") {
    return <LandingPage onStart={() => changeStep("onboarding")} onLogin={() => changeStep("auth")} />;
  }

  if (step === "auth") {
    return <AuthPage onLogin={() => changeStep("onboarding")} onBack={() => window.history.back()} />;
  }

  if (step === "onboarding") {
    return <OnboardingForm onSubmit={startSession} loading={loading} />;
  }

  // Final step: Core Dashboard Experience (Scroll View)
  return (
    <Dashboard 
      metrics={metrics}
      transactions={transactions}
      personality={personality}
      insights={insights}
      actions={actions}
      loading={loading}
      onGenerate={generateAnalysis}
      onRefine={refineInsights}
      onSaveTransactions={saveTransactions}
      onDelete={deleteAllData}
      onAddTransactions={addTransactions}
      onParseText={parseText}
      onUploadStatement={uploadStatement}
    />
  );
}
