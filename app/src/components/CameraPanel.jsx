import React, { useRef, useState } from "react";

const CameraPanel = ({ onAnalysisComplete }) => {
  const fileInputRef = useRef();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add image optimization function
  const optimizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 1024;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.85);
      };
      img.src = url;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    
    // Optimize image before upload
    const optimizedFile = await optimizeImage(file);
    setImagePreview(URL.createObjectURL(optimizedFile));

    const formData = new FormData();
    formData.append("file", optimizedFile);

    try {
      // Use environment-aware API endpoint
      // In production, use the Render backend URL
      const apiUrl = import.meta.env.VITE_API_URL || 
        (import.meta.env.DEV ? "http://localhost:3000/api/analyze" : "/api/analyze");
      
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (response.ok) {
        // Pass the results array directly
        onAnalysisComplete(data.results || [{ 
          value: data.product || "Unknown Product", 
          confidence: (data.confidence || 50) / 100,
          source: "combined"
        }]);
      } else {
        setError(data.error || "Failed to analyze image");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mb-4">🧠 Yuka-Style Scanner</h2>

      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-full rounded-xl object-cover border border-gray-200 mb-4"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 mb-4">
          No image selected
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition mb-2"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Scan Now"}
      </button>

      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
      )}
    </div>
  );
};

export default CameraPanel;