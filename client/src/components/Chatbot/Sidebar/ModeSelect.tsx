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
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full pl-2 py-2 border border-white/40 rounded-lg text-gray-200 text-sm focus:outline-none"
        >

        <Star size={16} className="text-cyan-400 mr-[4px]" />

        <span className={`${selected ? "" : "text-gray-400"} group-data-[collapsible=icon]:hidden`}>
            {selected || "Select a mode"}
        </span>

          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-cyan-400 group-data-[collapsible=icon]:hidden mr-3" />
          </motion.div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full mt-1 bg-gray-900 border border-cyan-400/20 rounded-lg shadow-lg z-10"
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setOpen(false);
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
