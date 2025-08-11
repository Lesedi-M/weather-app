import React from "react";
import { WeatherData } from "./types";
import WeatherIcon from "./WeatherIcon";

interface DailyForecastCardProps {
  weatherData: WeatherData;
  isDarkMode: boolean;
}

const DailyForecastCard: React.FC<DailyForecastCardProps> = ({
  weatherData,
  isDarkMode,
}) => {
  return (
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
                <WeatherIcon condition={day.condition} size="medium" />
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
  );
};

export default DailyForecastCard;
