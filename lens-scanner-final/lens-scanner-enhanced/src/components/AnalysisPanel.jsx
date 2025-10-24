import React from 'react';

export default function AnalysisPanel({ result }) {
  if (!result) return <p className="no-results">No analysis results yet.</p>;
  if (result.error) return <p className="error">Error: {result.error}</p>;

  // Function to get confidence color based on score
  const getConfidenceColor = (confidence) => {
    if (!confidence) return '#ccc';
    const score = parseFloat(confidence);
    if (score >= 80) return '#4ade80'; // green
    if (score >= 60) return '#fbbf24'; // yellow
    return '#f87171'; // red
  };

  // Function to render a confidence bar
  const renderConfidenceBar = (confidence) => {
    if (!confidence) return null;
    const score = parseFloat(confidence);
    return (
      <div className="confidence-bar">
        <div 
          className="confidence-fill"
          style={{
            width: `${score}%`,
            backgroundColor: getConfidenceColor(confidence)
          }}
        />
        <span className="confidence-text">{confidence}%</span>
      </div>
    );
  };

  // Determine primary product name
  const productName = result.product || result.object || result.text?.split('\n')[0] || 'Unknown';

  return (
    <div className="analysis-panel">
      <h2>Analysis Result</h2>
      
      {/* Primary Product/Object Identification */}
      <div className="result-section primary-result">
        <h3>Identified Product/Object</h3>
        <p className="product-name">{productName}</p>
        {result.confidence && (
          <div className="confidence-container">
            <label>Confidence:</label>
            {renderConfidenceBar(result.confidence)}
          </div>
        )}
      </div>

      {/* QR/Barcode Detection */}
      <div className="result-section">
        <h3>QR / Barcode</h3>
        <p>{result.qr || 'Not detected'}</p>
        {result.qr && <div className="confidence-container">
          <label>Confidence:</label>
          {renderConfidenceBar('95')}
        </div>}
      </div>

      {/* OCR Text Recognition */}
      <div className="result-section">
        <h3>Text Recognition</h3>
        <p className="ocr-text">{result.text || 'No text detected'}</p>
        {result.text && <div className="confidence-container">
          <label>Confidence:</label>
          {renderConfidenceBar(result.text.length > 50 ? '85' : '70')}
        </div>}
      </div>

      {/* Object Recognition */}
      <div className="result-section">
        <h3>Object Detection</h3>
        <p>{result.object || 'Not detected'}</p>
        {result.object && result.confidence && (
          <div className="confidence-container">
            <label>Confidence:</label>
            {renderConfidenceBar(result.confidence)}
          </div>
        )}
      </div>

      {/* BLIP Caption */}
      <div className="result-section">
        <h3>AI Description</h3>
        <p className="caption-text">{result.caption || 'Not available'}</p>
        {result.caption && <div className="confidence-container">
          <label>Confidence:</label>
          {renderConfidenceBar('75')}
        </div>}
      </div>
    </div>
  );
}