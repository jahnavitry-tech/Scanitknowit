import React from "react";

const confidenceColor = (confidence) => {
  if (confidence >= 0.9) return "bg-green-500";
  if (confidence >= 0.7) return "bg-yellow-400";
  return "bg-red-400";
};

const icons = {
  qr: "📱",
  ocr: "🔤",
  ocr_full: "🔤",
  object: "🧩",
  caption: "🖼️",
  "blip caption": "🖼️",
};

const labels = {
  qr: "QR Code",
  ocr: "Text Detection",
  ocr_full: "Full Text",
  object: "Object Recognition",
  caption: "AI Caption",
  "blip caption": "AI Caption",
};

const AnalysisPanel = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md text-center text-gray-500">
        No analysis results yet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md mt-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🧩 Analysis Results
      </h2>
      <div className="space-y-3">
        {results.map((item, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">
                {icons[item.source] || "❓"} {labels[item.source] || "Unknown"}
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