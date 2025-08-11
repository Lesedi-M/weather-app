import React from "react";
import { Search, Info, Loader2 } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isLoading: boolean;
  handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  getCurrentLocation: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  searchQuery,
  setSearchQuery,
  isLoading,
  handleSearch,
  getCurrentLocation,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="relative w-16 h-8 rounded-full transition-all duration-300 backdrop-blur-sm"
          style={{ background: "rgba(217, 217, 217, 1)" }}
          aria-label="Toggle dark mode"
        >
          <div
            className={`absolute w-6 h-6 rounded-full top-1 transition-transform duration-300 shadow-lg ${
              isDarkMode
                ? "translate-x-8 bg-gray-900"
                : "translate-x-1 bg-gray-800"
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
  );
};

export default Header;
