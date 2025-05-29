import { fetchAntwerpenStations } from "../../velo-api";

export async function generateStaticParams() {
  const stations = await fetchAntwerpenStations();
  // Add a dummy distance property for each station for now
  return stations.slice(0, 10).map((station) => ({ id: station.id, distance: 0 }));
}
