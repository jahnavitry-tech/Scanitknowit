import React, { useRef, useState, useEffect } from "react";

export default function CameraPanel({ onAnalyze }) {
  const [preview, setPreview] = useState(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const fileInputRef = useRef();
  const videoRef = useRef();
  const streamRef = useRef(null);

  // Initialize camera when camera mode is enabled
  useEffect(() => {
    if (cameraMode) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [cameraMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraAllowed(true);
    } catch (err) {
      console.error("Camera access denied", err);
      setCameraAllowed(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files.length) return;
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    onAnalyze(file);
    setCameraMode(false); // Exit camera mode after capture
  };

  const capturePhoto = () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        setPreview(URL.createObjectURL(blob));
        onAnalyze(file);
        setCameraMode(false); // Exit camera mode after capture
      }
    }, "image/jpeg");
  };

  const toggleCameraMode = () => {
    setCameraMode(!cameraMode);
    setPreview(null);
  };

  return (
    <div className="p-4 border rounded-md space-y-4">
      {cameraMode ? (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Camera Mode</h3>
          {cameraAllowed ? (
            <div className="space-y-4">
              <video 
                ref={videoRef} 
                style={{ width: "100%", maxHeight: "300px" }} 
                autoPlay 
                playsInline 
                muted
              />
              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex-1"
                  onClick={capturePhoto}
                >
                  Capture Photo
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded flex-1"
                  onClick={toggleCameraMode}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">
              <p>Camera access denied. Please allow camera permissions.</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={toggleCameraMode}
              >
                Back to File Upload
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Upload Image</h3>
          {preview && <img src={preview} alt="Preview" className="max-h-48 mx-auto border rounded" />}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden"
          />
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded flex-1"
              onClick={() => fileInputRef.current.click()}
            >
              Select Image
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded flex-1"
              onClick={toggleCameraMode}
            >
              Use Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}