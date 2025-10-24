// Simplified App.jsx that integrates CameraPanel and AnalysisPanel
import React, { useState } from "react";
import CameraPanel from "./components/CameraPanel";
import AnalysisPanel from "./components/AnalysisPanel";

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResults = async (file) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const res = await fetch("http://localhost:3007/api/analyze", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults({ error: "Failed to analyze image" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Lens-Style Scanner</h1>
      <CameraPanel onResults={handleResults} />
      <div className="mt-4">
        {loading && <p>Analyzing image...</p>}
        <AnalysisPanel results={results} />
      </div>
    </div>
  );
}