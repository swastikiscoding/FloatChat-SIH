import React, { useEffect, useRef } from 'react';


type TeamMember = {
  name: string;
  github: string;
  linkedin: string;
};

const team: TeamMember[] = [
  { name: "Swastik", github: "https://github.com/swastikiscoding", linkedin: "https://linkedin.com/in/swastik220705" },
  { name: "Ark Malhotra", github: "https://github.com/SqrtNegativOne",linkedin: "https://linkedin.com/in/ark-malhotra-431938323" },
  { name: "Daksh Dagar", github: "https://github.com/DakshDagar01 ", linkedin: "https://linkedin.com/in/daksh-dagar-481269322" },
  { name: "Pradeep Yadav", github: "https://github.com/me-pradeep", linkedin: "https://linkedin.com/in/me-pradeep" },
  { name: "Sakshi", github: "https://github.com/Sakshi7654", linkedin: "https://linkedin.com/in/sakshi-gupta-974869349" },
  { name: "Yash Tayal", github: "https://github.com/yashtayalcse", linkedin: "https://www.linkedin.com/in/yash-tayal-7272452b5/" },
];

const DevTeam: React.FC = () => {
   const topRef = useRef<HTMLDivElement>(null);
const rightRef = useRef<HTMLDivElement>(null);
const bottomRef = useRef<HTMLDivElement>(null);
const leftRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
        const animateBorder = () => {
          const now = Date.now() / 1000;
          const speed = 0.5; // Animation speed
          
          // Calculate positions based on time
          const topX = Math.sin(now * speed) * 100;
          const rightY = Math.cos(now * speed) * 100;
          const bottomX = Math.sin(now * speed + Math.PI) * 100;
          const leftY = Math.cos(now * speed + Math.PI) * 100;
          
          // Apply positions to elements
          if (topRef.current) topRef.current.style.transform = `translateX(${topX}%)`;
          if (rightRef.current) rightRef.current.style.transform = `translateY(${rightY}%)`;
          if (bottomRef.current) bottomRef.current.style.transform = `translateX(${bottomX}%)`;
          if (leftRef.current) leftRef.current.style.transform = `translateY(${leftY}%)`;
          
          requestAnimationFrame(animateBorder);
        };
        
        const animationId = requestAnimationFrame(animateBorder);
        return () => cancelAnimationFrame(animationId);
      }, []);
  return (
  <div className="bg-black text-white py-16 px-6">
    <div className="relative max-w-4xl mx-auto overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 shadow-[0_0_40px_rgba(133,147,147,0.3)]">
      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-0.5 overflow-hidden">
        <div 
          ref={topRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
        ></div>
      </div>

      {/* Right border */}
      <div className="absolute top-0 right-0 w-0.5 h-full overflow-hidden">
        <div 
          ref={rightRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/70 to-transparent"
        ></div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
        <div 
          ref={bottomRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
        ></div>
      </div>

      {/* Left border */}
      <div className="absolute top-0 left-0 w-0.5 h-full overflow-hidden">
        <div 
          ref={leftRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/70 to-transparent"
        ></div>
      </div>

      {/* Content */}
      <h2 className="text-3xl font-bold text-center mb-12">Our Dev Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(133,147,147,0.6)] transition"
          >
            <h3 className="font-semibold text-lg mb-3">{member.name}</h3>
            <div className="flex flex-col gap-1 text-sm text-gray-400">
              <a href={member.github} target="_blank" className="hover:text-cyan-400">
                Github
              </a>
              <a href={member.linkedin} target="_blank" className="hover:text-cyan-400">
                Linkedin
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default DevTeam;
