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
  selectedDate: string;
  points: Point[];
  isLoading: boolean;
  onDateChange?: (date: string) => void;
}

export default function MobilePointPanel({ 
  selectedPoint, 
  onClosePoint, 
  selectedDate, 
  points, 
  isLoading, 
  onDateChange 
}: MobilePointPanelProps) {
  return (
    <div className="bg-gray-950 backdrop-blur-sm border-t border-gray-600 p-3 md:hidden">
      {/* Date Selection and Stats - Always visible on mobile */}
      <div className="mb-3">
        <div className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl shadow-xl border border-white/10">
          {/* Date Picker Section */}
          {onDateChange && (
            <div className="mb-3">
              <label className="text-cyan-400 text-sm font-medium mb-2 block">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full bg-gray-800/50 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200"
                min="2020-01-01"
                max="2025-12-31"
              />
            </div>
          )}
          
          {/* Date Info and Stats */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white text-sm font-medium">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-gray-400 text-xs">
                {points.length} profiles available
              </div>
            </div>
            {isLoading && (
              <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* Point Details - Only when point is selected */}
      {selectedPoint ? (
        <div className="bg-white/15 backdrop-blur-sm text-white p-3 rounded-xl shadow-xl border border-white/10">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold text-white">Profile ID: {selectedPoint.profile_id}</h3>
            <button
              onClick={onClosePoint}
              className="text-gray-300 hover:text-white p-1 touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-xs text-gray-100 leading-relaxed mb-3">
            <div className="truncate mb-1">{selectedPoint.project_name} - {selectedPoint.platform_type}</div>
            <div className="flex items-center mt-1">
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                style={{backgroundColor: selectedPoint.color}}
              ></div>
              <span>Temp: {selectedPoint.temperature}°C, Salinity: {selectedPoint.salinity} PSU</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-300">
            <span>Lat: {selectedPoint.latitude.toFixed(3)}°</span>
            <span>Lng: {selectedPoint.longitude.toFixed(3)}°</span>
          </div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl shadow-xl border border-white/10">
          <div className="text-center text-gray-400">
            <p className="text-sm">Tap on a profile to see details</p>
          </div>
        </div>
      )}
    </div>
  );
}