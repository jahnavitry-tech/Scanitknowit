import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function CameraPanel({ onResult }) {
  const fileInputRef = useRef();
  const videoRef = useRef();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    await analyzeImage(file);
  };

  const startCamera = async () => {
    if (navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const capturePhoto = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      setPreview(URL.createObjectURL(blob));
      await analyzeImage(blob);
    });
  };

  const analyzeImage = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/analyze', formData);
      onResult(res.data);
    } catch (err) {
      console.error(err);
      onResult({ error: 'Failed to analyze image' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="camera-panel">
      <div className="preview-container">
        {preview && <img src={preview} alt="Preview" />}
        <video ref={videoRef} style={{ display: 'none' }} />
      </div>
      <div className="controls">
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={capturePhoto}>Capture Photo</button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} />
        {loading && <p>Analyzing...</p>}
      </div>
    </div>
  );
}