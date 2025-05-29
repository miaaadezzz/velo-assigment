import { fetchAntwerpenStations } from "../../velo-api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StationDetail({ params }: { params: { id: string } }) {
  const stations = await fetchAntwerpenStations();
  const station = stations.find((s) => s.id === params.id);
  if (!station) return notFound();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-center">{station.name}</h1>
        <div className="text-gray-500 text-xs mb-6">Station ID: {station.id}</div>
        <div className="flex gap-8 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-green-600">{station.free_bikes}</span>
            <span className="text-xs text-gray-500">Fietsen beschikbaar</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-blue-600">{station.empty_slots}</span>
            <span className="text-xs text-gray-500">Plaatsen vrij</span>
          </div>
        </div>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">← Terug naar overzicht</Link>
      </div>
    </div>
  );
}
