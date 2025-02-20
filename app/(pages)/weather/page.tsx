"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, memo } from "react";
import axios from "axios";
import { FORECAST_API_URL, WEATHER_API_KEY } from "@/app/apis/apis";
import { Shimmer } from "@/app/components/LoadindShimmer";


const ForecastItem = memo(({ day, loading }: { day: any; loading: boolean }) => (
  <div className="p-4 border rounded-lg">
    <span className="text-teal-500 font-bold">
      {loading ? <Shimmer width="60px" height="16px" /> : new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
    </span>
    <span className="text-xl">
      {loading ? <Shimmer width="40px" height="24px" /> : `${Math.round(day.main?.temp || 0)}°C`}
    </span>
    <span>
      {loading ? <Shimmer width="80px" height="16px" /> : day.weather?.[0]?.description}
    </span>
  </div>
));

const WeatherPage = () => {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const [weather, setWeather] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");

  const fetchWeather = async () => {
    if (!lat || !lon) {
      setStatus("error");
      return;
    }

    try {
      const response = await axios.get(FORECAST_API_URL, {
        params: { lat, lon, appid: WEATHER_API_KEY, units: "metric" },
      });
      setWeather(response.data);
      setStatus("success");
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [lat, lon]);

  if (status === "error") {
    return <p className="text-center text-red-500">Failed to load weather data.</p>;
  }

  const currentWeather = weather?.list?.[0] || {};
  const dailyForecast = weather?.list?.filter((_: any, index: number) => index % 8 === 0) || [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">
          {status === "loading" ? <Shimmer width="120px" height="24px" /> : weather.city.name}
        </h2>
        <p className="text-lg font-semibold">
          {status === "loading" ? <Shimmer width="100px" height="24px" /> : new Date().toDateString()}
        </p>
      </div>

      <div className="flex justify-between items-center my-6">
        <div className="text-center">
          {status === "loading" ? (
            <Shimmer width="128px" height="128px" />
          ) : (
            <img src={`https://openweathermap.org/img/wn/${currentWeather.weather?.[0]?.icon}@2x.png`} alt="Weather Icon" />
          )}
          <h1 className="text-6xl font-bold">
            {status === "loading" ? <Shimmer width="80px" height="48px" /> : `${Math.round(currentWeather.main?.temp || 0)}°C`}
          </h1>
          <span className="text-lg">
            {status === "loading" ? <Shimmer width="120px" height="24px" /> : currentWeather.weather?.[0]?.description}
          </span>
        </div>
        <div>
          <p className="text-lg">
            <strong>Wind Speed:</strong>{" "}
            {status === "loading" ? <Shimmer width="60px" height="24px" /> : `${currentWeather.wind?.speed || 0} mph`}
          </p>
          <p className="text-lg">
            <strong>Humidity:</strong>{" "}
            {status === "loading" ? <Shimmer width="60px" height="24px" /> : `${currentWeather.main?.humidity || 0}%`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 text-center mt-6">
        {dailyForecast.map((day: any, index: number) => (
          <ForecastItem key={index} day={day} loading={status === "loading"} />
        ))}
      </div>
    </div>
  );
};

export default WeatherPage;
