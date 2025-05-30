// This file is not used by Next.js routing. Please use /station/[id]/navigation/page.tsx for the navigation page implementation.
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowUp } from "react-icons/fa";

export default function NavigationPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 relative overflow-hidden">
      {/* Road background image */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2023/11/09/01/25/road-8376079_1280.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px) brightness(0.7)",
        }}
        aria-hidden="true"
      />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#B9B9B9] p-8 flex flex-col items-center z-10 relative">
        <FaArrowUp className="text-[#457B9D] text-5xl mb-4" />
        <h1 className="text-2xl font-extrabold text-[#2D3A46] text-center mb-4">
          Navigatie naar station {id}
        </h1>
        <p className="text-[#6B7280] text-center mb-6">
          Gebruik je favoriete navigatie-app om naar dit station te gaan.
        </p>
        <Link
          href={`/station/${id}`}
          className="bg-[#B0C0CF] text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-[#8A9BAF] transition mb-2"
        >
          ← Terug naar station
        </Link>
        <Link
          href="/"
          className="bg-[#B0C0CF] text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-[#8A9BAF] transition"
        >
          Terug naar overzicht
        </Link>
      </div>
    </div>
  );
}
