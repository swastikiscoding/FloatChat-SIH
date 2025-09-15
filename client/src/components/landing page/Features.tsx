import myImage from "../../assets/img.jpg";
import tick from "../../assets/tick.jpg";
import img2 from "../../assets/graph.jpg";
function Features() {
  return (
    <div>
      <div className="flex items-center justify-center text-white text-3xl font-bold">
        AI Features
      </div>
      <div className="cards flex flex-col justify-center items-center gap-20 p-10">
        <div className="c1 flex justify-center items-center gap-19">
          <div className="text  flex flex-col justify-center ">
            <div className="font-semibold text-2xl mb-3">
              Natural Query System
            </div>
            <div className="text-sm font-extralight text-gray-400 mb-3">
              Converse With Ocean Data and get instant, intelligent answers.
            </div>
            <ul className="list-none">
              <li className="flex items-center gap-2 m-2">
                <img src={tick} alt="" className="w-[12px] h-[12px]" />
                <span>Intuitive Discovery</span>
              </li>
              <li className="flex items-center gap-2 m-2">
                <img src={tick} alt="" className="w-[12px] h-[12px]" />
                <span>Effortless Access</span>
              </li>
              <li className="flex items-center gap-2 m-2">
                <img src={tick} alt="" className="w-[12px] h-[12px]" />
                <span>Instant Answers</span>
              </li>
            </ul>
          </div>
          <div className="img  w-1/2 max-w-[400px]">
            <img
              src={myImage}
              alt=""
              className="w-full h-auto shadow-[0_0_15px_5px_rgba(133,147,147,0.6)] rounded-xl"
            />
          </div>
        </div>
        <div className="c2 flex justify-center items-center gap-19">
          <div className="img  w-1/2 max-w-[400px] shadow-[#844747]">
            <img
              src={img2}
              alt=""
              className="max-w-[400px] w-auto h-auto shadow-[0_0_15px_5px_rgba(133,147,147,0.6)] rounded-xl"
            />
          </div>

          <div className="text  flex flex-col justify-center ">
            <div className="font-semibold text-2xl mb-3">
              Virtual Insights and Graphs
            </div>
            <div className="text-sm text-gray-400 font-extralight mb-3">
              Brings your queries to life with auto-generated graphs, maps, and
              profiles — making patterns.
            </div>
            <ul className="list-none">
              <li className="flex items-center gap-2 m-2">
                <img src={tick} alt="" className="w-[12px] h-[12px]" />
                <span>Dynamic Visualizations</span>
              </li>
              <li className="flex items-center gap-2 m-2">
                <img src={tick} alt="" className="w-[12px] h-[12px]" />
                <span>Insightful Comparisons</span>
              </li>
              <li className="flex items-center gap-2 m-2">
                <img src={tick} alt="" className="w-[12px] h-[12px]" />
                <span>Export Ready</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
