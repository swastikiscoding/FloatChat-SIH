import { useState, useRef } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";

interface Point {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  description: string;
}

export default function Earth() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const points: Point[] = [
    {
      lat: 28.6139,
      lng: 77.209,
      size: 1.5,
      color: "red",
      label: "New Delhi",
      description: "Capital of India, population ~32M"
    },
    {
      lat: 40.7128,
      lng: -74.006,
      size: 1.5,
      color: "blue",
      label: "New York",
      description: "Known as the Big Apple 🍎"
    },
    {
      lat: 35.6895,
      lng: 139.6917,
      size: 1.5,
      color: "green",
      label: "Tokyo",
      description: "Largest metro area in the world 🌏"
    }
  ];

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full h-full">
        {/* Left Sidebar - Desktop */}
        <div className="w-96 bg-gray-900/95 backdrop-blur-sm flex flex-col border-r border-gray-600 flex-shrink-0">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-white text-2xl font-bold">Globe Points</h2>
            <p className="text-gray-300 text-base mt-2">Click on a point to see details</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {selectedPoint ? (
              <div className="p-6">
                <div className="bg-white/15 backdrop-blur-sm text-white p-6 rounded-xl shadow-xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-3">{selectedPoint.label}</h3>
                  <p className="text-base text-gray-100 leading-relaxed mb-4">{selectedPoint.description}</p>
                  <div className="space-y-2 text-sm text-gray-300 bg-black/20 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Latitude:</span>
                      <span>{selectedPoint.lat}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Longitude:</span>
                      <span>{selectedPoint.lng}°</span>
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">No point selected</p>
                  <p className="text-base mt-2">Click on a point on the globe to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Globe Container - Desktop */}
        <div className="flex-1 relative md:overflow-hidden min-w-0">
          <Globe
            ref={globeEl}
            globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png" pointsData={points}
            pointLat={(d) => (d as Point).lat}
            pointLng={(d) => (d as Point).lng}
            pointColor={(d) => (d as Point).color}
            pointAltitude={0.02}
            pointRadius={(d) => (d as Point).size}
            pointLabel={(d) => `${(d as Point).label}`} // tooltip
            onPointClick={(d) => setSelectedPoint(d as Point)} // click handler
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col w-full h-full">
        {/* Globe Container - Mobile */}
        <div className="flex-1 relative overflow-hidden">
          <Globe
            ref={globeEl}
            globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png" pointsData={points}
            pointLat={(d) => (d as Point).lat}
            pointLng={(d) => (d as Point).lng}
            pointColor={(d) => (d as Point).color}
            pointAltitude={0.02}
            pointRadius={(d) => (d as Point).size}
            pointLabel={(d) => `${(d as Point).label}`} // tooltip
            onPointClick={(d) => setSelectedPoint(d as Point)} // click handler
          />
        </div>

        {/* Bottom Panel - Mobile */}
        {selectedPoint ? (
          <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-600 p-4">
            <div className="bg-white/15 backdrop-blur-sm text-white p-4 rounded-xl shadow-xl border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{selectedPoint.label}</h3>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-100 leading-relaxed mb-3">{selectedPoint.description}</p>
              <div className="flex justify-between text-xs text-gray-300">
                <span>Lat: {selectedPoint.lat}°</span>
                <span>Lng: {selectedPoint.lng}°</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-600 p-4">
            <div className="text-center text-gray-400">
              <p className="text-sm">Tap on a point on the globe to see details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
