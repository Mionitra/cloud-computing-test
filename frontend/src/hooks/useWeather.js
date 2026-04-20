import { useState, useCallback } from 'react';
import { weatherAPI } from '../api/api';

export function useWeather() {
  const [weatherMap, setWeatherMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (locations) => {
    if (!locations.length) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        locations.map(loc => weatherAPI.getWeather(loc).then(r => ({ loc, data: r.data })))
      );
      const map = {};
      results.forEach(r => {
        if (r.status === 'fulfilled') map[r.value.loc] = r.value.data;
      });
      setWeatherMap(map);
    } catch (e) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (location) => {
    try {
      const res = await weatherAPI.getWeather(location);
      setWeatherMap(prev => ({ ...prev, [location]: res.data }));
      return res.data;
    } catch {
      return null;
    }
  }, []);

  return { weatherMap, loading, error, fetchWeather, fetchOne };
}
