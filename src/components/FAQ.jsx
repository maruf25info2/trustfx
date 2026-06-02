import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] =
    useState(0);

  const faqs = [
    {
      q: "How do I open an account?",
      a: "Click the Register button and complete the signup process. Once your account is created, you can open a trading account from your dashboard.",
    },
    {
      q: "What markets can I trade?",
      a: "You can trade Forex, Gold, Crypto, Commodities, Indices and other popular financial instruments.",
    },
    {
      q: "Is the platform mobile friendly?",
      a: "Yes. TrustFX is fully responsive and works smoothly on desktop, tablet and mobile devices.",
    },
    {
      q: "How can I contact support?",
      a: "You can reach our support team through live chat, email and the support center available in your dashboard.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-500 mt-4">
            Find answers to common questions
            about TrustFX.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.q}
              className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(
                    openIndex === index
                      ? -1
                      : index
                  )
                }
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-lg">
                  {faq.q}
                </span>

                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    openIndex === index
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-7">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Still have questions?
          </p>

          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}