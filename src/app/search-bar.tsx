"use client";
import Link from "next/link";
import { FaBicycle } from "react-icons/fa";
import { useState, useEffect } from "react";
import type { Station } from "./velo-api";

export default function SearchBar({ stations }: { stations: Station[] }) {
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [stationsWithDistance, setStationsWithDistance] = useState<Station[]>(stations);
  const [sortOption, setSortOption] = useState<'distance' | 'bikes'>('distance');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      setStationsWithDistance(
        stations.map((s) => ({
          ...s,
          distance:
            s.latitude && s.longitude
              ? Math.round(
                  getDistance(userLocation.lat, userLocation.lon, s.latitude, s.longitude)
                )
              : undefined,
        }))
      );
    } else {
      setStationsWithDistance(stations);
    }
  }, [userLocation, stations]);

  const filtered = stationsWithDistance.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'distance') {
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    } else {
      return b.free_bikes - a.free_bikes;
    }
  });

  return (
    <>
      <div className="w-full max-w-md flex flex-row justify-between items-center mb-2">
        <input
          type="text"
          placeholder="Zoek een station..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 mr-2 px-4 py-2 rounded-lg border border-[#B9B9B9] focus:outline-none focus:ring-2 focus:ring-[#B0C0CF] text-[#2D3A46] placeholder:text-[#6B7280]"
        />
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value as 'distance' | 'bikes')}
          className="px-4 py-2 rounded-lg border border-[#B9B9B9] bg-white/70 text-[#2D3A46] text-sm focus:outline-none focus:ring-2 focus:ring-[#B0C0CF]"
        >
          <option value="distance">Dichtstbij</option>
          <option value="bikes">Meeste fietsen</option>
        </select>
      </div>
      <ul className="w-full max-w-md flex flex-col gap-5">
        {sorted.slice(0, 3).map((station) => (
          <li
            key={station.id}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 flex flex-col gap-2 border border-[#B9B9B9] relative pb-24 sm:pb-20"
          >
            <div className="flex flex-row items-center gap-2">
              <FaBicycle className="text-[#457B9D] text-2xl sm:text-3xl md:text-4xl" />
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] leading-tight">
                {station.name}
                {station.distance !== undefined && (
                  <span className="ml-2 text-xs text-[#6B7280]">({station.distance} m)</span>
                )}
              </h2>
            </div>
            <div className="flex flex-row gap-4 sm:gap-6 mt-3">
              <div className="flex flex-col items-center">
                <span
                  className={`text-xl sm:text-2xl font-bold ${station.free_bikes > 10 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {station.free_bikes}
                </span>
                <span className="text-xs text-[#6B7280]">Fietsen</span>
              </div>
              <div className="flex flex-col items-center">
                <span
                  className={`text-xl sm:text-2xl font-bold ${station.empty_slots > 10 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {station.empty_slots}
                </span>
                <span className="text-xs text-[#6B7280]">Plaatsen</span>
              </div>
            </div>
            {/* Buttons in bottom right corner */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
              <Link
                href={`/station/${station.id}`}
                className="bg-[#B0C0CF] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow hover:bg-[#8A9BAF] transition w-20 sm:w-24 text-center"
              >
                Details
              </Link>
              <Link
                href={`/station/${station.id}/navigation`}
                className="bg-[#B0C0CF] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow hover:bg-[#8A9BAF] transition flex items-center justify-center w-20 sm:w-24"
                aria-label={`Navigatie naar station ${station.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Haversine formula
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
