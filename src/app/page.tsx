import Link from "next/link";
import { fetchAntwerpenStations } from "./velo-api";

export default async function Home() {
  const stations = await fetchAntwerpenStations();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Velo Antwerpen 🚲</h1>
      <ul className="w-full max-w-md flex flex-col gap-4">
        {stations.slice(0, 3).map((station) => (
          <li key={station.id} className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row justify-between items-center hover:scale-[1.02] transition">
            <div>
              <h2 className="text-lg font-semibold">{station.name}</h2>
              <div className="text-xs text-gray-500">Station ID: {station.id}</div>
            </div>
            <Link href={`/station/${station.id}`} className="mt-2 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">Bekijk details</Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-gray-400 text-xs text-center">Data via citybik.es API</p>
    </div>
  );
}
