import { useState, useRef, useEffect } from "react";
import { type GlobeMethods } from "react-globe.gl";
import { axiosInstance } from "../utils/axiosInstance";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { EarthSidebar } from "./EarthSidebar";
import EarthMainContent from "./EarthMainContent";

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
  onDateChange?: (date: string) => void;
}

export default function Earth({ selectedDate, onDateChange }: EarthProps) {
  return (
    <div className="flex h-screen w-full bg-gray-950 overflow-hidden">
      <SidebarProvider>
        <EarthContent selectedDate={selectedDate} onDateChange={onDateChange} />
      </SidebarProvider>
    </div>
  );
}

function EarthContent({ selectedDate, onDateChange }: EarthProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setOpen, state } = useSidebar();
  const isAutoOpeningRef = useRef(false);

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

  // Enhanced point click handler
  const handlePointClick = (point: Point) => {
    setSelectedPoint(point);
    // Auto-open sidebar if collapsed
    if (state === "collapsed") {
      isAutoOpeningRef.current = true;
      setOpen(true);
      // Reset the flag after the animation
      setTimeout(() => {
        isAutoOpeningRef.current = false;
      }, 300);
    }
  };

  // Enhanced close handler
  const handleClosePoint = () => {
    setSelectedPoint(null);
  };

  // Listen for sidebar collapse to reset point (only if not auto-opening)
  useEffect(() => {
    if (state === "collapsed" && selectedPoint && !isAutoOpeningRef.current) {
      setSelectedPoint(null);
    }
  }, [state, selectedPoint]);

  return (
    <>
      <EarthSidebar 
        selectedDate={selectedDate}
        selectedPoint={selectedPoint}
        points={points}
        isLoading={isLoading}
        onClosePoint={handleClosePoint}
        onDateChange={onDateChange}
      />
      <EarthMainContent 
        globeEl={globeEl}
        points={points}
        isLoading={isLoading}
        selectedPoint={selectedPoint}
        onPointClick={handlePointClick}
        onClosePoint={handleClosePoint}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
    </>
  );
}
