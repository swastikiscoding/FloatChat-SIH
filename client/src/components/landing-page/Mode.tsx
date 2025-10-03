import React, { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type ModeType = {
  mode: string;
  about: string;
};

const modes: ModeType[] = [
  { mode: "Student Mode", about: "Simplified insights, guided visuals, and beginner-friendly exploration of ARGO data" },
  { mode: "Researcher Mode", about: "Access advanced analytics, raw ARGO profiles, and in-depth visualizations for scientific discovery" },
  { mode: "Combined Mode", about: "Switch seamlessly between simplified learning and advanced tools — best of both worlds" },
];

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: 'max-w-sm',
  md: 'w-64 h-45',
  lg: 'max-w-lg'
};


const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", x.toFixed(2));
        cardRef.current.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty("--y", y.toFixed(2));
        cardRef.current.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
      }
    };
    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const getSizeClasses = () => (customSize ? "" : sizeMap[size]);

  const getInlineStyles = () => {
    const baseStyles: React.CSSProperties & Record<string, string> = {
      "--base": `${base}`,
      "--spread": `${spread}`,
      "--radius": "14",
      "--border": "3",
      "--backdrop": "rgba(14, 20, 35, 0.7)", // same as gray-900 with opacity



      "--backup-border": "var(--backdrop)",
      "--size": "200",
      "--outer": "1",
      "--border-size": "calc(var(--border, 2) * 1px)",
      "--spotlight-size": "calc(var(--size, 150) * 1px)",
      "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) 100% 70% / 0.1), transparent
      )`,
      backgroundColor: "var(--backdrop, transparent)",
      backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
      backgroundPosition: "50% 50%",
      backgroundAttachment: "fixed",
      border: "var(--border-size) solid var(--backup-border)",
      position: "relative",
      touchAction: "none",
    };

    if (width !== undefined) baseStyles.width = typeof width === "number" ? `${width}px` : width;
    if (height !== undefined) baseStyles.height = typeof height === "number" ? `${height}px` : height;

    return baseStyles;
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) 100% 50% / 1), transparent 100%
      );
      filter: brightness(2);
    }
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 100% 100% / 1), transparent 100%
      );
    }
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? "" : ""}
          rounded-2xl relative flex flex-col justify-center items-center
          shadow-[0_1rem_2rem_-1rem_black] p-4 gap-5
          backdrop-blur-[5px] ${className}
        `}
      >
        <div ref={innerRef} data-glow></div>
        {children}
      </div>
    </>
  );
};

const ModeSection: React.FC = () => {
  return (
    <div className="bg-black text-white pt-3 pb-16 px-6 w-screen ">
      <div className="sm:w-[80vw] mx-auto rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-center mb-8">Choose the mode that fits you</h2>
        <h2 className="font-extralight text-center mb-20">
          Choose your path to discovery — whether you're learning, researching, or exploring it all.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {modes.map((element, idx) => (
            <GlowCard key={idx} glowColor="green" size="md" className="">
              <h3 className="font-semibold text-lg mb-1">{element.mode}</h3>
              <p className="text-sm text-gray-400">{element.about}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeSection;
