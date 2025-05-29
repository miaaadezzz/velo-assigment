"use client";
import Link from "next/link";
import { FaBicycle } from "react-icons/fa";
import { useState } from "react";

export default function SearchBar({ stations }: { stations: any[] }) {
  const [query, setQuery] = useState("");
  const filtered = stations.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <input
        type="text"
        placeholder="Zoek een station..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full max-w-md mb-6 px-4 py-2 rounded-lg border border-[#B9B9B9] focus:outline-none focus:ring-2 focus:ring-[#B0C0CF]"
      />
      <ul className="w-full max-w-md flex flex-col gap-5">
        {filtered.slice(0, 3).map((station) => (
          <li
            key={station.id}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-2 border border-[#B9B9B9] relative"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-2">
                <FaBicycle className="text-[#457B9D] text-3xl sm:text-4xl" />
                <h2 className="text-lg font-bold text-[#1A1A1A] leading-tight">
                  {station.name}
                </h2>
              </div>
              <Link
                href={`/station/${station.id}`}
                className="bg-[#B0C0CF] text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-[#8A9BAF] transition"
              >
                Details
              </Link>
            </div>
            <div className="flex flex-row gap-6 mt-3">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[#457B9D]">
                  {station.free_bikes}
                </span>
                <span className="text-xs text-[#6B7280]">Fietsen</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[#E63946]">
                  {station.empty_slots}
                </span>
                <span className="text-xs text-[#6B7280]">Plaatsen</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
