import React, { useState } from 'react';
import CameraPanel from './components/CameraPanel.jsx';
import AnalysisPanel from './components/AnalysisPanel.jsx';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div className="app-container">
      <h1>🧠 Lens-Style Product/Object Scanner</h1>
      <CameraPanel onResult={setAnalysisResult} />
      <AnalysisPanel result={analysisResult} />
    </div>
  );
}