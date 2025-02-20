"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./components/Loader";

const GEO_API_URL =
  "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records";
const WEATHER_API_KEY = "d24a72336742bc918cb55d6448fe281d";
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/weather";

interface City {
  name: string;
  country: string;
  timezone: string;
  lat?: number;
  lon?: number;
}

interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export default function Home() {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(GEO_API_URL, {
          params: {
            where: `country_code="KE"`, // Fetch only Kenyan cities
            limit: 50, // Limit to 50 cities initially
          },
        });

        const cityData = response.data.results.map((city: any) => ({
          name: city.ascii_name,
          country: city.cou_name_en,
          timezone: city.timezone,
          lat: city.coordinates?.lat,
          lon: city.coordinates?.lon,
        }));

        setCities(cityData);
      } catch (err) {
        console.error("Error fetching city data:", err);
      }
      setLoading(false);
    };

    fetchCities();
  }, []);

  // Handle search without modifying the initial cities list
  const handleSearch = async (searchValue: string) => {
    setQuery(searchValue);
    if (searchValue.length < 2) {
      setFilteredCities([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(GEO_API_URL, {
        params: {
          where: `ascii_name LIKE "%${searchValue}%"`,
          limit: 10, // Limit search results for performance
        },
      });

      const searchResults = response.data.results.map((city: any) => ({
        name: city.ascii_name,
        country: city.cou_name_en,
        timezone: city.timezone,
        lat: city.coordinates?.lat,
        lon: city.coordinates?.lon,
      }));

      setFilteredCities(searchResults);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
    setLoading(false);
  };

  // Fetch weather without affecting city list
  const fetchWeather = async (city: City) => {
    if (!city.lat || !city.lon) {
      alert("Location data unavailable for this city.");
      return;
    }

    try {
      const response = await axios.get(FORECAST_API_URL, {
        params: {
          lat: city.lat,
          lon: city.lon,
          appid: WEATHER_API_KEY,
          units: "metric",
        },
      });

      const weatherData = response.data;
      setWeather({
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        condition: weatherData.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
      });

      setSelectedCity(city);
      setIsPopupOpen(true);
    } catch (err) {
      console.error("Error fetching weather data:", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
      <h1 className="text-5xl font-bold mb-6">Weather Forecast</h1>

      {/* Search Input */}
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Search with city name..."
          className="w-full p-2 border rounded-md shadow-md text-black"
          onChange={(e) => handleSearch(e.target.value)}
          value={query}
        />

        {/* Loading Animation */}
        {loading && (
          <div className="absolute right-3 top-2.5">
            <Loader />
          </div>
        )}

        {/* Search Results Dropdown */}
        {filteredCities.length > 0 && (
          <div className="absolute w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-md">
            {filteredCities.map((city, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() =>{ setQuery(city.name);fetchWeather(city)}}
              >
                {city.name} - {city.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table (Initial Cities) */}
      <div className="w-full max-w-4xl mt-6">
        {loading && (
          <div className="text-center">
            <Loader />
          </div>
        )}

     
          <table className="w-full border-collapse border border-gray-300 shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">City Name</th>
                <th className="p-3 border">Country</th>
                <th className="p-3 border">Timezone</th>
                <th className="p-3 border">View Details</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="p-3 border">{city.name}</td>
                  <td className="p-3 border">{city.country}</td>
                  <td className="p-3 border">{city.timezone}</td>
                  <td className="p-3 border">
                    <button
                      className="bg-teal-400 px-4 py-2 text-white rounded hover:bg-teal-500"
                      onClick={() => fetchWeather(city)}
                    >
                      Check Weather
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {/* Weather Popup */}
      {isPopupOpen && weather && selectedCity && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative"
          style={{
            backgroundImage: `url(${weather.icon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setIsPopupOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedCity.name}</h2>
            <p>{selectedCity.country}</p>
            <h3 className="text-4xl font-bold">{weather.temperature}°C</h3>
            <p>{weather.condition}</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind Speed: {weather.windSpeed} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
}
