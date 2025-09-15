type modes = {
  name: string;
  github: string;
  linkedin: string;
};

const modes=[
  { mode: "Student Mode", about: "Simplified insights, guided visuals, and beginner-friendly exploration of ARGO data"},
  { mode: "Researcher Mode", about: "Access advanced analytics, raw ARGO profiles, and in-depth visualizations for scientific discovery"},
  { mode: "Combined Mode", about: "Switch seamlessly between simplified learning and advanced tools — best of both worlds"},
];  
const Mode = () => {
  return (
    <div className="bg-black text-white py-16 px-6 w-screen">
      <div className="sm:w-[80vw] mx-auto bg-black rounded-2xl p-10 shadow-[0_0_40px_rgba(133,147,147,0.3)]">
        <h2 className="text-3xl font-bold text-center mb-8">Choose the mode that fits you</h2>
        <h2 className="font-extralight text-center mb-10">Choose your path to discovery — whether you're learning, researching, or exploring it all.</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center sm:pl-10">
          {modes.map((element,idx)=>(
            <div
              key={idx}
              className="sm:w-8/10 bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(133,147,147,0.6)] transition"
            >
              <h3 className="font-semibold text-lg mb-3">{element.mode}</h3>
              <div className="flex flex-col gap-1 text-sm text-gray-400">
                <div className="hover:text-cyan-400">
                    {element.about}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mode
