import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // slower staggering
      // delayChildren: 0.2,    // slight delay before first card
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      // type: "tween",       // 👈 smooth instead of spring
      duration: 0.6,       // longer duration = smoother
      ease: "easeOut" as const,     // smoother finish
    },
  },
};


const features = [
  {
    feature: "Real Time Ocean Data",
    about: "Access up-to-date float measurements like temperature and salinity",
  },
  {
    feature: "AI-Powered Insights",
    about:
      "RAG enables precise answers by combining database queries with AI understanding",
  },
  {
    feature: "GeoSpatial Exploaration",
    about: "Locate floats on interactive map and track their trajectories",
  },
  {
    feature: "Interactive Dashboards",
    about: "Visualize float data with charts, maps, and timeline views.",
  },
  {
    feature: "Scalable Data Pipelines",
    about:
      "Handles large volumes of Argo NetCDF files efficiently for future expansion.",
  },
  {
    feature: "User-friendly Interface",
    about: "Clean design tailored for both experts and non-technical users.",
  },
];

const Mainfeatures = () => {
  return (
    <div className="bg-black text-white py-16 px-6">
      <div className="sm:w-[80vw] mx-auto bg-black rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-center mb-8">
          Explore the Ocean with Intelligent Search
        </h2>
        <h2 className="font-extralight text-center mb-10">
          Type your query, and let AI fetch data, maps, and visualizations
          instantly
        </h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center sm:pl-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((element, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="sm:w-8/10 bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition"
            >
              <h3 className="font-semibold text-lg mb-3">{element.feature}</h3>
              <div className="flex flex-col gap-1 text-sm text-gray-400">
                <div className="hover:text-cyan-400">{element.about}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Mainfeatures;
