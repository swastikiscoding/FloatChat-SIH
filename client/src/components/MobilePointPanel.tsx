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

interface MobilePointPanelProps {
  selectedPoint: Point | null;
  onClosePoint: () => void;
}

export default function MobilePointPanel({ selectedPoint, onClosePoint }: MobilePointPanelProps) {
  if (!selectedPoint) {
    return (
      <div className="bg-gray-950 backdrop-blur-sm border-t border-gray-600 p-4 lg:hidden">
        <div className="text-center text-gray-400">
          <p className="text-sm">Tap on a profile to see details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 backdrop-blur-sm border-t border-gray-600 p-4 lg:hidden">
      <div className="bg-white/15 backdrop-blur-sm text-white p-4 rounded-xl shadow-xl border border-white/10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white">Profile ID: {selectedPoint.profile_id}</h3>
          <button
            onClick={onClosePoint}
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
  );
}