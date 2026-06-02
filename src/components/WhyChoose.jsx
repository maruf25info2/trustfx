import {
  ShieldCheck,
  Zap,
  Globe,
  Headset,
} from "lucide-react";

export default function WhyChoose() {
  const features = [
    {
      icon: <ShieldCheck size={38} />,
      title: "Secure Platform",
      desc: "Enterprise-grade security, encrypted transactions and advanced account protection.",
    },
    {
      icon: <Zap size={38} />,
      title: "Fast Execution",
      desc: "Lightning-fast order execution with low latency infrastructure.",
    },
    {
      icon: <Globe size={38} />,
      title: "Global Markets",
      desc: "Access Forex, Gold, Crypto, Indices and other major markets.",
    },
    {
      icon: <Headset size={38} />,
      title: "24/7 Support",
      desc: "Professional multilingual support available whenever you need assistance.",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Choose TrustFX
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Everything you need in a modern
            multi-asset trading platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {item.title}
              </h3>

              <p className="text-gray-500 leading-7">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}