import { useState, useEffect, useRef } from "react";
import { ChevronDown, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const options: string[] = ["Student", "Research", "Combined"];

const ModeSelect = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative group" 
      ref={dropdownRef}
    >
      <div className="relative" >
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center px-1 p-2 mt-2 mb-2 w-full rounded-lg text-gray-200 text-sm border border-white/40 transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800/50 hover:border-white/50"
        >
          {/* Left side: icon + label */}
          <div className="flex items-center justify-center gap-2 w-17/20">
            <Star size={18} className="text-cyan-400" />
            <span
              className={`mr-auto group-data-[collapsible=icon]:hidden ml-1 ${
                selected ? "text-gray-200 text-sm" : "text-gray-400"
              }`}
            >
              {selected || "Select a mode"}
            </span>
          </div>

          {/* Right side: chevron */}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="group-data-[collapsible=icon]:hidden"
          >
            <ChevronDown size={18} className="text-cyan-400" />
          </motion.div>
        </button>




        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 mt-1 w-25 bg-gray-900 border border-cyan-400/20 rounded-lg shadow-lg z-[1000]"
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelected(option)
                    setOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white rounded-md"
                >
                  {option}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModeSelect;
