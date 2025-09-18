import { useState, useRef, useEffect } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { axiosInstance } from "../utils/axiosInstance";

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

// Helper function to calculate color based on temperature
const getTemperatureColor = (temperature: number): string => {
  // Temperature ranges for ocean data (typical range: -2°C to 30°C)
  if (temperature >= 25) return '#FF1744'; // Hot red
  if (temperature >= 20) return '#FF5722'; // Warm orange-red
  if (temperature >= 15) return '#FF9800'; // Orange
  if (temperature >= 10) return '#FFC107'; // Yellow
  if (temperature >= 5) return '#8BC34A';  // Light green
  if (temperature >= 0) return '#4CAF50';  // Green
  if (temperature >= -1) return '#00BCD4'; // Cyan
  return '#2196F3'; // Cool blue for very cold
};

interface EarthProps {
  selectedDate: string;
}

export default function Earth({ selectedDate }: EarthProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/profiles/${selectedDate}`);
        const pointsData = res.data;
        const fetchedPoints: Point[] = pointsData.data.map((item: Point) => ({
          profile_id: item.profile_id,
          latitude: item.latitude,
          longitude: item.longitude,
          datetime: item.datetime,
          pressure: item.pressure,
          temperature: item.temperature,
          salinity: item.salinity,
          project_name: item.project_name,
          platform_type: item.platform_type,
          color: getTemperatureColor(item.temperature), // Calculate color based on temperature
        }));
        setPoints(fetchedPoints);
        console.log('Fetched points:', fetchedPoints);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);




  return (
    <div className="w-full h-screen overflow-hidden">
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full h-full">
        {/* Left Sidebar - Desktop */}
        <div className="w-96 bg-zinc-900 backdrop-blur-sm flex flex-col border-r border-gray-900 flex-shrink-0">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white text-2xl font-bold">Argo Profiles</h2>
              {isLoading && (
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              )}
            </div>
            <p className="text-gray-300 text-base">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {points.length} profiles
            </p>
            <p className="text-gray-400 text-sm mt-1">Click on a point to see details</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedPoint ? (
              <div className="p-6">
                <div className="bg-white/15 backdrop-blur-sm text-white p-6 rounded-xl shadow-xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-3">Profile ID: {selectedPoint.profile_id}</h3>
                  <p className="text-base text-gray-100 leading-relaxed mb-4">
                    Project: {selectedPoint.project_name}<br/>
                    Platform: {selectedPoint.platform_type}<br/>
                    Date: {new Date(selectedPoint.datetime).toLocaleDateString()}
                  </p>
                  <div className="space-y-2 text-sm text-gray-300 bg-black/20 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Latitude:</span>
                      <span>{selectedPoint.latitude.toFixed(3)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Longitude:</span>
                      <span>{selectedPoint.longitude.toFixed(3)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Temperature:</span>
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{backgroundColor: selectedPoint.color}}
                        ></div>
                        <span>{selectedPoint.temperature}°C</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Salinity:</span>
                      <span>{selectedPoint.salinity} PSU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Pressure:</span>
                      <span>{selectedPoint.pressure} dbar</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPoint(null)}
                    className="mt-6 w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-base font-medium transition-all duration-200 hover:shadow-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                <div className="py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">No point selected</p>
                  <p className="text-base mt-2">Click on a profile to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Globe Container - Desktop */}
        <div className="flex-1 relative overflow-hidden min-w-0 flex items-center justify-center">
          <div className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
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
              onPointClick={(d) => setSelectedPoint(d as Point)}
              rendererConfig={{ 
                antialias: true,
                alpha: true
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col w-full h-full">
        {/* Globe Container - Mobile */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          <div className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
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
              onPointClick={(d) => setSelectedPoint(d as Point)}
              rendererConfig={{ 
                antialias: true,
                alpha: true
              }}
            />
          </div>
        </div>

        {/* Bottom Panel - Mobile */}
        {selectedPoint ? (
          <div className="bg-zinc-900 backdrop-blur-sm border-t border-gray-600 p-4">
            <div className="bg-white/15 backdrop-blur-sm text-white p-4 rounded-xl shadow-xl border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">Profile ID: {selectedPoint.profile_id}</h3>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-100 leading-relaxed mb-3">
                {selectedPoint.project_name} - {selectedPoint.platform_type}<br/>
                <div className="flex items-center mt-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{backgroundColor: selectedPoint.color}}
                  ></div>
                  <span>Temp: {selectedPoint.temperature}°C, Salinity: {selectedPoint.salinity} PSU</span>
                </div>
              </p>
              <div className="flex justify-between text-xs text-gray-300">
                <span>Lat: {selectedPoint.latitude}°</span>
                <span>Lng: {selectedPoint.longitude}°</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-600 p-4">
            <div className="text-center text-gray-400">
              <p className="text-sm">Tap on a profile to see details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
