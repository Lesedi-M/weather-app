"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { WeatherData } from "./types";
import Header from "./Header";
import TimeLocationCard from "./TimeLocationCard";
import CurrentWeatherCard from "./CurrentWeatherCard";
import HourlyForecastCard from "./HourlyForecastCard";
import DailyForecastCard from "./DailyForecastCard";

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
      { date: "Friday, 1 Sep", day: "Fri", temp: 20, condition: "partly-cloudy" },
      { date: "Saturday, 2 Sep", day: "Sat", temp: 22, condition: "partly-sunny" },
      { date: "Sunday, 3 Sep", day: "Sun", temp: 27, condition: "sunny" },
      { date: "Monday, 4 Sep", day: "Mon", temp: 18, condition: "rainy" },
      { date: "Tuesday, 5 Sep", day: "Tue", temp: 16, condition: "rainy" },
    ],
  });

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

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
        { hour: "2-digit", minute: "2-digit", hour12: true }
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
        <Header
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={isLoading}
          handleSearch={handleSearch}
          getCurrentLocation={getCurrentLocation}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <span className="ml-3 text-lg">Loading weather data...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TimeLocationCard weatherData={weatherData} isDarkMode={isDarkMode} />
            <DailyForecastCard weatherData={weatherData} isDarkMode={isDarkMode} />
          </div>
          <div className="space-y-6">
            <CurrentWeatherCard weatherData={weatherData} isDarkMode={isDarkMode} />
            <HourlyForecastCard weatherData={weatherData} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;