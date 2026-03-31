import { useState, useEffect, useCallback } from 'react';
import { alertsAPI, userAPI } from '../api/api';
import { useWeather } from '../hooks/useWeather';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import WeatherCard from '../components/WeatherCard';
import AlertCard from '../components/AlertCard';
import CreateAlertModal from '../components/CreateAlertModal';
import AddLocationModal from '../components/AddLocationModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const { weatherMap, loading: weatherLoading, fetchWeather, fetchOne } = useWeather();

  const [locations, setLocations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [creatingAlert, setCreatingAlert] = useState(false);
  const [deletingAlert, setDeletingAlert] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('weather');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load profile (locations) + alerts
  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, alertsRes] = await Promise.all([
          userAPI.getProfile(),
          alertsAPI.getAlerts(),
        ]);
        const locs = profileRes.data.subscribedLocations || [];
        setLocations(locs);
        setAlerts(alertsRes.data);
        if (locs.length) fetchWeather(locs);
      } catch (e) {
        showToast('Failed to load data', 'error');
      } finally {
        setAlertsLoading(false);
      }
    };
    load();
  }, []);

  const handleAddLocation = async (loc) => {
    const updated = [...locations, loc];
    setLocations(updated);
    await userAPI.updateProfile({ subscribedLocations: updated });
    fetchOne(loc);
    showToast(`${loc} added to your locations`);
  };

  const handleRemoveLocation = async (loc) => {
    const updated = locations.filter(l => l !== loc);
    setLocations(updated);
    await userAPI.updateProfile({ subscribedLocations: updated });
    showToast(`${loc} removed`);
  };

  const handleCreateAlert = async (data) => {
    setCreatingAlert(true);
    try {
      const res = await alertsAPI.createAlert(data);
      setAlerts(prev => [...prev, res.data]);
      setShowCreateAlert(false);
      showToast(`Alert created for ${data.location}`);
    } catch (e) {
      showToast('Failed to create alert', 'error');
    } finally {
      setCreatingAlert(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    setDeletingAlert(id);
    try {
      await alertsAPI.deleteAlert(id);
      setAlerts(prev => prev.filter(a => a._id !== id));
      showToast('Alert removed');
    } catch {
      showToast('Failed to delete alert', 'error');
    } finally {
      setDeletingAlert(null);
    }
  };

  const handleRefresh = () => {
    if (locations.length) fetchWeather(locations);
    showToast('Weather data refreshed');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium transition-all ${
          toast.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-green-500/10 border-green-500/30 text-green-400'
        }`}>
          {toast.type === 'error' ? '⚠️' : '✓'} {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Weather Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {locations.length} location{locations.length !== 1 ? 's' : ''} · {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={weatherLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white text-sm transition-all disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${weatherLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-900/50 border border-slate-800 rounded-xl p-1 w-fit">
          {[
            { id: 'weather', label: '🌤 Weather', count: locations.length },
            { id: 'alerts', label: '🔔 Alerts', count: alerts.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Weather Tab */}
        {activeTab === 'weather' && (
          <div>
            {locations.length === 0 ? (
              <EmptyState
                icon="🌍"
                title="No locations added"
                desc="Add cities to monitor their weather in real-time"
                action={{ label: '+ Add Location', onClick: () => setShowAddLocation(true) }}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                  {locations.map(loc => (
                    <WeatherCard
                      key={loc}
                      location={loc}
                      weather={weatherMap[loc]}
                      onRemove={handleRemoveLocation}
                    />
                  ))}

                  {/* Add more card */}
                  <button
                    onClick={() => setShowAddLocation(true)}
                    className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-blue-400 transition-all duration-300 min-h-[200px] group"
                  >
                    <div className="w-10 h-10 rounded-xl border-2 border-current flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      +
                    </div>
                    <span className="text-sm font-medium">Add Location</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">
                Alerts trigger email notifications when conditions are met.
              </p>
              <button
                onClick={() => setShowCreateAlert(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                + New Alert
              </button>
            </div>

            {alertsLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />)}
              </div>
            ) : alerts.length === 0 ? (
              <EmptyState
                icon="🔔"
                title="No alerts configured"
                desc="Set up alerts to get notified by email when weather conditions change"
                action={{ label: '+ Create Alert', onClick: () => setShowCreateAlert(true) }}
              />
            ) : (
              <div className="space-y-2">
                {alerts.map(alert => (
                  <AlertCard
                    key={alert._id}
                    alert={alert}
                    onDelete={handleDeleteAlert}
                    deleting={deletingAlert}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddLocation && (
        <AddLocationModal
          onClose={() => setShowAddLocation(false)}
          onAdd={handleAddLocation}
        />
      )}

      {showCreateAlert && (
        <CreateAlertModal
          onClose={() => setShowCreateAlert(false)}
          onSubmit={handleCreateAlert}
          loading={creatingAlert}
        />
      )}
    </div>
  );
}

function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-sm">{desc}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-lg text-sm transition-all shadow-lg shadow-blue-500/20"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
