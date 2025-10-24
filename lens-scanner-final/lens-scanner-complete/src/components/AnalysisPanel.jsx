export default function AnalysisPanel({ results }) {
  if (!results) return <p>No analysis results yet.</p>;
  if (results.error) return <p>Error: {results.error}</p>;

  return (
    <div className="analysis-panel">
      <h3>Analysis Result</h3>
      <p><strong>Product / Object:</strong> {results.product_name || results.product}</p>
      {results.qr_code && <p><strong>QR / Barcode:</strong> {results.qr_code}</p>}
      {results.text && <p><strong>Text:</strong> {results.text}</p>}
      {results.object && <p><strong>Detected Object:</strong> {results.object}</p>}
      {results.caption && <p><strong>Caption:</strong> {results.caption}</p>}
      {results.confidence && (
        <p>
          <strong>Confidence:</strong> {(results.confidence * 100).toFixed(1)}%
        </p>
      )}
    </div>
  );
}