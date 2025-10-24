import React, { useState } from "react";
import CameraPanel from "./components/CameraPanel";
import AnalysisPanel from "./components/AnalysisPanel";

function App() {
  const [results, setResults] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <CameraPanel onAnalysisComplete={setResults} />
      <AnalysisPanel results={results} />
    </div>
  );
}

export default App;