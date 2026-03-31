import React, { useEffect, useState } from 'react';
import api from '../api/weatherApi';

interface Weather {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  isRaining: boolean;
}

interface Alert {
  _id: string;
  location: string;
  condition: string;
  threshold: number;
}

export default function Dashboard() {
  const [locations, setLocations] = useState(['London', 'New York']);
  const [weatherData, setWeatherData] = useState<Weather[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState({ location: '', condition: 'temp_above', threshold: 35 });

  useEffect(() => {
    fetchWeather();
    fetchAlerts();
  }, []);

  const fetchWeather = async () => {
    const results = await Promise.all(
      locations.map(loc => api.get(`/weather?location=${loc}`).then(r => r.data))
    );
    setWeatherData(results);
  };

  const fetchAlerts = async () => {
    const { data } = await api.get('/alerts');
    setAlerts(data);
  };

  const createAlert = async () => {
    await api.post('/alerts', newAlert);
    fetchAlerts();
  };

  const deleteAlert = async (id: string) => {
    await api.delete(`/alerts/${id}`);
    fetchAlerts();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🌤️ Weather Alert Dashboard</h1>

      {/* Weather Cards */}
      <h2>Current Weather</h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {weatherData.map(w => (
          <div key={w.location} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, minWidth: 180 }}>
            <h3>{w.location}</h3>
            <p>🌡️ {w.temperature}°C</p>
            <p>💧 {w.humidity}% humidity</p>
            <p>{w.description}</p>
            {w.isRaining && <p>🌧️ Currently raining</p>}
          </div>
        ))}
      </div>

      {/* Create Alert */}
      <h2>Create Alert</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          placeholder="Location (e.g. Paris)"
          value={newAlert.location}
          onChange={e => setNewAlert({ ...newAlert, location: e.target.value })}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <select
          value={newAlert.condition}
          onChange={e => setNewAlert({ ...newAlert, condition: e.target.value })}
          style={{ padding: 8 }}
        >
          <option value="temp_above">Temp Above</option>
          <option value="temp_below">Temp Below</option>
          <option value="rain">Rain</option>
          <option value="storm">Storm</option>
          <option value="humidity_above">Humidity Above</option>
        </select>
        <input
          type="number"
          value={newAlert.threshold}
          onChange={e => setNewAlert({ ...newAlert, threshold: +e.target.value })}
          style={{ padding: 8, width: 80 }}
        />
        <button onClick={createAlert} style={{ padding: '8px 16px', background: '#3498db', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Add Alert
        </button>
      </div>

      {/* Active Alerts */}
      <h2>Your Active Alerts</h2>
      {alerts.map(alert => (
        <div key={alert._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderBottom: '1px solid #eee' }}>
          <span>📍 {alert.location}</span>
          <span>🔔 {alert.condition} {alert.threshold && `(${alert.threshold})`}</span>
          <button onClick={() => deleteAlert(alert._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
            ✕ Remove
          </button>
        </div>
      ))}
    </div>
  );
}