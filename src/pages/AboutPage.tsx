import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white p-10">
      <button onClick={() => navigate('/')} className="mb-6 text-emerald-700 font-bold">← Back</button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-emerald-800 mb-6">Why It Matters?</h1>
        <p className="text-gray-600 leading-relaxed mb-4">
          Indonesia menghasilkan lebih dari 35 juta ton sampah setiap tahunnya. 
          Banyak di antaranya tidak terkelola dengan baik karena kurangnya pemilahan di tingkat rumah tangga.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-emerald-50 rounded-2xl">
            <h3 className="font-bold text-emerald-700">SDG 11</h3>
            <p className="text-sm text-gray-600">Kota dan Pemukiman yang Berkelanjutan.</p>
          </div>
          <div className="p-6 bg-emerald-50 rounded-2xl">
            <h3 className="font-bold text-emerald-700">SDG 12</h3>
            <p className="text-sm text-gray-600">Konsumsi dan Produksi yang Bertanggung Jawab.</p>
          </div>
          <div className="p-6 bg-emerald-50 rounded-2xl">
            <h3 className="font-bold text-emerald-700">SDG 13</h3>
            <p className="text-sm text-gray-600">Penanganan Perubahan Iklim.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;