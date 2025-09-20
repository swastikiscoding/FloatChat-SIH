import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"


function Input({ className, ...props }: React.ComponentProps<"textarea">) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="relative w-full">
      <textarea
        rows={1}
        placeholder="Argo data made easy..."
        className={cn(
          "w-full min-h-20 max-h-22 px-5 pr-14 py-3 resize-none rounded-2xl outline-none",
          "bg-gradient-to-b from-black/25 to-gray-900/70 dark:from-gray-900/50 dark:to-gray-950/70",
          "border border-white/15 shadow-[0_0_20px_rgba(0,0,0,0.6)]",
          "text-gray-200 placeholder:text-gray-500 text-base",
          "overflow-auto",
          "shadow-[1px_1px_10px_rgba(0,200,255,0.3)]",
          'text-sm font-light text-gray-300',
          'placeholder:text-[15px]',
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
            buttonRef.current?.click();
          }
        }}
        {...props}
      />

      {/* Arrow Button */}
      <button
        ref={buttonRef}
        type="submit"
        className="absolute bottom-4 right-3 flex items-center justify-center h-7 w-7 rounded-full border border-white/20 bg-cyan-400 hover:bg-cyan-600 transition"
      >
        <ArrowUp 
        className="h-5 w-4 text-gray-900 transition-transform duration-200 hover:scale-120" 
        strokeWidth={2.5}
        />
      </button>
    </div>
  )
}

export { Input }
