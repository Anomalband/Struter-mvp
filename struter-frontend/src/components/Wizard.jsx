import React, { useState } from 'react';

const Wizard = ({ onStart, addLog }) => {
  const [formData, setFormData] = useState({
    prompt: '',
    duration: '30',
    platform: 'YouTube Shorts',
    voice: 'Standart (Alloy)'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Test 1: Butona basıldığını tarayıcı konsolunda gör (F12)
    console.log("WIZARD: Butona basıldı. Veri gönderiliyor...", formData);
    
    if (!formData.prompt.trim()) {
      addLog("HATA: Video konusu boş bırakılamaz!", "error");
      return;
    }

    // App.js içindeki handleStart fonksiyonunu çağırıyoruz
    if (typeof onStart === 'function') {
      onStart(formData);
    } else {
      console.error("WIZARD HATASI: onStart bir fonksiyon değil! App.js kontrol edilmeli.");
      addLog("SİSTEM HATASI: Başlatma fonksiyonu bulunamadı.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Video Konusu Nedir?</label>
        <textarea
          className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-4 text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32"
          placeholder="Örn: Yapay zekanın geleceği hakkında gizemli bir video yap..."
          value={formData.prompt}
          onChange={(e) => setFormData({...formData, prompt: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Süre</label>
          <select 
            className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-3 text-zinc-200 outline-none"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
          >
            <option value="15">15 Saniye</option>
            <option value="30">30 Saniye</option>
            <option value="60">60 Saniye</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Platform</label>
          <select 
            className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-3 text-zinc-200 outline-none"
            value={formData.platform}
            onChange={(e) => setFormData({...formData, platform: e.target.value})}
          >
            <option>YouTube Shorts</option>
            <option>TikTok</option>
            <option>Instagram Reels</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Ses Tonu</label>
          <select 
            className="w-full bg-[#09090b] border border-zinc-800 rounded-lg p-3 text-zinc-200 outline-none"
            value={formData.voice}
            onChange={(e) => setFormData({...formData, voice: e.target.value})}
          >
            <option>Standart (Alloy)</option>
            <option>Enerjik (Nova)</option>
            <option>Ciddi (Onyx)</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-[0.98]"
      >
        SİHİRBAZI BAŞLAT (1 KREDİ)
      </button>
    </form>
  );
};

export default Wizard;