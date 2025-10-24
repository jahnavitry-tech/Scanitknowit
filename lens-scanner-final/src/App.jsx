import React from "react";
import { useState } from "react";
import CameraPanel from "./components/CameraPanel";
import AnalysisPanel from "./components/AnalysisPanel";

export default function App() {
  const [results, setResults] = useState(null);

  return (
    <div className="app-container" style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>🧠 Lens-Style Product/Object Scanner</h1>

      <section style={{ marginTop: 20 }}>
        <CameraPanel onResults={setResults} />
      </section>

      <section style={{ marginTop: 30 }}>
        <AnalysisPanel results={results} />
      </section>
    </div>
  );
}
