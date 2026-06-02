import {
  Users,
  Globe,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: <Users size={40} />,
      value: "250K+",
      title: "Active Traders",
    },
    {
      icon: <Globe size={40} />,
      value: "120+",
      title: "Countries",
    },
    {
      icon: <BarChart3 size={40} />,
      value: "$850M+",
      title: "Monthly Volume",
    },
    {
      icon: <ShieldCheck size={40} />,
      value: "99.9%",
      title: "Platform Uptime",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">
            Trusted By Traders Worldwide
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Join thousands of traders using
            TrustFX to access global financial
            markets with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="flex justify-center mb-5 text-blue-600">
                {item.icon}
              </div>

              <h3 className="text-4xl font-bold text-slate-900">
                {item.value}
              </h3>

              <p className="mt-3 text-gray-500">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}