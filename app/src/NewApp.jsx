import React, { useState } from "react";
import NewCameraPanel from "./components/NewCameraPanel";
import NewAnalysisPanel from "./components/NewAnalysisPanel";

const NewApp = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        🧠 Yuka-Style Scanner
      </h1>

      <NewCameraPanel onAnalysisComplete={setResult} />
      <NewAnalysisPanel result={result} />
    </div>
  );
};

export default NewApp;