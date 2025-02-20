"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, memo } from "react";
import axios from "axios";
import { FORECAST_API_URL, WEATHER_API_KEY } from "@/app/apis/apis";
import { Shimmer } from "@/app/components/LoadindShimmer";

// Forecast Item Component (Memoized)
const ForecastItem = memo(
  ({ day, loading }: { day: any; loading: boolean }) => (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
      <span className="block text-teal-600 font-semibold">
        {loading ? (
          <Shimmer width="60px" height="16px" />
        ) : (
          new Date(day.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
          })
        )}
      </span>
      <span className="block text-2xl text-black font-bold">
        {loading ? (
          <Shimmer width="40px" height="24px" />
        ) : (
          `${Math.round(day.main?.temp || 0)}°C`
        )}
      </span>
      <span className="block text-gray-500 capitalize">
        {loading ? (
          <Shimmer width="80px" height="16px" />
        ) : (
          day.weather?.[0]?.description
        )}
      </span>
    </div>
  )
);

const WeatherPage = () => {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const [weather, setWeather] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );

  // Fetch Weather Data
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
    return (
      <p className="text-center text-red-500 font-semibold">
        Failed to load weather data.
      </p>
    );
  }

  const currentWeather = weather?.list?.[0] || {};
  const dailyForecast =
    weather?.list?.filter((_: any, index: number) => index % 8 === 0) || [];

  return (
    <div className="h-screen w-full flex justify-center bg-gray-200 items-center">
    <div className="max-w-4xl mx-auto md:p-6 py-6 px-2 bg-gray-100 shadow-md rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {status === "loading" ? (
            <Shimmer width="120px" height="24px" />
          ) : (
            weather?.city?.name || "Unknown Location"
          )}
        </h2>
        {/* Change <p> to <div> to avoid invalid nesting */}
        <div className="text-lg font-medium text-gray-600">
          {status === "loading" ? (
            <Shimmer width="100px" height="24px" />
          ) : (
            new Date().toDateString()
          )}
        </div>
      </div>

      {/* Current Weather Section */}
      <div className="flex justify-between gap-4 items-center my-6">
        {/* Weather Icon & Temperature */}
        <div className="text-center">
          {status === "loading" ? (
            <Shimmer width="128px" height="128px" />
          ) : (
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather?.weather?.[0]?.icon}@2x.png`}
              alt="Weather Icon"
              className="w-32 h-32 mx-auto"
            />
          )}
          <h1 className="md:text-6xl text-4xl mt-2 font-extrabold text-gray-900">
            {status === "loading" ? (
              <Shimmer width="80px" height="48px" />
            ) : (
              `${Math.round(currentWeather.main?.temp || 0)}°`
            )}<span className="text-[28px] font-normal">c</span>
          </h1>
          <span className="text-lg text-gray-600 capitalize">
            {status === "loading" ? (
              <Shimmer width="120px" height="24px" />
            ) : (
              currentWeather?.weather?.[0]?.description || "No Data"
            )}
          </span>
        </div>

        {/* Additional Weather Details */}
        <div className="space-y-2">
          <div className="text-lg text-gray-700">
            <strong>Wind Speed:</strong>{" "}
            {status === "loading" ? (
              <Shimmer width="60px" height="24px" />
            ) : (
              `${currentWeather?.wind?.speed || 0} mph`
            )}
          </div>
          <div className="text-lg text-gray-700">
            <strong>Humidity:</strong>{" "}
            {status === "loading" ? (
              <Shimmer width="60px" height="24px" />
            ) : (
              `${currentWeather?.main?.humidity || 0}%`
            )}
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
        {dailyForecast.map((day: any, index: number) => (
          <ForecastItem key={index} day={day} loading={status === "loading"} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default WeatherPage;
