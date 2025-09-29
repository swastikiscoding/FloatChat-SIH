import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"


interface InputProps extends Omit<React.ComponentProps<"textarea">, 'onSubmit'> {
  onSubmit?: (value: string) => void;
}

function Input({ className, onSubmit, ...props }: InputProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [value, setValue] = React.useState("");

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  return (
    <div className="relative w-[81%] mx-auto">
      <textarea
        rows={1}
        placeholder="Ask about sea temperature, salinity, or trends..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          "w-full min-h-15 md:min-h-20 max-h-20 md:max-h-22 px-3 md:px-5 pr-12 md:pr-14 py-2 md:py-3 resize-none rounded-2xl outline-none",
          "bg-gradient-to-b from-black/25 to-gray-900/70 dark:from-gray-900/50 dark:to-gray-950/70",
          "border border-white/15 shadow-[0_0_20px_rgba(0,0,0,0.6)]",
          "text-gray-200 placeholder:text-gray-500 text-sm md:text-base",
          "overflow-auto",
          'font-light text-gray-300',
          'placeholder:text-sm md:placeholder:text-[15px]',
          className
        )}
        onInput={e => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          const maxHeight = 120; // 30 * 4px (Tailwind's h-30 = 120px)
          if (target.scrollHeight > maxHeight) {
            target.style.height = maxHeight + "px";
            target.style.overflowY = "auto";
          } else {
            target.style.height = target.scrollHeight + "px";
            target.style.overflowY = "hidden";
          }
        }}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        {...props}
      />

      {/* Arrow Button */}
      <button
        ref={buttonRef}
        type="submit"
        onClick={handleSubmit}
        disabled={!value.trim()}
        className={cn(
          "absolute bottom-2 md:bottom-4 right-2 md:right-3 flex items-center justify-center h-6 w-6 md:h-7 md:w-7 rounded-full border border-white/20 transition",
          value.trim() 
            ? "bg-cyan-400 hover:bg-cyan-600" 
            : "bg-gray-600 cursor-not-allowed"
        )}
      >
        <ArrowUp 
        className="h-4 w-3 md:h-5 md:w-4 text-gray-900 transition-transform duration-200 hover:scale-120" 
        strokeWidth={2.5}
        />
      </button>
    </div>
  )
}

export { Input }
