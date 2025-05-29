import { fetchAntwerpenStations } from "../../velo-api";

export async function generateStaticParams() {
  const stations = await fetchAntwerpenStations();
  return stations.slice(0, 10).map((station) => ({ id: station.id }));
}
