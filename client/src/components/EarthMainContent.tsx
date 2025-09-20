import { type MutableRefObject } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import MobilePointPanel from "./MobilePointPanel";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Point {
  profile_id?: number;
  latitude: number;
  longitude: number;
  datetime: string;
  pressure: number;
  temperature: number;
  salinity: number;
  project_name: string;
  platform_type: string;
  color: string;
}

interface EarthMainContentProps {
  globeEl: MutableRefObject<GlobeMethods | undefined>;
  points: Point[];
  isLoading: boolean;
  selectedPoint: Point | null;
  onPointClick: (point: Point) => void;
  onClosePoint: () => void;
}

export default function EarthMainContent({ 
  globeEl, 
  points, 
  isLoading, 
  selectedPoint,
  onPointClick,
  onClosePoint
}: EarthMainContentProps) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="w-full h-[calc(100vh-1.5rem)] bg-gray-950 border border-white/30 rounded-2xl my-3 mr-4 flex flex-col">
        {/* Header with Sidebar Trigger */}
        <div className="flex items-center p-4 border-b border-white/10">
          <SidebarTrigger />
          <h1 className="text-white text-xl font-semibold ml-3">Argo Float Data Explorer</h1>
        </div>
        
        <div className="flex-1 relative overflow-hidden min-w-0 flex items-center justify-center rounded-b-2xl">
          <div className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-100'} rounded-b-2xl overflow-hidden`}>
            <Globe
              ref={globeEl}
              width={undefined}
              height={undefined}
              globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
              pointsData={points}
              pointLat={(d) => (d as Point).latitude}
              pointLng={(d) => (d as Point).longitude}
              pointColor={(d) => (d as Point).color}
              pointAltitude={0.02}
              pointRadius={() => 0.5}
              pointLabel={(d) => `Profile ID: ${(d as Point).profile_id}<br/>Project: ${(d as Point).project_name}<br/>Platform: ${(d as Point).platform_type}<br/>Temperature: ${(d as Point).temperature}°C`}
              onPointClick={(d) => onPointClick(d as Point)}
              rendererConfig={{ 
                antialias: true,
                alpha: true
              }}
            />
          </div>
        </div>
      </main>
      <MobilePointPanel 
        selectedPoint={selectedPoint}
        onClosePoint={onClosePoint}
      />
    </div>
  )
}