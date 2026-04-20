import { useState } from 'react';
import { weatherAPI } from '../api/api';

export default function AddLocationModal({ onClose, onAdd }) {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Validate location exists by fetching weather
      await weatherAPI.getWeather(location.trim());
      onAdd(location.trim());
      onClose();
    } catch {
      setError('Location not found. Try a city name like "Paris" or "New York".');
    } finally {
      setLoading(false);
    }
  };

  const quickLocations = ['London', 'Tokyo', 'New York', 'Paris', 'Sydney', 'Dubai'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Add Location</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors">✕</button>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleAdd}>
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Enter city name..."
            autoFocus
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all mb-3"
          />

          {/* Quick picks */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickLocations.map(loc => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocation(loc)}
                className="text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:text-blue-400 text-slate-400 rounded-full transition-all"
              >
                {loc}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !location.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-all"
          >
            {loading ? 'Checking location...' : 'Add Location'}
          </button>
        </form>
      </div>
    </div>
  );
}
