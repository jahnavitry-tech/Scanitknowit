import React from "react";

const confidenceColor = (confidence) => {
  if (confidence >= 0.9) return "bg-green-500";
  if (confidence >= 0.7) return "bg-yellow-400";
  return "bg-red-400";
};

const icons = {
  QR: "📱",
  OCR_FULL: "📝",
  OCR_CANDIDATE: "🔍",
  Object: "🧩",
  Caption: "✍️",
  OpenFoodFacts: "🛒",
};

const labels = {
  QR: "QR Code",
  OCR_FULL: "Full Text",
  OCR_CANDIDATE: "Product Name",
  Object: "Object Recognition",
  Caption: "AI Caption",
  OpenFoodFacts: "Product Database",
};

const AnalysisPanel = ({ results }) => {
  // Handle both old and new API response formats
  const displayResults = results?.results || results || [];
  const finalProduct = results?.final || null;

  if (!displayResults || displayResults.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md text-center text-gray-500">
        No analysis results yet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md mt-4">
      {finalProduct && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-green-800">
              🎯 Final Product Name
            </span>
            <span className="text-sm text-green-700">
              {(finalProduct.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="text-green-800 font-medium text-lg">
            {finalProduct.value}
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🧩 Analysis Results
      </h2>
      <div className="space-y-3">
        {displayResults.map((item, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">
                {icons[item.source] || "❓"} {labels[item.source] || item.source}
              </span>
              <span className="text-sm text-gray-500">
                {(item.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className={`h-2 ${confidenceColor(item.confidence)} transition-all`}
                style={{ width: `${Math.min(item.confidence * 100, 100)}%` }}
              ></div>
            </div>

            <div className="text-gray-800 text-sm whitespace-pre-wrap break-words">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisPanel;