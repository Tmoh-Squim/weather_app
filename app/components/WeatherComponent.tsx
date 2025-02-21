"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { FORECAST_API_URL, WEATHER_API_KEY } from "@/app/apis/apis";
import { Shimmer } from "@/app/components/LoadingShimmer";
import { HourlyForecastItem } from "@/app/components/HourlyForecast";
import { ForecastItem } from "@/app/components/DailyForecast";

const WeatherComponent = () => {
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
  const dailyForecast = weather?.list?.filter((_: any, index: number) => index % 8 === 0) || [];
  const hourlyForecast = weather?.list?.slice(1, 7) || [];

  return (
    <div className="lg:py-10 w-full flex justify-center bg-white items-center">
      <div className="lg:flex gap-2 justify-center items-center">
        <div className="max-w-4xl mx-auto md:p-6 py-6 px-2  bg-neutral-50 h-screen  rounded-md" style={{backgroundImage:`url(/bg.jpeg)`}}>
          {/* Header */}
          <div className="flex justify-between items-center border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {status === "loading" ? (
                <Shimmer width="120px" height="24px" />
              ) : (
                weather?.city?.name || "Unknown Location"
              )}
            </h2>
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
                )}
                <span className="text-[28px] font-normal">c</span>
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
              <div className="text-lg text-gray-700">
                <strong>Feels Like:</strong>{" "}
                {status === "loading" ? (
                  <Shimmer width="60px" height="24px" />
                ) : (
                  `${Math.round(currentWeather.main?.feels_like || 0)}°`
                )}
              </div>
            </div>
          </div>
          <h1 className=" text-2xl font-bold text-black my-2 text-center">
            Hourly forecast
          </h1>

          {/* Hourly Forecast Section */}
          <div className="lg:grid grid-cols-4 flex flex-wrap justify-between gap-2 text-center ">
            {hourlyForecast.map((hour: any, index: number) => (
              <HourlyForecastItem
                key={index}
                hour={hour}
                loading={status === "loading"}
              />
            ))}
          </div>
        </div>
        <div className="block bg-white px-2 py-4">
          <h1 className=" text-2xl font-bold text-green-300 my-2 text-center">
            Weekly forecast
          </h1>

          {/* 5-Day Forecast Section */}
          <div className="lg:grid grid-cols-1 flex justify-between lg:gap-5 gap-2 flex-wrap w-full text-center">
            {dailyForecast.map((day: any, index: number) => (
              <ForecastItem
                key={index}
                day={day}
                loading={status === "loading"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
