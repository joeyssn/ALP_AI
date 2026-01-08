import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import { useNavigate } from 'react-router-dom';

const URL = "https://teachablemachine.withgoogle.com/models/m0koZxo2e/";

// 1. Definisikan Mapping Instruksi
interface WasteDetail {
  title: string;
  instruction: string;
  color: string;
}

const WASTE_MAP: Record<string, WasteDetail> = {
  Battery: {
    title: "Hazardous Waste (E-Waste)",
    instruction: "Jangan dibuang ke tempat sampah biasa! Baterai mengandung bahan kimia berbahaya. Cari pusat pengumpulan limbah elektronik (e-waste) terdekat.",
    color: "bg-red-100 text-red-700 border-red-200"
  },
  Biological: {
    title: "Organic Waste",
    instruction: "Bisa dijadikan kompos! Pisahkan dari sampah anorganik agar tidak menimbulkan bau dan gas metana di TPA.",
    color: "bg-orange-100 text-orange-700 border-orange-200"
  },
  Cardboard: {
    title: "Recyclable (Paper)",
    instruction: "Pastikan kardus dalam keadaan kering dan lipat hingga pipih untuk menghemat ruang penyimpanan sebelum disetor ke bank sampah.",
    color: "bg-amber-100 text-amber-700 border-amber-200"
  },
  Clothes: {
    title: "Textile Waste",
    instruction: "Jika masih layak, pertimbangkan untuk didonasikan. Jika rusak, serahkan ke pendaur ulang tekstil untuk diolah kembali.",
    color: "bg-purple-100 text-purple-700 border-purple-200"
  },
  Glass: {
    title: "Recyclable (Glass)",
    instruction: "Hati-hati, pastikan tidak pecah. Bilas sisa makanan/minuman yang menempel. Kaca dapat didaur ulang tanpa batas waktu.",
    color: "bg-blue-100 text-blue-700 border-blue-200"
  },
  Metal: {
    title: "Recyclable (Metal)",
    instruction: "Bilas kaleng atau kemasan logam dari sisa isi. Logam memiliki nilai ekonomi tinggi di bank sampah.",
    color: "bg-slate-100 text-slate-700 border-slate-200"
  },
  Paper: {
    title: "Recyclable (Paper)",
    instruction: "Pastikan kertas tidak kotor oleh minyak atau makanan. Kertas yang bersih sangat mudah didaur ulang.",
    color: "bg-sky-100 text-sky-700 border-sky-200"
  },
  Plastic: {
    title: "Recyclable (Plastic)",
    instruction: "Bilas botol, lepaskan label jika memungkinkan, dan remas botol plastik untuk mengurangi volume sampah.",
    color: "bg-teal-100 text-teal-700 border-teal-200"
  },
  Shoe: {
    title: "Non-Organic / Donation",
    instruction: "Sepatu yang masih bagus bisa didonasikan. Jika rusak parah, masuk ke kategori residu atau cari program recycle alas kaki.",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  Trash: {
    title: "Residual Waste",
    instruction: "Ini adalah sampah yang sulit didaur ulang (seperti tisu kotor atau puntung rokok). Buang ke bin sampah umum menuju TPA.",
    color: "bg-gray-100 text-gray-700 border-gray-200"
  }
};

const ClassifyPage = () => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [imagePrediction, setImagePrediction] = useState<any[]>([]);
  const [cameraPrediction, setCameraPrediction] = useState<any[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const webcamRef = useRef<tmImage.Webcam | null>(null);
  const cameraRunningRef = useRef(false);
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModel = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // --- Fungsi Helper untuk Render Instruksi ---
  const renderInstruction = (prediction: any[]) => {
    if (prediction.length === 0) return null;
    
    const topResult = prediction[0];
    // Hanya tampilkan jika confidence > 50% untuk akurasi
    if (topResult.probability < 0.5) return <p className="text-gray-400 italic">Menganalisa...</p>;

    const detail = WASTE_MAP[topResult.className];
    if (!detail) return null;

    return (
      <div className={`mt-6 p-5 rounded-2xl border-2 text-left animate-in fade-in slide-in-from-bottom-2 ${detail.color}`}>
        <h4 className="font-bold text-lg mb-1">{detail.title}</h4>
        <p className="text-sm leading-relaxed">{detail.instruction}</p>
      </div>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    stopCamera();
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (imageRef.current) imageRef.current.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const predictImage = async () => {
    if (!model || !imageRef.current) return;
    const predictions = await model.predict(imageRef.current);
    setImagePrediction(predictions.sort((a, b) => b.probability - a.probability));
  };

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
      webcam.canvas.style.borderRadius = '16px';
    }
    loop();
  };

  const loop = async () => {
    if (!cameraRunningRef.current || !webcamRef.current || !model) return;
    webcamRef.current.update();
    const predictions = await model.predict(webcamRef.current.canvas);
    setCameraPrediction(predictions.sort((a, b) => b.probability - a.probability));
    requestAnimationFrame(loop);
  };

  const stopCamera = () => {
    cameraRunningRef.current = false;
    webcamRef.current?.stop();
    setCameraPrediction([]);
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-8 flex flex-col items-center">
      <button onClick={() => navigate('/')} className="self-start mb-6 font-bold text-emerald-700 hover:underline">
        ← Back to Home
      </button>

      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-6xl w-full grid lg:grid-cols-2 gap-10">
        {/* Kolom Kiri: Upload */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-gray-800">📁 Upload Image</h2>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-emerald-50 file:text-emerald-700"
          />
          <img ref={imageRef} onLoad={predictImage} className="mt-4 rounded-xl max-h-64 object-cover mx-auto" alt="" />
          
          {imagePrediction.length > 0 && (
            <div className="mt-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hasil Deteksi</span>
              <h3 className="text-3xl font-black text-emerald-600">{imagePrediction[0].className}</h3>
              <p className="text-gray-500">Confidence: {(imagePrediction[0].probability * 100).toFixed(1)}%</p>
              {renderInstruction(imagePrediction)}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Kamera */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-gray-800">🎥 Live Camera</h2>
          <div ref={cameraContainerRef} className="flex justify-center mb-4 w-full bg-slate-900 rounded-2xl overflow-hidden shadow-inner min-h-50 items-center text-white italic">
            {!cameraRunningRef.current && "Kamera belum aktif"}
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button onClick={startCamera} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-semibold transition shadow-lg shadow-emerald-200">Start Camera</button>
            <button onClick={stopCamera} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition">Stop</button>
          </div>

          {cameraPrediction.length > 0 && (
            <div className="mt-2 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Deteksi Real-time</span>
              <h3 className="text-3xl font-black text-emerald-600">{cameraPrediction[0].className}</h3>
              <p className="text-gray-500">Confidence: {(cameraPrediction[0].probability * 100).toFixed(1)}%</p>
              {renderInstruction(cameraPrediction)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassifyPage;