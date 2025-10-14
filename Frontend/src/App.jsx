import { useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [view, setView] = useState("home");

  const handleEnterDashboard = () => setView("dashboard");
  const handleReturnHome = () => setView("home");

  return (
    <>
      {view === "home" && <Home onEnter={handleEnterDashboard} />}
      {view === "dashboard" && <Dashboard onReturnHome={handleReturnHome} />}
    </>
  );
}
