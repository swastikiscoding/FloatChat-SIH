import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import myImage from "../../assets/img2.jpeg";
import tick from "../../assets/tick.jpg";
import img2 from "../../assets/new_graph.png";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const floatAnim = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as
        | [0.42, 0, 0.58, 1]
        | "linear"
        | "easeIn"
        | "easeOut"
        | "easeInOut",
    },
  },
};

function Features() {
  return (
    <div>
      <div className="flex items-center justify-center text-2xl sm:text-3xl font-bold pb-5 text-white">
  AI Features
</div>


      <motion.div
        className="cards flex flex-col justify-center items-center gap-15 sm:gap-20 p-10"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Card 1 */}
        <motion.div
          className="c1 flex justify-center items-center gap-12 sm:gap-19"
          variants={item}
        >
          <div className="text flex flex-col justify-center">
            <div className="font-semibold text-xl sm:text-2xl mb-3">
              Natural Query System
            </div>
            <div className="text-xs sm:text-sm font-extralight text-gray-400 mb-5">
              Converse With Ocean Data and get instant, intelligent answers.
            </div>
            <motion.ul className="list-none" variants={container}>
              {[
                "Intuitive Discovery",
                "Effortless Access",
                "Instant Answers",
              ].map((point, i) => (
                <motion.li
                  key={i}
                  className="text-sm sm:text-base flex items-center gap-2 m-2"
                  variants={item}
                >
                  <img src={tick} alt="" className="w-[12px] h-[12px]" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.div className="img w-1/2 max-w-[400px]" {...floatAnim}>
            <img
              src={myImage}
              alt=""
              className="w-full h-auto shadow-[0_0_15px_5px_rgba(133,147,147,0.6)] rounded-xl"
            />
          </motion.div>
        </motion.div>
        <div className="block md:hidden border-t border-gray-300 w-full mx-auto"></div>

        {/* Card 2 */}
        <motion.div
          className="c2 flex justify-center items-center gap-12 sm:gap-19"
          variants={item}
        >
          <motion.div className="img w-1/2 max-w-[400px]" {...floatAnim}>
            <img
              src={img2}
              alt=""
              className="w-full h-auto shadow-[0_0_15px_5px_rgba(133,147,147,0.6)] rounded-xl"
            />
          </motion.div>

          <div className="text flex flex-col justify-center">
            <div className="font-semibold text-xl sm:text-2xl mb-3">
              Virtual Insights and Graphs
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-extralight mb-5">
              Brings your queries to life with auto-generated graphs, maps, and{" "}
              <br />
              profiles — making patterns.
            </div>
            <motion.ul className="list-none" variants={container}>
              {[
                "Dynamic Visualizations",
                "Insightful Comparisons",
                "Export Ready",
              ].map((point, i) => (
                <motion.li
                  key={i}
                  className="text-sm sm:text-base flex items-center gap-2 m-2"
                  variants={item}
                >
                  <img src={tick} alt="" className="w-[12px] h-[12px]" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Features;
