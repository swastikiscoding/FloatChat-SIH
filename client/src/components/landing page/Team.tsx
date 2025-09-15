import React from "react";

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
  return (
    <div className="bg-black text-white py-16 px-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 shadow-[0_0_40px_rgba(133,147,147,0.3)]">
        <h2 className="text-3xl font-bold text-center mb-12">Our Dev Team</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(133,147,147,0.6)] transition"
            >
              <h3 className="font-semibold text-lg mb-3">{member.name}</h3>
              <div className="flex flex-col gap-1 text-sm text-gray-400">
                <a
                  href={member.github}
                  target="_blank"
                  className="hover:text-cyan-400"
                >
                  Github
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  
                  className="hover:text-cyan-400"
                >
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
