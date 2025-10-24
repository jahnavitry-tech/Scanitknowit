import { useState, useRef, useEffect } from "react";

export default function CameraPanel({ onResults }) {
  const videoRef = useRef();
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraAllowed(true);
      } catch {
        setCameraAllowed(false);
      }
    }
    startCamera();
  }, []);

  const sendImage = async (blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", blob, "capture.jpg");
    try {
      const res = await fetch("/api/analyze", { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      onResults(data);
    } catch (err) {
      console.error(err);
      onResults({ error: "Failed to analyze image" });
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob(sendImage, "image/jpeg");
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];
    if (file) sendImage(file);
  };

  return (
    <div className="camera-panel">
      {cameraAllowed ? (
        <>
          <video ref={videoRef} style={{ width: "100%" }} autoPlay playsInline />
          <button onClick={capturePhoto} disabled={loading}>
            {loading ? "Scanning..." : "Scan Now"}
          </button>
        </>
      ) : (
        <p>Allow camera access to use this feature</p>
      )}
      <input type="file" accept="image/*" onChange={uploadFile} />
    </div>
  );
}