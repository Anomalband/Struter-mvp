// frontend/src/components/LiveTerminal.jsx
const LiveTerminal = ({ logs }) => (
  <div className="bg-black border border-zinc-800 rounded-xl h-[600px] flex flex-col font-mono shadow-inner">
    <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
      <span className="text-xs text-zinc-500">CANLI SİSTEM LOGLARI</span>
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
      </div>
    </div>
    <div className="p-4 overflow-y-auto space-y-2 text-xs">
      {logs.map(log => (
        <div key={log.id} className="flex gap-2">
          <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
          <span className={
            log.type === 'error' ? 'text-red-400' : 
            log.type === 'success' ? 'text-emerald-400' : 
            log.type === 'system' ? 'text-blue-400' : 'text-zinc-300'
          }>
            {log.text}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default LiveTerminal;