import React, { useState, useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import { useNavigate } from 'react-router-dom';

const URL = "https://teachablemachine.withgoogle.com/models/n4-Fnzy4o/";

const ClassifyPage = () => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [prediction, setPrediction] = useState<{ className: string; probability: number }[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

  // Load model saat halaman dibuka
  useEffect(() => {
    const loadModel = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const predict = async () => {
    if (model && imageRef.current) {
      const predictions = await model.predict(imageRef.current);
      setPrediction(predictions.sort((a, b) => b.probability - a.probability));
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-8 flex flex-col items-center">
      <button onClick={() => navigate('/')} className="self-start mb-6 text-emerald-700 font-bold">← Back</button>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Classify Waste</h2>
        
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
        />

        {imagePreview && (
          <div className="mt-4">
            <img 
              ref={imageRef} 
              src={imagePreview} 
              alt="Waste" 
              className="rounded-lg max-h-64 mx-auto mb-4" 
              onLoad={predict}
            />
          </div>
        )}

        <div className="mt-6 space-y-2">
          {prediction.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Hasil Deteksi Teratas:</p>
              <h3 className="text-3xl font-bold text-emerald-600">
                {prediction[0].className}
              </h3>
              <p className="text-gray-400">Confidence: {(prediction[0].probability * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassifyPage;