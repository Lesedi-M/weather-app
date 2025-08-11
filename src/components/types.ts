export interface WeatherData {
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
