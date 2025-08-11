import React from "react";
import { Droplets, Wind, Gauge, Eye } from "lucide-react";
import { WeatherData } from "./types";
import WeatherIcon from "./WeatherIcon";

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  isDarkMode: boolean;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weatherData,
  isDarkMode,
}) => {
  return (
    <div
      className="relative rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm transition-all duration-300"
      style={{
        background: isDarkMode
          ? "linear-gradient(110.05deg, #383838 0%, rgba(158, 158, 158, 0) 71.82%)"
          : "linear-gradient(110.05deg, #f0f0f0 0%, rgba(255, 255, 255, 0.8) 71.82%)",
        boxShadow: isDarkMode
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-8 sm:gap-8 items-center mb-6 sm:mb-8">
        {/* Left Section */}
        <div>
          <div
            className="mb-2 text-5xl sm:text-7xl font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              lineHeight: "100%",
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
            className="text-gray-400 text-base sm:text-lg"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Feels like:{" "}
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "18px",
                lineHeight: "100%",
                background:
                  "linear-gradient(84.4deg, #FFFFFF -16.56%, rgba(255, 255, 255, 0) 118.43%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: isDarkMode ? "#FFFFFF" : "#333333",
              }}
            >
              {weatherData.current.feelsLike}°C
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-600/20">
            {/* Sunrise */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-gray-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                  <div className="font-semibold text-lg">Sunrise</div>
                  <div className="text-sm sm:text-lg text-gray-400">
                    {weatherData.current.sunrise}
                  </div>
                </div>
              </div>
            </div>
            {/* Sunset */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-gray-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                  <div className="text-sm sm:text-lg text-gray-400">
                    {weatherData.current.sunset}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center w-28 h-28 sm:w-40 sm:h-40 mx-auto">
            <WeatherIcon
              condition={weatherData.current.condition}
              size="large"
            />
          </div>
          <div
            className="text-2xl sm:text-[32px] font-bold"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {weatherData.current.condition}
          </div>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Droplets
                className="text-blue-400"
                size={24}
                sm-size={28}
                strokeWidth={2}
              />
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-1">
              {weatherData.current.humidity}%
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Humidity</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Wind
                className="text-gray-400"
                size={24}
                sm-size={28}
                strokeWidth={2}
              />
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-1">
              {weatherData.current.windSpeed}km/h
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Wind Speed</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Gauge
                className="text-gray-400"
                size={24}
                sm-size={28}
                strokeWidth={2}
              />
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-1">
              {weatherData.current.pressure}hPa
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Pressure</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Eye
                className="text-purple-400"
                size={24}
                sm-size={28}
                strokeWidth={2}
              />
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-1">
              {weatherData.current.uv}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">UV</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;
