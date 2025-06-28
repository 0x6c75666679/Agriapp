import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import bgImage from "../assets/image_login_signup.png";

// --- WeatherCard (mock data, glassmorphism, image) ---
const CITY = "Kathmandu";
function WeatherCard() {
  const weather = {
    current: {
      temp_c: 21,
      condition: { text: "Clear / Sunny", icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
      humidity: 76,
      wind_kph: 3.5,
      precip_mm: 0.59,
    },
    location: { name: CITY },
    date: "7 May, 2025",
    time: "8:25 PM",
  };
  const mockGraph = [38, 30, 27, 26];
  return (
    <div className="relative rounded-3xl bg-white/40 backdrop-blur-lg shadow-2xl p-6 min-w-[320px] max-w-sm flex flex-col gap-2 border border-white/30">
      {/* Weather icon as background */}
      <img src={weather.current.condition.icon} alt="icon" className="absolute right-4 top-4 w-20 h-20 opacity-10 pointer-events-none select-none" />
      <div className="flex items-center gap-4 z-10">
        <span className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg">{weather.current.temp_c}°C</span>
        <div className="flex flex-col">
          <span className="text-gray-700 font-bold text-lg">{weather.current.condition.text}</span>
          <span className="text-xs text-gray-500">{weather.location.name}</span>
        </div>
      </div>
      <div className="flex gap-4 text-xs text-gray-700 mt-2 z-10">
        <span>💨 {weather.current.wind_kph} km/h</span>
        <span>💧 {weather.current.humidity}%</span>
        <span>🌧 {weather.current.precip_mm} in</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2 z-10">
        <span>{weather.date}</span>
        <span>{weather.time}</span>
      </div>
      {/* Mock graph */}
      <div className="mt-4">
        <div className="flex items-end gap-2 h-16">
          {mockGraph.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-8 rounded-t-xl bg-yellow-200" style={{ height: `${(v / 40) * 64}px` }}></div>
              <span className="text-xs text-gray-400 mt-1">{["Morning", "Afternoon", "Evening", "Overnight"][i]}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>6 am to 12 pm</span>
          <span>12 pm to 6 pm</span>
          <span>6 pm to 12 am</span>
          <span>12 am to 6 am</span>
        </div>
      </div>
    </div>
  );
}

// --- ActivityFeed (mock, glassmorphism, colored cards) ---
const mockActivities = [
  { status: "In Progress", time: "7:45 AM", desc: "Crops were monitored for signs of disease or nutrient deficiency.", color: "bg-yellow-200 text-yellow-900 border-l-4 border-yellow-400" },
  { status: "Not Started", time: "7:45 AM", desc: "Pesticide was sprayed to prevent pests from damaging the field.", color: "bg-gray-800 text-white border-l-4 border-gray-900" },
];
function ActivityFeed() {
  return (
    <div className="rounded-3xl bg-white/40 backdrop-blur-lg shadow-2xl p-6 flex-1 min-w-[260px] border border-white/30">
      <h4 className="font-bold mb-3 text-gray-800">Today Activity</h4>
      <ul className="space-y-3">
        {mockActivities.map((a, i) => (
          <li key={i} className={`rounded-xl p-4 flex flex-col gap-1 ${a.color} shadow-md`}> 
            <span className="font-bold text-sm">{a.status}</span>
            <span className="text-xs">{a.desc}</span>
            <span className="text-xs text-right opacity-70">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- CultivatedAreaList (mock, glassmorphism, image cards) ---
const mockPlots = [
  { name: "Emerald Valley Plot F5", status: "Ready for Harvest", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", stats: { wind: 3.5, humidity: 76.3 }, tag: "Ready for Harvest", tagColor: "bg-yellow-300 text-yellow-900" },
  { name: "Green Meadows Plot M9", status: "Pesticide", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", stats: { wind: 3.5, humidity: 76.3 }, tag: "Pesticide", tagColor: "bg-green-300 text-green-900" },
];
function CultivatedAreaList() {
  return (
    <div className="rounded-3xl bg-white/40 backdrop-blur-lg shadow-2xl p-6 min-w-[260px] max-w-xs border border-white/30">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-gray-800">Cultivated Area</h4>
        <input className="rounded-full px-3 py-1 bg-white/60 border border-gray-200 text-xs" placeholder="Search..." />
      </div>
      <ul className="space-y-4">
        {mockPlots.map((plot, i) => (
          <li key={i} className="rounded-2xl overflow-hidden shadow-lg bg-white/70 relative">
            <img src={plot.img} alt={plot.name} className="w-full h-20 object-cover" />
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold shadow-md ${plot.tagColor}`}>{plot.tag}</div>
            <div className="p-2">
                    <div className="text-xs text-gray-600">💨 {plot.stats.wind} km/h | 💧 {plot.stats.humidity}%</div>
                </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- FieldMapOverview (mock, glassmorphism) ---
const mockMarkers = [
  { pos: [28.7041, 77.1025], name: "Plot F5", info: "Health: 98%" },
  { pos: [28.7045, 77.1030], name: "Plot M9", info: "Health: 92%" },
];
function FieldMapOverview() {
  return (
    <div className="rounded-3xl bg-white/40 backdrop-blur-lg shadow-2xl p-2 flex-1 min-h-[250px] border border-white/30">
      <MapContainer center={[28.7041, 77.1025]} zoom={15} scrollWheelZoom={false} className="w-full h-60 rounded-2xl">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {mockMarkers.map((m, i) => (
          <Marker key={i} position={m.pos}>
            <Popup>
              <b>{m.name}</b><br />{m.info}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// --- Dashboard Layout ---
export default function Dashboard() {
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center">
      {/* Blurred background image */}
      <img src={bgImage} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0 blur-md brightness-75" />
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6 p-6">
        <div className="flex flex-wrap gap-6 justify-between">
          <WeatherCard />
          <ActivityFeed />
          <CultivatedAreaList />
        </div>
        <div className="mt-6">
          <FieldMapOverview />
        </div>
      </div>
    </div>
  );
}
