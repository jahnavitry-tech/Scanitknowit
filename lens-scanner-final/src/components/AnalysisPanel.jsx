import React from "react";

export default function AnalysisPanel({ result }) {
  if (!result) return <div className="p-4 border rounded-md text-center text-gray-500">No analysis results yet. Upload an image or use camera to scan.</div>;
  
  const getSourceLabel = (source) => {
    switch (source) {
      case "qr": return "QR Code";
      case "ocr": return "Text Recognition";
      case "object": return "Object Detection";
      case "caption": return "AI Description";
      default: return "Unknown";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 border rounded-md space-y-4">
      <h2 className="text-lg font-bold">Analysis Result</h2>
      
      {/* Final Product Name */}
      <div className="p-3 bg-blue-50 rounded border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Identified Product:</span>
          <span className="text-sm text-gray-600">{getSourceLabel(result.source)}</span>
        </div>
        <div className="mt-2 text-lg font-bold text-blue-800">{result.product_name}</div>
        <div className="mt-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Confidence:</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getConfidenceColor(result.confidence)}`}
                style={{ width: `${result.confidence * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 ml-2">{(result.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-3">
        {result.qr_code && (
          <div className="p-2 bg-green-50 rounded border border-green-200">
            <div className="font-semibold text-green-800">QR / Barcode:</div>
            <div className="text-sm break-words">{result.qr_code}</div>
          </div>
        )}

        {result.text && (
          <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
            <div className="font-semibold text-yellow-800">Extracted Text:</div>
            <div className="text-sm break-words">{result.text}</div>
          </div>
        )}

        {result.object && (
          <div className="p-2 bg-purple-50 rounded border border-purple-200">
            <div className="font-semibold text-purple-800">Detected Object:</div>
            <div className="text-sm">{result.object}</div>
            {result.object_confidence && (
              <div className="text-xs text-gray-600 mt-1">
                Confidence: {(result.object_confidence * 100).toFixed(1)}%
              </div>
            )}
          </div>
        )}

        {result.caption && (
          <div className="p-2 bg-indigo-50 rounded border border-indigo-200">
            <div className="font-semibold text-indigo-800">AI Description:</div>
            <div className="text-sm italic">{result.caption}</div>
          </div>
        )}
      </div>

      {/* Debug Info */}
      {result.details && (
        <div className="text-xs text-gray-500 mt-4">
          <div>Analysis Details:</div>
          <div>QR: {result.details.qr_detected ? '✓' : '✗'}</div>
          <div>OCR: {result.details.ocr_extracted ? '✓' : '✗'}</div>
          <div>Object: {result.details.object_detected ? '✓' : '✗'}</div>
          <div>Caption: {result.details.caption_generated ? '✓' : '✗'}</div>
        </div>
      )}
    </div>
  );
}