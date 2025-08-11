"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Loader2,
  Clock,
  Thermometer,
  Info,
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [weatherData, setWeatherData] = useState<WeatherData>({
    current: {
      location: "Athens",
      time: "09:03",
      date: "Thursday, 31 Aug",
      temp: 24,
      feelsLike: 22,
      condition: "Sunny",
      humidity: 41,
      windSpeed: 2,
      pressure: 997,
      uv: 8,
      sunrise: "06:37 AM",
      sunset: "20:37 AM",
    },
    hourly: [
      { time: "12:00", temp: 26, condition: "sunny", windSpeed: 3 },
      { time: "15:00", temp: 27, condition: "sunny", windSpeed: 2 },
      { time: "18:00", temp: 27, condition: "partly-cloudy", windSpeed: 2 },
      { time: "21:00", temp: 25, condition: "partly-cloudy", windSpeed: 3 },
      { time: "00:00", temp: 22, condition: "clear", windSpeed: 3 },
    ],
    daily: [
      {
        date: "Friday, 1 Sep",
        day: "Fri",
        temp: 20,
        condition: "partly-cloudy",
      },
      {
        date: "Saturday, 2 Sep",
        day: "Sat",
        temp: 22,
        condition: "partly-sunny",
      },
      { date: "Sunday, 3 Sep", day: "Sun", temp: 27, condition: "sunny" },
      { date: "Monday, 4 Sep", day: "Mon", temp: 18, condition: "rainy" },
      { date: "Tuesday, 5 Sep", day: "Tue", temp: 16, condition: "rainy" },
    ],
  });

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  // Real API integration
  const fetchWeatherData = async (city: string) => {
    if (!city.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!currentResponse.ok) {
        throw new Error("City not found");
      }

      const currentData = await currentResponse.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastResponse.json();

      const sunrise = new Date(
        currentData.sys.sunrise * 1000
      ).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const sunset = new Date(currentData.sys.sunset * 1000).toLocaleTimeString(
        "en-GB",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );

      const hourlyForecasts = forecastData.list
        .slice(0, 5)
        .map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          temp: Math.round(item.main.temp),
          condition: mapWeatherCondition(item.weather[0].main),
          windSpeed: Math.round(item.wind.speed * 3.6),
        }));

      const dailyForecasts = [];
      const processedDates = new Set();

      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();

        if (!processedDates.has(dateStr) && dailyForecasts.length < 5) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            date: date.toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "short",
            }),
            day: date.toLocaleDateString("en-GB", { weekday: "short" }),
            temp: Math.round(item.main.temp),
            condition: mapWeatherCondition(item.weather[0].main),
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
          windSpeed: Math.round(currentData.wind.speed * 3.6),
          pressure: currentData.main.pressure,
          uv: 8,
          sunrise,
          sunset,
        },
        hourly: hourlyForecasts,
        daily: dailyForecasts,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
      console.error("Weather API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const mapWeatherCondition = (condition: string): string => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "sunny";
      case "clouds":
        return "partly-cloudy";
      case "rain":
      case "drizzle":
        return "rainy";
      case "snow":
        return "snowy";
      case "thunderstorm":
        return "rainy";
      case "mist":
      case "fog":
      case "haze":
        return "cloudy";
      default:
        return "sunny";
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
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
            throw new Error("Failed to get weather for current location");
          }

          const data = await response.json();
          await fetchWeatherData(data.name);
        } catch (err) {
          setError("Failed to get weather for current location");
          setIsLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve your location");
        setIsLoading(false);
      }
    );
  };

  const getWeatherIcon = (
    condition: string,
    size: "small" | "medium" | "large" = "medium"
  ) => {
    const iconSize = size === "small" ? 40 : size === "medium" ? 150 : 150;
    const iconMap: { [key: string]: string } = {
      sunny: "/icons/clear.png",
      clear: "/icons/clear.png",
      "partly-cloudy": "/icons/clouds.png",
      "partly-sunny": "/icons/clouds.png",
      cloudy: "/icons/mist.png",
      rainy: "/icons/rain.png",
      snowy: "/icons/drizzle.png",
    };

    const iconSrc = iconMap[condition.toLowerCase()] || "/icons/clear.png";

    return (
      <div className="relative">
        <img
          src={iconSrc}
          alt={condition}
          width={iconSize}
          height={iconSize}
          className="object-contain"
        />
      </div>
    );
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      fetchWeatherData(searchQuery.trim());
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setWeatherData((prev) => ({
        ...prev,
        current: {
          ...prev.current,
          time: getCurrentTime(),
          date: getCurrentDate(),
        },
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 font-['Poppins'] ${
        isDarkMode
          ? "dark text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-900"
      }`}
      style={{
        background: isDarkMode
          ? "linear-gradient(110.05deg, #383838 0%, rgba(158, 158, 158, 0) 71.82%)"
          : undefined,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative w-16 h-8 rounded-full transition-all duration-300 backdrop-blur-sm"
              style={{
                background: "rgba(217, 217, 217, 1)",
              }}
              aria-label="Toggle dark mode"
            >
              <div
                className={`absolute w-6 h-6 rounded-full top-1 transition-transform duration-300 shadow-lg ${
                  isDarkMode ? "translate-x-8 bg-gray-900" : "translate-x-1 bg-gray-800"
                }`}
              >
                {isDarkMode ? (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-xs text-white">
                    🌙
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-yellow-400 flex items-center justify-center text-xs">
                    ☀️
                  </div>
                )}
              </div>
            </button>
            <span className="text-sm font-medium">
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </span>
          </div>

          <div className="flex-1 max-w-lg mx-6">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-[999]"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for your preferred city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                disabled={isLoading}
                className={`w-full pl-12 pr-12 py-3 rounded-full border-2 transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode
                    ? "border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } disabled:opacity-50`}
                style={{
                  background: isDarkMode
                    ? "linear-gradient(110.05deg, #383838 0%, rgba(158, 158, 158, 0) 71.82%)"
                    : "linear-gradient(110.05deg, #f0f0f0 0%, rgba(255, 255, 255, 0.8) 71.82%)",
                }}
              />
              <Info
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 cursor-pointer"
                size={20}
                onClick={() =>
                  alert("Enter a city name to search for weather information.")
                }
              />
            </div>
          </div>

          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="flex items-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <img
                src="/icons/location.png"
                alt="Current Location"
                width={20}
                height={20}
                className="object-contain"
              />
            )}
            Current Location
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <span className="ml-3 text-lg">Loading weather data...</span>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Time/Location Card */}
            <div
              className="relative rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-300"
              style={{
                background: isDarkMode
                  ? "linear-gradient(110.05deg, #383838 0%, rgba(158, 158, 158, 0) 71.82%)"
                  : "linear-gradient(110.05deg, #f0f0f0 0%, rgba(255, 255, 255, 0.8) 71.82%)",
                boxShadow: isDarkMode
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
              }}
            >
              <h2
                className="text-center mb-6"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "36px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: isDarkMode ? "#FFFFFF" : "#333333",
                }}
              >
                {weatherData.current.location}
              </h2>
              <div
                className="text-center mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "80px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  background:
                    "linear-gradient(84.4deg, #FFFFFF -16.56%, rgba(255, 255, 255, 0) 118.43%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: isDarkMode ? "#FFFFFF" : "#333333",
                }}
              >
                {weatherData.current.time}
              </div>
              <div className="text-center text-gray-400 text-lg">
                {weatherData.current.date}
              </div>
            </div>

            {/* 5 Day Forecast Card */}
            <div
              className="relative rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 mt-5"
              style={{
                background: isDarkMode
                  ? "linear-gradient(110.05deg, #383838 0%, rgba(158, 158, 158, 0) 71.82%)"
                  : "linear-gradient(110.05deg, #f0f0f0 0%, rgba(255, 255, 255, 0.8) 71.82%)",
                boxShadow: isDarkMode
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
              }}
            >
              <h3
                className="mb-8"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "32px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                }}
              >
                5 Days Forecast:
              </h3>
              <div className="flex flex-col gap-3">
                {weatherData.daily.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all duration-200"
                    style={{
                      background: isDarkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 flex items-center justify-center">
                        {getWeatherIcon(day.condition, "medium")}
                      </div>
                      <div
                        className="font-bold text-2xl"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {day.temp}°C
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className="text-gray-400 font-medium"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {day.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Current Weather Card */}
            <div
              className="relative rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-300"
              style={{
                background: isDarkMode
                  ? "linear-gradient(110.05deg, #383838 0%, rgba(158, 158, 158, 0) 71.82%)"
                  : "linear-gradient(110.05deg, #f0f0f0 0%, rgba(255, 255, 255, 0.8) 71.82%)",
                boxShadow: isDarkMode
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
              }}
            >
              {/* Top Section: Temperature, Icon, and Metrics */}
              <div className="grid grid-cols-3 gap-8 items-center mb-8">
                {/* Left: Temperature */}
                <div>
                  <div
                    className="mb-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: "80px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      background:
                        "linear-gradient(84.4deg, #FFFFFF -16.56%, rgba(255, 255, 255, 0) 118.43%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {weatherData.current.temp}°C
                  </div>
                  <div
                    className="text-gray-400 text-lg"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Feels like: <span style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      background:
                        "linear-gradient(84.4deg, #FFFFFF -16.56%, rgba(255, 255, 255, 0) 118.43%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: isDarkMode ? "#FFFFFF" : "#333333",
                    }}>{weatherData.current.feelsLike}°C</span> 
                  </div>
                  {/* Bottom Section: Sunrise and Sunset */}
                  <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-600/20">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="text-gray-400">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 3V5M12 19V21M5.636 5.636L7.05 7.05M16.95 16.95L18.364 18.364M3 12H5M19 12H21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-[20px]">
                            Sunrise
                          </div>
                          <div className="text-lg text-gray-400">
                            {weatherData.current.sunrise}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="text-gray-400">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 3V5M12 19V21M5.636 5.636L7.05 7.05M16.95 16.95L18.364 18.364M3 12H5M19 12H21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-lg">Sunset</div>
                          <div className="text-lg text-gray-400">
                            {weatherData.current.sunset}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Weather Icon and Condition */}
                <div className="text-center">
                  <div className="mb-4 flex items-center justify-center w-40 h-40 mx-auto">
                    {getWeatherIcon(weatherData.current.condition, "large")}
                  </div>
                  <div
                    className="text-[32px] font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {weatherData.current.condition}
                  </div>
                </div>

                {/* Right: 2x2 Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Droplets
                        className="text-blue-400"
                        size={28}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {weatherData.current.humidity}%
                    </div>
                    <div className="text-sm text-gray-400">Humidity</div>
                  </div>

                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Wind
                        className="text-gray-400"
                        size={28}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {weatherData.current.windSpeed}km/h
                    </div>
                    <div className="text-sm text-gray-400">Wind Speed</div>
                  </div>

                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Gauge
                        className="text-gray-400"
                        size={28}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {weatherData.current.pressure}hPa
                    </div>
                    <div className="text-sm text-gray-400">Pressure</div>
                  </div>

                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Eye
                        className="text-purple-400"
                        size={28}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {weatherData.current.uv}
                    </div>
                    <div className="text-sm text-gray-400">UV</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast Card */}
            <div
              className="relative rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 mt-5"
              style={{
                background: isDarkMode
                  ? "linear-gradient(110.05deg, #383838 0%, rgba(158, 158, 158, 0) 71.82%)"
                  : "linear-gradient(110.05deg, #f0f0f0 0%, rgba(255, 255, 255, 0.8) 71.82%)",
                boxShadow: isDarkMode
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
              }}
            >
              <h3
                className="mb-8"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "32px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                }}
              >
                Hourly Forecast:
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {weatherData.hourly.map((hour, index) => {
                  // Create gradient colors from orange to blue based on index
                  const gradientColors = [
                    "linear-gradient(135deg, #FF8A65 0%, #FFB74D 100%)", // Orange
                    "linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)", // Light orange
                    "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)", // Green
                    "linear-gradient(135deg, #64B5F6 0%, #5C6BC0 100%)", // Blue
                    "linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)", // Dark blue
                  ];
                  
                  return (
                    <div
                      key={index}
                      className="text-center p-4 rounded-2xl transition-all duration-200 relative overflow-hidden"
                      style={{
                        background: isDarkMode
                          ? "linear-gradient(135deg, rgba(55, 55, 55, 0.8) 0%, rgba(25, 25, 25, 0.9) 100%)"
                          : gradientColors[index % gradientColors.length],
                        backdropFilter: "blur(10px)",
                        border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.3)",
                        color: isDarkMode ? "white" : "white",
                        textShadow: isDarkMode ? "none" : "0 1px 2px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <div className="relative z-10">
                        <div
                          className="text-sm font-semibold mb-3"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {hour.time}
                        </div>
                        <div className="flex justify-center mb-3 w-8 h-8 mx-auto">
                          {getWeatherIcon(hour.condition, "small")}
                        </div>
                        <div
                          className="font-bold text-lg mb-2"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {hour.temp}°C
                        </div>
                        <div className="text-xs flex items-center justify-center gap-1">
                          <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[6px] border-transparent border-b-cyan-300"></div>
                          {hour.windSpeed}km/h
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;