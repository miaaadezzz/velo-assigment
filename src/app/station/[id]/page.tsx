import { fetchAntwerpenStations } from "../../velo-api";
import Link from "next/link";
import { FaBicycle } from "react-icons/fa";

export default async function StationDetail({ params }: { params: { id: string } }) {
  const stations = await fetchAntwerpenStations();
  const station = stations.find((s) => s.id === params.id);
  if (!station) return <div className="min-h-screen flex items-center justify-center text-gray-500">Station niet gevonden</div>;
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#B9B9B9] p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <FaBicycle className="text-[#457B9D] text-5xl mb-4" />
          <h1 className="text-2xl font-extrabold text-[#2D3A46] text-center mb-1">{station.name}</h1>
          <span className="text-xs text-[#A0AEC0]">Station ID: {station.id}</span>
        </div>
        <div className="flex flex-row justify-center gap-10 w-full mb-8">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-[#457B9D]">{station.free_bikes}</span>
            <span className="text-xs text-[#6B7280]">Fietsen beschikbaar</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-[#E63946]">{station.empty_slots}</span>
            <span className="text-xs text-[#6B7280]">Plaatsen vrij</span>
          </div>
        </div>
        <Link href="/" className="mt-2 bg-[#B0C0CF] text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-[#8A9BAF] transition">← Terug naar overzicht</Link>
      </div>
    </div>
  );
}
