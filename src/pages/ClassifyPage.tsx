import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import { useNavigate } from 'react-router-dom';

const URL = "https://teachablemachine.withgoogle.com/models/n4-Fnzy4o/";

const ClassifyPage = () => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);

  // Upload prediction
  const [imagePrediction, setImagePrediction] = useState<any[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  // Camera prediction
  const [cameraPrediction, setCameraPrediction] = useState<any[]>([]);
  const webcamRef = useRef<tmImage.Webcam | null>(null);
  const cameraRunningRef = useRef(false);
  const cameraContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  /* =========================
     LOAD MODEL
  ========================= */
  useEffect(() => {
    const loadModel = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  /* =========================
     IMAGE AUGMENTATION
  ========================= */
  const augmentImage = (img: HTMLImageElement | HTMLCanvasElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = img.width;
    canvas.height = img.height;

    // Random horizontal flip
    const flip = Math.random() > 0.5;
    if (flip) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Random brightness & contrast
    const brightness = 0.9 + Math.random() * 0.2; // 0.9–1.1
    const contrast = 0.9 + Math.random() * 0.2;

    ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    return canvas;
  };

  /* =========================
     IMAGE UPLOAD LOGIC
  ========================= */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    stopCamera();

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const predictImage = async () => {
    if (!model || !imageRef.current) return;

    // 🔥 APPLY AUGMENTATION
    const augmentedCanvas = augmentImage(imageRef.current);
    const predictions = await model.predict(augmentedCanvas);

    setImagePrediction(
      predictions.sort((a, b) => b.probability - a.probability)
    );
  };

  /* =========================
     LIVE CAMERA LOGIC
  ========================= */
  const startCamera = async () => {
    if (!model || cameraRunningRef.current) return;

    setImagePrediction([]);
    cameraRunningRef.current = true;

    const webcam = new tmImage.Webcam(480, 360, true);
    await webcam.setup();
    await webcam.play();

    webcamRef.current = webcam;

    if (cameraContainerRef.current) {
      cameraContainerRef.current.innerHTML = '';
      cameraContainerRef.current.appendChild(webcam.canvas);

      webcam.canvas.style.width = '100%';
      webcam.canvas.style.maxWidth = '520px';
      webcam.canvas.style.height = 'auto';
      webcam.canvas.style.borderRadius = '16px';
    }

    loop();
  };

  const loop = async () => {
    if (!cameraRunningRef.current || !webcamRef.current || !model) return;

    webcamRef.current.update();

    // 🔥 APPLY AUGMENTATION TO CAMERA FRAME
    const augmentedCanvas = augmentImage(webcamRef.current.canvas);
    const predictions = await model.predict(augmentedCanvas);

    setCameraPrediction(
      predictions.sort((a, b) => b.probability - a.probability)
    );

    requestAnimationFrame(loop);
  };

  const stopCamera = () => {
    cameraRunningRef.current = false;
    webcamRef.current?.stop();
    webcamRef.current = null;
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-8 flex flex-col items-center">
      <button onClick={() => navigate('/')} className="self-start mb-6 font-bold">
        ← Back
      </button>

      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-6xl w-full grid lg:grid-cols-2 gap-10">

        {/* IMAGE UPLOAD */}
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">📁 Upload Image</h2>
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          <img
            ref={imageRef}
            onLoad={predictImage}
            className="mt-4 rounded-lg max-h-48 mx-auto"
            alt=""
          />

          {imagePrediction.length > 0 && (
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-emerald-600">
                {imagePrediction[0].className}
              </h3>
              <p>{(imagePrediction[0].probability * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>

        {/* LIVE CAMERA */}
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">🎥 Live Camera</h2>

          <div
            ref={cameraContainerRef}
            className="flex justify-center mb-4 w-full bg-black rounded-2xl overflow-hidden"
          />

          <div className="flex justify-center gap-4">
            <button
              onClick={startCamera}
              className="bg-emerald-600 text-white px-4 py-2 rounded-full"
            >
              Start
            </button>

            <button
              onClick={stopCamera}
              className="bg-red-500 text-white px-4 py-2 rounded-full"
            >
              Stop
            </button>
          </div>

          {cameraPrediction.length > 0 && (
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-emerald-600">
                {cameraPrediction[0].className}
              </h3>
              <p>{(cameraPrediction[0].probability * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassifyPage;
