"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./components/Loader";
import { City } from "./types/types";
import { GEO_API_URL } from "./apis/apis";
import { useRouter } from "next/navigation";

export default function Home() {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoad, setSearchLoad] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCities = sessionStorage.getItem("storedCities");

    if (storedCities) {
      setCities(JSON.parse(storedCities)); // Load from session storage
    } else {
      fetchCities();
    }
  }, []);

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
      sessionStorage.setItem("storedCities", JSON.stringify(cityData));
    } catch (err) {
      console.error("Error fetching city data:", err);
    }
    setLoading(false);
  };

  const handleSearch = async (searchValue: string) => {
    setQuery(searchValue);
    if (searchValue.length < 2) {
      setFilteredCities([]);
      return;
    }

    setSearchLoad(true);
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
    setSearchLoad(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black md:p-6 p-2">
      <h1 className="800px:text-5xl text-3xl font-bold mb-6">Weather Forecast</h1>

      {/* Search Input */}
      <div className="relative md:w-[48%] w-full">
        <input
          type="text"
          placeholder="Search with city name..."
          className="w-full p-3 border rounded-3xl shadow-sm text-black"
          onChange={(e) => handleSearch(e.target.value)}
          value={query}
        />

        {/* Loading Animation */}
        {searchLoad && (
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
                onClick={() => {
                  setQuery(city.name);
                  router.push(`/weather?lat=${city.lat}&lon=${city.lon}`);
                }}
              >
                {city.name} - {city.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table (Initial Cities) */}
      <div className="w-full max-w-4xl mt-6 overflow-x-auto">
  <table className="w-full min-w-max border-collapse border border-gray-300 shadow-lg">
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
              onClick={() => router.push(`/weather?lat=${city.lat}&lon=${city.lon}`)}
            >
              Check Weather
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

        {loading && (
          <div className="text-center flex justify-center items-center my-6">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
