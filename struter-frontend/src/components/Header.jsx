// frontend/src/components/Header.jsx
const Header = ({ credits, youtubeStatus }) => (
  <header className="flex justify-between items-center bg-[#121214] border border-zinc-800 p-4 rounded-xl">
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">
        STRUTER <span className="text-xs text-zinc-500">MVP v1.0</span>
      </h1>
    </div>
    
    <div className="flex items-center gap-6">
      {/* YouTube Durumu */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">
        <div className={`w-2 h-2 rounded-full ${youtubeStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'}`}></div>
        <span className="text-xs font-medium text-zinc-300">YouTube: {youtubeStatus === 'connected' ? 'Bağlı' : 'Bağlı Değil'}</span>
      </div>

      {/* Kredi Durumu */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">Kredi:</span>
        <span className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">{credits}</span>
      </div>
    </div>
  </header>
);

export default Header;