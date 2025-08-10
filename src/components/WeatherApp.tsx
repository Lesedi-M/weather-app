'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Eye, Gauge, Loader2 } from 'lucide-react';

// Types
interface WeatherData {
  current: {
    location: string;
    time: string;
    date: string;
    temp: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    uv: number;
    sunrise: string;
    sunset: string;
  };
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
    windSpeed: number;
  }>;
  daily: Array<{
    date: string;
    day: string;
    temp: number;
    condition: string;
  }>;
}

const WeatherApp: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [weatherData, setWeatherData] = useState<WeatherData>({
    current: {
      location: 'Athens',
      time: '09:03',
      date: 'Thursday, 31 Aug',
      temp: 24,
      feelsLike: 22,
      condition: 'Sunny',
      humidity: 41,
      windSpeed: 2,
      pressure: 997,
      uv: 8,
      sunrise: '06:37 AM',
      sunset: '20:37 PM'
    },
    hourly: [
      { time: '12:00', temp: 26, condition: 'sunny', windSpeed: 3 },
      { time: '15:00', temp: 27, condition: 'sunny', windSpeed: 2 },
      { time: '18:00', temp: 27, condition: 'partly-cloudy', windSpeed: 2 },
      { time: '21:00', temp: 25, condition: 'partly-cloudy', windSpeed: 3 },
      { time: '00:00', temp: 22, condition: 'clear', windSpeed: 3 }
    ],
    daily: [
      { date: 'Friday, 1 Sep', day: 'Fri', temp: 20, condition: 'partly-cloudy' },
      { date: 'Saturday, 2 Sep', day: 'Sat', temp: 22, condition: 'partly-sunny' },
      { date: 'Sunday, 3 Sep', day: 'Sun', temp: 27, condition: 'sunny' },
      { date: 'Monday, 4 Sep', day: 'Mon', temp: 18, condition: 'rainy' },
      { date: 'Tuesday, 5 Sep', day: 'Tue', temp: 16, condition: 'rainy' }
    ]
  });

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '167357813eeef0ae3bfc78f4d3fefe28';

  // Real API integration
  const fetchWeatherData = async (city: string) => {
    if (!city.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error('City not found');
      }
      
      const currentData = await currentResponse.json();
      
      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      const forecastData = await forecastResponse.json();
      
      // Process current weather
      const sunrise = new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const sunset = new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      // Process hourly forecast (next 5 periods)
      const hourlyForecasts = forecastData.list.slice(0, 5).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        temp: Math.round(item.main.temp),
        condition: mapWeatherCondition(item.weather[0].main),
        windSpeed: Math.round(item.wind.speed * 3.6) // Convert m/s to km/h
      }));
      
      // Process daily forecast (get one forecast per day)
      const dailyForecasts = [];
      const processedDates = new Set();
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();
        
        if (!processedDates.has(dateStr) && dailyForecasts.length < 5) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            date: date.toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'short'
            }),
            day: date.toLocaleDateString('en-GB', { weekday: 'short' }),
            temp: Math.round(item.main.temp),
            condition: mapWeatherCondition(item.weather[0].main)
          });
        }
      }
      
      setWeatherData({
        current: {
          location: currentData.name,
          time: getCurrentTime(),
          date: getCurrentDate(),
          temp: Math.round(currentData.main.temp),
          feelsLike: Math.round(currentData.main.feels_like),
          condition: mapWeatherCondition(currentData.weather[0].main),
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
          pressure: currentData.main.pressure,
          uv: 8, // UV index not available in free plan
          sunrise,
          sunset
        },
        hourly: hourlyForecasts,
        daily: dailyForecasts
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Weather API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Map OpenWeatherMap conditions to our icon system
  const mapWeatherCondition = (condition: string): string => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'sunny';
      case 'clouds':
        return 'partly-cloudy';
      case 'rain':
      case 'drizzle':
        return 'rainy';
      case 'snow':
        return 'snowy';
      case 'thunderstorm':
        return 'rainy';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'cloudy';
      default:
        return 'sunny';
    }
  };

  // Get user's location
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get weather for current location');
          }
          
          const data = await response.json();
          await fetchWeatherData(data.name);
        } catch (err) {
          setError('Failed to get weather for current location');
          setIsLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  const getWeatherIcon = (condition: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 48;
    
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="text-yellow-400" size={iconSize} />;
      case 'partly-cloudy':
      case 'partly-sunny':
        return (
          <div className="relative">
            <Sun className="text-yellow-400" size={iconSize} />
            <Cloud className="absolute top-2 left-2 text-gray-300" size={iconSize * 0.7} />
          </div>
        );
      case 'cloudy':
        return <Cloud className="text-gray-400" size={iconSize} />;
      case 'rainy':
        return <CloudRain className="text-blue-400" size={iconSize} />;
      case 'snowy':
        return <CloudSnow className="text-blue-200" size={iconSize} />;
      default:
        return <Sun className="text-yellow-400" size={iconSize} />;
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-GB', { 
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  };

  // Handle search
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      fetchWeatherData(searchQuery.trim());
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setWeatherData(prev => ({
        ...prev,
        current: {
          ...prev.current,
          time: getCurrentTime(),
          date: getCurrentDate()
        }
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-300 ${
                isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
            <span className="text-sm font-medium">Dark Mode</span>
          </div>
          
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for your preferred city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } disabled:opacity-50`}
              />
            </div>
          </div>
          
          <button 
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <MapPin size={18} />
            )}
            Current Location
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <span className="ml-2 text-lg">Loading weather data...</span>
          </div>
        )}

        {/* Main Weather Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {/* Time Card */}
          <div className={`rounded-2xl p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <h2 className="text-2xl font-semibold mb-2">{weatherData.current.location}</h2>
            <div className="text-4xl font-bold mb-1">{weatherData.current.time}</div>
            <div className="text-gray-400 text-sm">{weatherData.current.date}</div>
          </div>

          {/* Current Weather Card */}
          <div className={`rounded-2xl p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-bold">{weatherData.current.temp}°C</div>
                <div className="text-gray-400 text-sm">Feels like: {weatherData.current.feelsLike}°C</div>
              </div>
              <div className="text-center">
                {getWeatherIcon(weatherData.current.condition, 'large')}
                <div className="text-lg font-medium mt-2">{weatherData.current.condition}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-yellow-400" />
                <div>
                  <div className="text-gray-400">Sunrise</div>
                  <div>{weatherData.current.sunrise}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-orange-400" />
                <div>
                  <div className="text-gray-400">Sunset</div>
                  <div>{weatherData.current.sunset}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Details Card */}
          <div className={`rounded-2xl p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Droplets className="text-blue-400" size={20} />
                <div>
                  <div className="text-2xl font-bold">{weatherData.current.humidity}%</div>
                  <div className="text-gray-400 text-sm">Humidity</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="text-gray-400" size={20} />
                <div>
                  <div className="text-2xl font-bold">{weatherData.current.windSpeed}km/h</div>
                  <div className="text-gray-400 text-sm">Wind Speed</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gauge className="text-gray-400" size={20} />
                <div>
                  <div className="text-2xl font-bold">{weatherData.current.pressure}hPa</div>
                  <div className="text-gray-400 text-sm">Pressure</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Eye className="text-purple-400" size={20} />
                <div>
                  <div className="text-2xl font-bold">{weatherData.current.uv}</div>
                  <div className="text-gray-400 text-sm">UV</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* 5 Day Forecast */}
          <div className={`rounded-2xl p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <h3 className="text-xl font-semibold mb-6">5 Days Forecast:</h3>
            <div className="space-y-4">
              {weatherData.daily.map((day, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(day.condition, 'small')}
                    <div>
                      <div className="font-medium">{day.temp}°C</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">{day.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Forecast */}
          <div className={`rounded-2xl p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <h3 className="text-xl font-semibold mb-6">Hourly Forecast:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {weatherData.hourly.map((hour, index) => (
                <div key={index} className={`text-center p-3 rounded-lg transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div className="text-sm font-medium mb-2">{hour.time}</div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(hour.condition, 'small')}
                  </div>
                  <div className="font-bold text-lg mb-1">{hour.temp}°C</div>
                  <div className="text-xs text-blue-400 flex items-center justify-center gap-1">
                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-blue-400"></div>
                    {hour.windSpeed}km/h
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;