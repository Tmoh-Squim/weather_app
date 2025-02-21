"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./components/Loader";
import { City, validEmailRegex } from "./types/types";
import { GEO_API_URL } from "./apis/apis";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Home() {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubscribing,setIsSubsribing] = useState(false);
  const [searchLoad, setSearchLoad] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [weather, setWeather] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCities = sessionStorage.getItem("storedCities");
      const subscribed = localStorage.getItem("subscribedUser");

      if (storedCities) {
        setCities(JSON.parse(storedCities));
      } else {
        fetchCities();
      }

      if (!subscribed) {
        setShowModal(true);
      }
    }
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(GEO_API_URL, {
        params: { where: `country_code="KE"`, limit: 50 },
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
        params: { where: `ascii_name LIKE "%${searchValue}%"`, limit: 10 },
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

  const handleSubscribe = async () => {
    if (!email || !weather || !selectedCity) {
      toast.info("Please fill in all fields.");
      return;
    }
    if(!email.match(validEmailRegex)){
      toast.error("Invalid email address")
    }

    try {
      setIsSubsribing(true);
      const response = await axios.post("/api/subscribe", {
        email,
        weather,
        lat: selectedCity.lat,
        lon: selectedCity.lon,
      });

      if (response.data.success) {
        localStorage.setItem(
          "subscribedUser",
          JSON.stringify({ email, weather, city: selectedCity.name })
        );
        setShowModal(false);
      return  toast.success(response.data.message);
      } else {
      return  toast.error(response.data.message);
      }
    } catch (err) {
      return  toast.error("Something went wrong!try again later");
    }finally{
      setIsSubsribing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black md:p-6 p-2">
      <h1 className="800px:text-5xl text-3xl font-bold mb-6">Weather Forecast</h1>

      <div className="relative md:w-[48%] w-full">
        <input
          type="text"
          placeholder="Search with city name..."
          className="w-full p-3 border rounded-3xl shadow-sm text-black"
          onChange={(e) => handleSearch(e.target.value)}
          value={query}
        />

        {searchLoad && (
          <div className="absolute right-3 top-2.5">
            <Loader />
          </div>
        )}

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

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-4">Subscribe to Weather Alerts</h2>
            <div className="text-center cursor-pointer" onClick={()=>{setShowModal(false)}}>
              X
            </div>
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded mb-2"
              onChange={(e) => setEmail(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded mb-2"
              onChange={(e) => setWeather(e.target.value)}
            >
              <option value="">Select Weather Condition</option>
              <option value="Rain">Rain</option>
              <option value="Clear">Sunny</option>
              <option value="Clouds">Cloudy</option>
              <option value="Dirizzle">Drizzle</option>
              <option value="Fog">Fog</option>
              <option value="Thunderstorm">Thunderstorm</option>
            </select>
            <input
              type="text"
              placeholder="Search city..."
              className="w-full p-2 border rounded mb-2"
              onChange={(e) => handleSearch(e.target.value)}
            />
            {filteredCities.map((city) => (
              <p key={city.name} onClick={() => setSelectedCity(city)} className="cursor-pointer">
                {city.name} - {city.country}
              </p>
            ))}
            <button className="bg-teal-400 w-full py-2 text-white rounded flex justify-center items-center" disabled={isSubscribing} onClick={handleSubscribe}>
              {isSubscribing ? <Loader /> : 'Subscribe'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
