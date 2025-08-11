import React from "react";

interface WeatherIconProps {
  condition: string;
  size?: "small" | "medium" | "large";
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = "medium",
}) => {
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

export default WeatherIcon;
