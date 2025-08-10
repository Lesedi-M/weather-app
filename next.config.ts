import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['openweathermap.org'],
  },
  env: {
    NEXT_PUBLIC_WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
  },
};

export default nextConfig;
