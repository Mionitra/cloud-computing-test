const conditionLabels = {
  temp_above: { label: 'Temp Above', icon: '🌡️', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  temp_below: { label: 'Temp Below', icon: '🥶', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  rain: { label: 'Rain Alert', icon: '🌧️', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  storm: { label: 'Storm Alert', icon: '⛈️', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' },
  humidity_above: { label: 'High Humidity', icon: '💧', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' },
};

export default function AlertCard({ alert, onDelete, deleting }) {
  const meta = conditionLabels[alert.condition] || { label: alert.condition, icon: '🔔', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' };

  return (
    <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 hover:border-slate-600 transition-all duration-200 group">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg ${meta.bg} border flex items-center justify-center text-lg flex-shrink-0`}>
          {meta.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">{alert.location}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color}`}>
              {meta.label}
              {alert.threshold ? ` · ${alert.threshold}${alert.condition.includes('humidity') ? '%' : '°C'}` : ''}
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">Active alert — checks every 30 min</p>
        </div>
      </div>

      <button
        onClick={() => onDelete(alert._id)}
        disabled={deleting === alert._id}
        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-500/10 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 text-sm flex-shrink-0"
      >
        {deleting === alert._id ? (
          <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        ) : '✕'}
      </button>
    </div>
  );
}
