import { useState } from 'react';

const CONDITIONS = [
  { value: 'temp_above', label: 'Temperature Above', icon: '🌡️', hasThreshold: true, unit: '°C', placeholder: 'e.g. 35' },
  { value: 'temp_below', label: 'Temperature Below', icon: '🥶', hasThreshold: true, unit: '°C', placeholder: 'e.g. 0' },
  { value: 'rain', label: 'Rain Detected', icon: '🌧️', hasThreshold: false },
  { value: 'storm', label: 'Storm Detected', icon: '⛈️', hasThreshold: false },
  { value: 'humidity_above', label: 'Humidity Above', icon: '💧', hasThreshold: true, unit: '%', placeholder: 'e.g. 80' },
];

export default function CreateAlertModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ location: '', condition: 'temp_above', threshold: '' });
  const [error, setError] = useState('');

  const selectedCondition = CONDITIONS.find(c => c.value === form.condition);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.location.trim()) { setError('Please enter a location'); return; }
    if (selectedCondition.hasThreshold && !form.threshold) { setError('Please enter a threshold value'); return; }
    onSubmit({
      location: form.location.trim(),
      condition: form.condition,
      threshold: selectedCondition.hasThreshold ? Number(form.threshold) : 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">New Weather Alert</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors">✕</button>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">📍 Location</label>
            <input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. London, Tokyo, New York"
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">🔔 Alert Condition</label>
            <div className="grid grid-cols-1 gap-2">
              {CONDITIONS.map(c => (
                <label key={c.value} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${form.condition === c.value ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                  <input
                    type="radio"
                    name="condition"
                    value={c.value}
                    checked={form.condition === c.value}
                    onChange={e => setForm({ ...form, condition: e.target.value, threshold: '' })}
                    className="sr-only"
                  />
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-sm text-slate-300">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Threshold */}
          {selectedCondition?.hasThreshold && (
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Threshold ({selectedCondition.unit})
              </label>
              <input
                type="number"
                value={form.threshold}
                onChange={e => setForm({ ...form, threshold: e.target.value })}
                placeholder={selectedCondition.placeholder}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
