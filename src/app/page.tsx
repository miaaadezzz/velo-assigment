import SearchBar from "./search-bar";
import { fetchAntwerpenStations } from "./velo-api";

export default async function Home() {
  const stations = await fetchAntwerpenStations();
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center px-4 py-10">
      {/* Header */}
      <header className="w-full max-w-md flex flex-col items-center mb-10 mt-4">
        <h1 className="text-4xl font-extrabold text-[#2D3A46] tracking-tight mb-2">
          Velo Antwerpen
        </h1>
        <p className="text-base text-[#6B7280] text-center">
          Vind snel een fiets of vrije plaats bij een station in Antwerpen
        </p>
      </header>
      {/* Search Bar */}
      <SearchBar stations={stations} />
      <footer className="mt-10 text-xs text-[#A0AEC0] text-center">
        Data via citybik.es API
      </footer>
    </div>
  );
}
