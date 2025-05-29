export type Station = {
  id: string;
  name: string;
  free_bikes: number;
  empty_slots: number;
};

export type Network = {
  id: string;
  name: string;
  stations: Station[];
};

export async function fetchAntwerpenStations(): Promise<Station[]> {
  const res = await fetch('https://api.citybik.es/v2/networks/velo-antwerpen');
  if (!res.ok) throw new Error('Failed to fetch stations');
  const data = await res.json();
  return data.network.stations.slice(0, 10).map((s: any) => ({
    id: s.id,
    name: s.name,
    free_bikes: s.free_bikes,
    empty_slots: s.empty_slots,
  }));
}
