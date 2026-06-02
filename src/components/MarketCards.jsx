import { useEffect, useState } from "react";
import { fetchMarketData } from "../services/marketData";

export default function MarketCards() {
  const [markets, setMarkets] = useState([
    {
      name: "EUR/USD",
      price: "...",
      change: "LIVE",
    },
    {
      name: "BTC/USD",
      price: "...",
      change: "LIVE",
    },
    {
      name: "GOLD",
      price: "...",
      change: "LIVE",
    },
  ]);

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 75000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const data = await fetchMarketData();

    if (!data) return;

    setMarkets([
      {
        name: "EUR/USD",
        price: data.eurusd || "...",
        change: "LIVE",
      },
      {
        name: "BTC/USD",
        price: `$${data.btc}` || "...",
        change: "LIVE",
      },
      {
        name: "GOLD",
        price: `$${data.gold}` || "...",
        change: "LIVE",
      },
    ]);
  };

  return (
    <section
      id="markets"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-10 text-center">
          Popular Markets
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {markets.map((market) => (
            <div
              key={market.name}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">
                  {market.name}
                </h3>

<span
  className={`text-sm font-semibold ${
    market.flash === "up"
      ? "text-green-600"
      : market.flash === "down"
      ? "text-red-600"
      : "text-slate-500"
  }`}
>
  {market.flash === "up"
    ? "▲ +0.12%"
    : market.flash === "down"
    ? "▼ -0.08%"
    : "● LIVE"}
</span>
              </div>

              <p className="text-3xl font-bold text-slate-900 mt-5">
                {market.price}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Real Time Market Price
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}