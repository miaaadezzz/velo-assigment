"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaArrowDown, FaLocationArrow, FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { fetchAntwerpenStations, Station } from "../../../velo-api";

const parseInstruction = (text: string) => {
  // Try to extract action and street from the instruction
  // Examples: 'Turn left onto Lange Dijkstraat', 'Head southwest on Lange Dijkstraat', 'Continue straight', etc.
  const turnRegex = /Turn (left|right)(?: onto (.+))?/i;
  const continueRegex = /Continue (straight)?/i;
  const headRegex = /Head ([a-z]+)(?: on (.+))?/i;
  const arriveRegex = /You have arrived at your destination/i;
  const roundaboutRegex = /At the roundabout/i;

  if (turnRegex.test(text)) {
    const match = text.match(turnRegex);
    if (match) {
      return match[1] === "left" ? "sla links af" : "sla rechts af";
    }
  }
  if (continueRegex.test(text)) {
    return "ga rechtdoor";
  }
  if (headRegex.test(text)) {
    return "ga rechtdoor";
  }
  if (arriveRegex.test(text)) {
    return "je bent aangekomen op je bestemming";
  }
  if (roundaboutRegex.test(text)) {
    return "bij de rotonde";
  }
  return text;
};

const translateInstruction = (text: string) => {
  // If the instruction starts with 'over X meter, ...', reformat to 'in X meter, ...'
  const overRegex = /^over (\d+) meter, (.+)$/i;
  const match = text.match(overRegex);
  if (match) {
    const distance = match[1];
    const action = parseInstruction(match[2]);
    return `in ${distance} meter, ${action}`;
  }
  // If the instruction is just an action
  return parseInstruction(text);
};

function getDirectionIcon(instruction: string) {
  if (/rechts af|right/i.test(instruction)) return <FaArrowRight className="inline mr-2 text-2xl align-middle text-[#457B9D]" />;
  if (/links af|left/i.test(instruction)) return <FaArrowLeft className="inline mr-2 text-2xl align-middle text-[#457B9D]" />;
  if (/rechtdoor|continue|head/i.test(instruction)) return <FaArrowUp className="inline mr-2 text-2xl align-middle text-[#457B9D]" />;
  if (/rotonde|roundabout/i.test(instruction)) return <FaLocationArrow className="inline mr-2 text-2xl align-middle text-[#457B9D]" />;
  if (/bestemming|arrived/i.test(instruction)) return <FaArrowDown className="inline mr-2 text-2xl align-middle text-[#457B9D]" />;
  return <FaArrowUp className="inline mr-2 text-2xl align-middle text-[#457B9D]" />;
}

export default function NavigationPage() {
  const params = useParams();
  const id = params?.id;
  const [stationName, setStationName] = useState<string>("");
  const [stationCoords, setStationCoords] = useState<[number, number] | null>(null);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [distanceLeft, setDistanceLeft] = useState<number|null>(null);
  const [durationLeft, setDurationLeft] = useState<number|null>(null);

  useEffect(() => {
    fetchAntwerpenStations().then((stations: Station[]) => {
      const found = stations.find((s: Station) => s.id === id);
      setStationName(found ? found.name : "Onbekend station");
      if (found && found.latitude && found.longitude) {
        setStationCoords([found.longitude, found.latitude]);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!stationCoords) return;
    if (!navigator.geolocation) {
      setError("Locatie niet beschikbaar op dit apparaat.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCoords = [pos.coords.longitude, pos.coords.latitude];
        // OpenRouteService API (replace 'YOUR_API_KEY' with a real key for production)
        fetch(
          `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf624812a1c049d7db4b88b5a137ef5472d706&start=${userCoords[0]},${userCoords[1]}&end=${stationCoords[0]},${stationCoords[1]}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data && data.features && data.features[0]) {
              const segment = data.features[0].properties.segments[0];
              const steps = segment.steps;
              setDistanceLeft(segment.distance); // meters
              setDurationLeft(segment.duration); // seconds
              const instr = steps.slice(0, 3).map((step: { instruction: string; distance: number }) => {
                let text = step.instruction;
                if (step.distance) text = `over ${Math.round(step.distance)} meter, ${text}`;
                return translateInstruction(text);
              });
              setInstructions(instr);
            } else {
              setError("Geen route-instructies gevonden.");
            }
          })
          .catch(() => setError("Kon route niet ophalen."));
      },
      () => setError("Kon je locatie niet bepalen.")
    );
  }, [stationCoords]);

  return (
    <div className="min-h-screen flex flex-col items-center px-2 sm:px-4 py-6 sm:py-8 relative overflow-hidden">
      {/* Road background image */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('https://cdn.pixabay.com/photo/2023/11/09/01/25/road-8376079_1280.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.7)'
        }}
        aria-hidden="true"
      />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#B9B9B9] p-4 sm:p-8 flex flex-col items-center z-10 relative">
        <h1 className="text-base sm:text-lg font-semibold text-[#2D3A46] text-center mb-2 truncate w-full max-w-xs mx-auto">
          {stationName}
        </h1>
        {/* Navigation instruction card */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {!error && instructions.length > 0 && (
          <div className="mb-4 w-full flex justify-center">
            <div className="flex flex-row items-center bg-white rounded-2xl shadow-lg border border-[#EAEAEA] px-4 sm:px-6 py-4 sm:py-6 min-h-[64px] sm:min-h-[80px] max-w-xs w-full">
              <span className="flex-1 text-[#22223B] text-lg sm:text-xl font-bold leading-tight break-words">
                {instructions[0]}
              </span>
              <span className="ml-2 sm:ml-4 flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[#B0C0CF]">
                {getDirectionIcon(instructions[0])}
              </span>
            </div>
          </div>
        )}
        {/* Distance and time left below the instructions, styled as in the design */}
        {!error && distanceLeft !== null && durationLeft !== null && (
          <div className="mb-6 w-full flex flex-row justify-center gap-4 sm:gap-8 text-[#22223B] text-xs font-medium">
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-wide text-[#22223B]">Resterende tijd</span>
              <span className="text-sm sm:text-base font-bold tracking-wider text-[#22223B]">{new Date(durationLeft * 1000).toISOString().substr(11, 8)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="uppercase tracking-wide text-[#22223B]">Afstand</span>
              <span className="text-sm sm:text-base font-bold tracking-wider text-[#22223B]">{distanceLeft >= 1000 ? (distanceLeft/1000).toFixed(1) + ' km' : Math.round(distanceLeft) + ' m'}</span>
            </div>
          </div>
        )}
        {!error && instructions.length === 0 && (
          <div className="text-[#6B7280] text-center mb-6">Route-instructies laden...</div>
        )}
        <Link href={`/station/${id}`} className="bg-[#B0C0CF] text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold shadow hover:bg-[#8A9BAF] transition mb-2">← Terug naar station</Link>
        <Link href="/" className="bg-[#B0C0CF] text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold shadow hover:bg-[#8A9BAF] transition">Terug naar overzicht</Link>
      </div>
    </div>
  );
}
