"use client";
import { fetchAntwerpenStations } from "../../velo-api";
import Link from "next/link";
import { FaBicycle } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import type { Station } from "../../velo-api";

export default function StationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [station, setStation] = useState<Station | null>(null);

  useEffect(() => {
    fetchAntwerpenStations().then((stations) => {
      const found = stations.find((s) => s.id === id);
      setStation(found || null);
    });
  }, [id]);

  const [distance, setDistance] = useState<number | null>(null);
  useEffect(() => {
    if (station && station.latitude !== undefined && station.longitude !== undefined && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setDistance(
          Math.round(
            getDistance(
              pos.coords.latitude,
              pos.coords.longitude,
              station.latitude!,
              station.longitude!
            )
          )
        );
      });
    }
  }, [station]);

  if (!station) return <div className="min-h-screen flex items-center justify-center text-gray-500">Station niet gevonden</div>;

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#B9B9B9] p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <FaBicycle className="text-[#457B9D] text-5xl mb-4" />
          <div className="flex flex-row items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#2D3A46] text-center">{station.name}</h1>
            {distance !== null && (
              <span className="ml-2 px-3 py-1 rounded-full bg-[#EAF6FF] text-[#1D3557] text-sm font-semibold shadow-sm border border-[#A9D6F7] whitespace-nowrap flex items-center gap-1">
                <FaArrowUp className="inline-block text-[#457B9D] text-base" />
                {distance} m
              </span>
            )}
          </div>
          <span className="text-xs text-[#A0AEC0]">Station ID: {station.id}</span>
        </div>
        <div className="flex flex-row justify-center gap-10 w-full mb-8">
          <div className="flex flex-col items-center">
            <span
              className={`text-4xl font-bold ${station.free_bikes > 10 ? 'text-green-600/70' : 'text-red-600/70'}`}
            >
              {station.free_bikes}
            </span>
            <span className="text-xs text-[#6B7280]">Fietsen beschikbaar</span>
          </div>
          <div className="flex flex-col items-center">
            <span
              className={`text-4xl font-bold ${station.empty_slots > 10 ? 'text-green-600/70' : 'text-red-600/70'}`}
            >
              {station.empty_slots}
            </span>
            <span className="text-xs text-[#6B7280]">Plaatsen vrij</span>
          </div>
        </div>
        <Link href="/" className="mt-4 bg-[#B0C0CF] text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-[#8A9BAF] transition">← Terug naar overzicht</Link>
      </div>
    </div>
  );
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
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
