import { useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" ? (
        <Home onEnterDashboard={() => setPage("dashboard")} />
      ) : (
        <Dashboard onReturnHome={() => setPage("home")} />
      )}
    </>
  );
}
