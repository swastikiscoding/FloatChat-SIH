import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { Globe, Calendar, X } from "lucide-react"

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

interface EarthSidebarProps {
  selectedDate: string;
  selectedPoint: Point | null;
  points: Point[];
  isLoading: boolean;
  onClosePoint: () => void;
  onDateChange?: (date: string) => void;
}

export function EarthSidebar({ 
  selectedDate, 
  selectedPoint, 
  points, 
  isLoading, 
  onClosePoint,
  onDateChange 
}: EarthSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarHeader className="bg-gray-950">
        {/* Mobile Close Button and Logo */}
        <div className="flex items-center justify-between px-0 pt-2 ml-1 mt-1">
          <button className="flex items-center">
            <Globe className="w-6 h-6 text-cyan-400" />
            <span className="text-xl md:text-2xl pl-3 group-data-[collapsible=icon]:hidden">
              Argo Profiles
            </span>
          </button>
          
          {/* Close button - only visible on mobile */}
          {isMobile && (
            <button 
              onClick={() => setOpenMobile(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors mr-2 md:hidden"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          )}
        </div> 
       
        {/* Date Selection */}
        {onDateChange && (
          <div className="flex flex-col px-2 p-2 mt-3 md:mt-4 mb-2 rounded-lg text-gray-200 text-xs md:text-sm group-data-[collapsible=icon]:hidden">
            <span className="text-xs md:text-sm ml-1 mb-2 text-cyan-400">
              Date Selection
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-gray-800/50 text-white border border-white/20 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 hover:border-white/40 hover:bg-gray-800/70"
              min="2020-01-01"
              max="2025-12-31"
            />
          </div>
        )}

        {/* Date Info */}
        <div className="flex items-center px-2 p-2 mt-3 md:mt-4 mb-2 rounded-lg text-gray-200 text-xs md:text-sm">
          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
          <div className="pl-1 group-data-[collapsible=icon]:hidden">
            <div className="text-white text-sm md:text-base font-medium">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-gray-400 text-xs md:text-sm">
              {points.length} profiles • Tap points for details
            </div>
          </div>
          {isLoading && (
            <div className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-cyan-400 border-t-transparent rounded-full ml-auto"></div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-0 m-0">
          {selectedPoint ? (
            <div className="p-2 md:p-4">
              <div className="bg-gray-900/80 backdrop-blur-sm text-white p-3 md:p-4 rounded-lg shadow-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <h3 className="text-sm md:text-lg font-semibold text-white">Profile ID: {selectedPoint.profile_id}</h3>
                  <button
                    onClick={onClosePoint}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="bg-gray-800/50 rounded-md p-2 md:p-3">
                    <div className="text-cyan-400 font-medium mb-1 md:mb-2 text-xs md:text-sm">Project Details</div>
                    <div className="space-y-1 text-gray-300">
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>Project:</span>
                        <span className="text-white font-medium truncate ml-2">{selectedPoint.project_name}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>Platform:</span>
                        <span className="text-white font-medium truncate ml-2">{selectedPoint.platform_type}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>Date:</span>
                        <span className="text-white font-medium">{new Date(selectedPoint.datetime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-md p-2 md:p-3">
                    <div className="text-cyan-400 font-medium mb-1 md:mb-2 text-xs md:text-sm">Location</div>
                    <div className="space-y-1 text-gray-300">
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>Latitude:</span>
                        <span className="text-white font-medium">{selectedPoint.latitude.toFixed(3)}°</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>Longitude:</span>
                        <span className="text-white font-medium">{selectedPoint.longitude.toFixed(3)}°</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-md p-2 md:p-3">
                    <div className="text-cyan-400 font-medium mb-1 md:mb-2 text-xs md:text-sm">Measurements</div>
                    <div className="space-y-1 text-gray-300">
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span>Temperature:</span>
                        <div className="flex items-center">
                          <div 
                            className="w-2 h-2 md:w-3 md:h-3 rounded-full mr-2" 
                            style={{backgroundColor: selectedPoint.color}}
                          ></div>
                          <span className="text-white font-medium">{selectedPoint.temperature}°C</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>Salinity:</span>
                        <span className="text-white font-medium">{selectedPoint.salinity} PSU</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>Pressure:</span>
                        <span className="text-white font-medium">{selectedPoint.pressure} dbar</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={onClosePoint}
                  className="mt-3 md:mt-4 w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-xs md:text-sm font-medium transition-all duration-200 text-gray-200 hover:text-white"
                >
                  Close Details
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 md:p-6 text-center text-gray-400 group-data-[collapsible=icon]:hidden">
              <div className="py-6 md:py-8">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 bg-gray-800/50 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-300">No point selected</p>
                <p className="text-xs mt-1 text-gray-500">Tap on a profile to view details</p>
              </div>
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-gray-950">
        <div className="text-xs text-gray-500 text-center p-2 group-data-[collapsible=icon]:hidden">
          Argo Float Data Visualization
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}