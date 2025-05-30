export type Station = {
  id: string;
  name: string;
  free_bikes: number;
  empty_slots: number;
  latitude?: number;
  longitude?: number;
  distance?: number; // in meters
};

export type Network = {
  id: string;
  name: string;
  stations: Station[];
};

export async function fetchAntwerpenStations(): Promise<Station[]> {
  const res = await fetch("https://api.citybik.es/v2/networks/velo-antwerpen");
  if (!res.ok) throw new Error("Failed to fetch stations");
  const data = await res.json();
  return (
    data.network.stations as Array<{
      id: string;
      name: string;
      free_bikes: number;
      empty_slots: number;
      latitude?: number;
      longitude?: number;
    }>
  )
    .slice(0, 10)
    .map((s) => ({
      id: s.id,
      name: s.name.replace(/^[0-9]+\s*-\s*/, ""),
      free_bikes: s.free_bikes,
      empty_slots: s.empty_slots,
      latitude: s.latitude,
      longitude: s.longitude,
      // distance will be added client-side
    }));
}
