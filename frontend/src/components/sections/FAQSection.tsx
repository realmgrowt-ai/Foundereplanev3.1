import { motion } from "framer-motion";
import { Plus, X, Rocket, Layers, Users, Briefcase } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    icon: Layers,
    question: "What are the Partner Benefits?",
    answer: "Partner benefits are customized based on the nature of your business and your specific needs. Upon approval, we unlock access to relevant Tech Credits, tools, and resources that best support your growth stage."
  },
  {
    icon: Users,
    question: "Do I need a huge budget?",
    answer: "No. We use Proven Systems. We analyze your competitors and deploy strategies that are already working in the market, so you don't waste money testing things that fail."
  },
  {
    icon: Rocket,
    question: "Different from agencies?",
    answer: "Agencies typically focus on 'Spend' and 'Vanity Metrics' like views or likes. We focus entirely on your Net Profit, Unit Economics, and sustainable growth. We build the system; we don't just run the ads."
  },
  {
    icon: Briefcase,
    question: "What if I get stuck?",
    answer: "You are never alone. You get direct access to our Command Center. We don't ghost our founders—we are your Co-Pilots until the system is stable."
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(221_73%_49%/0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative z-10 px-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Sticky Left Title */}
          <motion.div 
            className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              FAQs
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 leading-tight">
              Frequently<br />
              Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-slate-600 mt-4 max-w-sm">
              Got questions? We've got answers. Here are the most common inquiries about FounderPlane.
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const Icon = faq.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div
                    className={`
                      bg-white border rounded-2xl overflow-hidden cursor-pointer
                      transition-all duration-300
                      ${isOpen 
                        ? 'border-primary/40 shadow-lg shadow-primary/10' 
                        : 'border-slate-200 hover:border-primary/30 hover:shadow-md'
                      }
                    `}
                    onClick={() => toggleFAQ(index)}
                  >
                    {/* Header */}
                    <div className="p-6 flex items-start gap-4">
                      {/* Icon */}
                      <div 
                        className={`
                          w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                          transition-colors duration-300
                          ${isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}
                        `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Question */}
                      <div className="flex-1 pt-2">
                        <h3 className="font-display font-semibold text-slate-900 text-lg leading-snug">
                          {faq.question}
                        </h3>
                      </div>

                      {/* Toggle Icon */}
                      <div 
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-2
                          transition-colors duration-300
                          ${isOpen ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-400'}
                        `}
                      >
                        {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Answer */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-6 pl-[88px]">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;