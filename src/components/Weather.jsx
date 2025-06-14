import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Eye, Droplets, Wind, Thermometer, Gauge, MapPin, Search, RefreshCw, ArrowLeft } from 'lucide-react';

const WeatherDashboard = ({ onBack }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL = import.meta.env.VITE_WEATHER_API_URL;

  const getWeatherIcon = (weatherCode, isLarge = false) => {
    const size = isLarge ? 'w-16 h-16' : 'w-8 h-8';
    const iconMap = {
      '01': <Sun className={`${size} text-yellow-400`} />,
      '02': <Cloud className={`${size} text-gray-300`} />,
      '03': <Cloud className={`${size} text-gray-400`} />,
      '04': <Cloud className={`${size} text-gray-500`} />,
      '09': <CloudRain className={`${size} text-blue-400`} />,
      '10': <CloudRain className={`${size} text-blue-500`} />,
      '11': <CloudRain className={`${size} text-purple-500`} />,
      '13': <CloudSnow className={`${size} text-blue-200`} />,
      '50': <Cloud className={`${size} text-gray-400`} />
    };
    
    const iconCode = weatherCode?.slice(0, 2);
    return iconMap[iconCode] || <Sun className={`${size} text-yellow-400`} />;
  };

  const fetchWeatherData = useCallback(async (cityName) => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      setError('Please add your OpenWeatherMap API key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('City not found');
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      setWeather(currentData);
      setForecast(forecastData);
      setLastUpdated(new Date());
      setCity(currentData.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    if (city !== null){fetchWeatherData(city);}
    else{setError('Please enter a city name');}
  }, [fetchWeatherData, city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeatherData(searchInput.trim());
      setSearchInput('');
    }
  };

  const getDailyForecast = () => {
    if (!forecast) return [];
    
    const daily = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!daily[date]) {
        daily[date] = item;
      }
    });
    
    return Object.values(daily).slice(0, 5);
  };

  const getHourlyForecast = () => {
    if (!forecast) return [];
    return forecast.list.slice(0, 8);
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#243949] to-[#517fa4] flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20">
          <RefreshCw className="w-8 h-8 text-white animate-spin mx-auto" />
          <p className="text-white mt-4">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#243949] to-[#517fa4] p-4">
       <button
                onClick={onBack}
                className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
                <ArrowLeft size={20} className="text-gray-700" />
            </button> 
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 backdrop-blur-md bg-white/20 rounded-2xl">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Weather Dashboard</h1>
                <p className="text-white/80 text-sm">Real-time weather updates</p>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search city..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 backdrop-blur-md bg-white/20 hover:bg-white/30 hover:scale-105 disabled:opacity-50 rounded-2xl text-white font-medium transition-all duration-200"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="backdrop-blur-md bg-red-500/20 border border-red-300/30 rounded-2xl p-4 mb-6">
            <p className="text-white font-medium">{error}</p>
            {error.includes('API key') && (
              <p className="text-white/80 text-sm mt-2">
                Get your free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">OpenWeatherMap</a>
              </p>
            )}
          </div>
        )}

        {weather && (
          <>
            {/* Main Weather Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:scale-102 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-white/80" />
                    <div>
                      <h2 className="text-3xl font-bold text-white">{weather.name}</h2>
                      <p className="text-white/80">{weather.sys.country}</p>
                    </div>
                  </div>
                  {lastUpdated && (
                    <p className="text-white/60 text-sm">
                      Updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {getWeatherIcon(weather.weather[0].icon, true)}
                    <div>
                      <div className="text-6xl font-bold text-white mb-2">
                        {Math.round(weather.main.temp)}°
                      </div>
                      <p className="text-white/80 text-xl capitalize">
                        {weather.weather[0].description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white/80">Feels like</p>
                    <p className="text-2xl font-semibold text-white">
                      {Math.round(weather.main.feels_like)}°
                    </p>
                  </div>
                </div>
              </div>

              {/* Weather Details */}
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-102 transition-all duration-500">
                <h3 className="text-xl font-semibold text-white mb-6">Details</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Thermometer className="w-5 h-5" />, label: 'High/Low', value: `${Math.round(weather.main.temp_max)}° / ${Math.round(weather.main.temp_min)}°` },
                    { icon: <Droplets className="w-5 h-5" />, label: 'Humidity', value: `${weather.main.humidity}%` },
                    { icon: <Wind className="w-5 h-5" />, label: 'Wind', value: `${Math.round(weather.wind.speed * 3.6)} km/h` },
                    { icon: <Gauge className="w-5 h-5" />, label: 'Pressure', value: `${weather.main.pressure} hPa` },
                    { icon: <Eye className="w-5 h-5" />, label: 'Visibility', value: `${Math.round(weather.visibility / 1000)} km` }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-white/80">{item.icon}</div>
                        <span className="text-white/80">{item.label}</span>
                      </div>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl hover:scale-102 transition-all duration-500">
              <h3 className="text-xl font-semibold text-white mb-6">24-Hour Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {getHourlyForecast().map((hour, index) => (
                  <div key={index} className="text-center">
                    <p className="text-white/80 text-sm mb-2">
                      {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(hour.weather[0].icon)}
                    </div>
                    <p className="text-white font-semibold">{Math.round(hour.main.temp)}°</p>
                    <p className="text-white/60 text-xs">{Math.round(hour.pop * 100)}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-102 transition-all duration-500">
              <h3 className="text-xl font-semibold text-white mb-6">5-Day Forecast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {getDailyForecast().map((day, index) => (
                  <div key={index} className="backdrop-blur-md bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                    <p className="text-white/80 font-medium mb-3">
                      {index === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short' })}
                    </p>
                    <div className="flex justify-center mb-3">
                      {getWeatherIcon(day.weather[0].icon)}
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">
                      {Math.round(day.main.temp_max)}°
                    </p>
                    <p className="text-white/60">{Math.round(day.main.temp_min)}°</p>
                    <p className="text-white/80 text-sm mt-2 capitalize">
                      {day.weather[0].description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;