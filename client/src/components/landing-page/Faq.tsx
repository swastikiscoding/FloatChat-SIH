import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; 

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How does FloatChat make ocean data easier to use?",
    answer:
      "FloatChat transforms raw Argo float datasets into a searchable format and lets you interact with them through simple chat queries. Instead of handling complex NetCDF files, you can just ask questions in natural language and get visual insights instantly."
  },
  {
    id: 2,
    question: "What kind of information can I get from Argo floats?",
    answer:
      "You can get information such as ocean temperature, salinity, depth profiles, and other scientific parameters."
  },
  {
    id: 3,
    question: "How does the real-time query system work?",
    answer:
      "The system processes user queries instantly, retrieves relevant datasets, and presents structured insights."
  },
  {
    id: 4,
    question: "Is the data reliable and up-to-date?",
    answer:
      "Yes, the data is updated regularly from global ocean monitoring sources to ensure accuracy."
  },
  {
    id: 5,
    question: "How does FloatChat help students and researchers?",
    answer:
      "It simplifies access to complex datasets, making ocean research more approachable for students and professionals alike."
  }
];

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-black text-white py-10 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Everything You Need To Know</h1>
      <p className="text-center text-gray-400 mb-10">FAQs</p>

      <div className="space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border-b border-gray-700 pb-4 cursor-pointer"
            onClick={() => toggleFAQ(faq.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-semibold">
                  {faq.id.toString().padStart(2, "0")}
                </span>
                <span
                  className={`font-semibold ${
                    openId === faq.id ? "text-cyan-400" : "text-white"
                  }`}
                >
                  {faq.question}
                </span>
              </div>
              {openId === faq.id ? (
                <ChevronUp className="text-cyan-400" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </div>

            {openId === faq.id && (
              <p className="mt-3 text-gray-300 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
