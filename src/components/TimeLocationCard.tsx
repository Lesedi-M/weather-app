import React from "react";
import { WeatherData } from "./types";

interface TimeLocationCardProps {
  weatherData: WeatherData;
  isDarkMode: boolean;
}

const TimeLocationCard: React.FC<TimeLocationCardProps> = ({
  weatherData,
  isDarkMode,
}) => {
  return (
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
  );
};

export default TimeLocationCard;
