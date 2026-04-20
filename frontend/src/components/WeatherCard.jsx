const weatherIcons = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
};

const tempColor = (temp) => {
  if (temp >= 38) return 'text-red-400';
  if (temp >= 30) return 'text-orange-400';
  if (temp >= 20) return 'text-yellow-400';
  if (temp >= 10) return 'text-cyan-400';
  return 'text-blue-400';
};

const bgGradient = (weather) => {
  if (weather?.isStormy) return 'from-slate-800 to-violet-900/40';
  if (weather?.isRaining) return 'from-slate-800 to-blue-900/40';
  if (weather?.description?.includes('cloud')) return 'from-slate-800 to-slate-700';
  return 'from-slate-800 to-amber-900/20';
};

export default function WeatherCard({ location, weather, onRemove }) {
  const icon = weatherIcons[weather?.description?.split(' ').pop()] || '🌡️';

  if (!weather) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-24 mb-3" />
        <div className="h-10 bg-slate-700 rounded w-16 mb-2" />
        <div className="h-3 bg-slate-700 rounded w-32" />
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br ${bgGradient(weather)} border border-slate-700/50 rounded-2xl p-6 group hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20`}>
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={() => onRemove(location)}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-700/0 group-hover:bg-slate-700 text-slate-500 group-hover:text-slate-300 flex items-center justify-center text-xs transition-all duration-200"
        >
          ✕
        </button>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-0.5">📍 {weather.location}</p>
          <p className="text-slate-500 text-xs capitalize">{weather.description}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>

      {/* Temperature */}
      <div className={`text-5xl font-bold ${tempColor(weather.temperature)} mb-4 tabular-nums`} style={{ fontFamily: "'Syne', sans-serif" }}>
        {Math.round(weather.temperature)}°
        <span className="text-2xl text-slate-500 font-normal">C</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-700/50">
        <Stat icon="🌡️" label="Feels" value={`${Math.round(weather.feelsLike)}°`} />
        <Stat icon="💧" label="Humidity" value={`${weather.humidity}%`} />
        <Stat icon="💨" label="Wind" value={`${weather.windSpeed}m/s`} />
      </div>

      {/* Alert badges */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {weather.isRaining && (
          <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">🌧 Rain</span>
        )}
        {weather.isStormy && (
          <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full">⛈ Storm</span>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="text-center">
      <p className="text-slate-500 text-xs mb-0.5">{icon} {label}</p>
      <p className="text-slate-300 text-sm font-semibold">{value}</p>
    </div>
  );
}
