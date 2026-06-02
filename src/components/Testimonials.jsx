import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Michael Brown",
      country: "United Kingdom",
      text: "Excellent trading experience with fast execution, tight spreads and professional support.",
    },
    {
      name: "David Wilson",
      country: "Australia",
      text: "The platform is smooth, withdrawals are fast and the trading environment is reliable.",
    },
    {
      name: "Sarah Johnson",
      country: "Canada",
      text: "One of the best brokers I've used. Clean interface and great customer service.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">
            What Traders Say
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Trusted by thousands of traders
            around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-1 mb-5 text-yellow-500">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>

              <p className="text-gray-600 leading-7 mb-8">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {review.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-bold">
                    {review.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {review.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-2xl border">
            <span className="text-yellow-500 text-xl">
              ★★★★★
            </span>

            <span className="font-semibold">
              Rated 4.9/5 by Global Traders
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}