import React, { useState } from "react";
import CameraPanel from "./components/CameraPanel";
import AnalysisPanel from "./components/AnalysisPanel";

function App() {
  const [results, setResults] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <CameraPanel onAnalysisComplete={setResults} />
      {results && <AnalysisPanel results={results} />}
    </div>
  );
}

export default App;