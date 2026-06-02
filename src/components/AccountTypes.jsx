import { Check } from "lucide-react";

export default function AccountTypes() {
  const plans = [
    {
      name: "Standard",
      deposit: "$100",
      spread: "From 1.5 pips",
      leverage: "1:100",
      popular: false,
    },
    {
      name: "Pro",
      deposit: "$1,000",
      spread: "From 0.8 pips",
      leverage: "1:200",
      popular: true,
    },
    {
      name: "VIP",
      deposit: "$10,000",
      spread: "From 0.1 pips",
      leverage: "1:500",
      popular: false,
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">
            Account Types
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Choose the account that matches your
            trading style and experience level.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
                plan.popular
                  ? "border-blue-600"
                  : "border-slate-100"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-2 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-3xl font-bold mb-2">
                {plan.name}
              </h3>

              <p className="text-gray-500 mb-8">
                Professional trading account
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Check
                    size={18}
                    className="text-green-600"
                  />

                  <span>
                    Minimum Deposit:
                    <strong> {plan.deposit}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Check
                    size={18}
                    className="text-green-600"
                  />

                  <span>
                    Spread:
                    <strong> {plan.spread}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Check
                    size={18}
                    className="text-green-600"
                  />

                  <span>
                    Leverage:
                    <strong> {plan.leverage}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Check
                    size={18}
                    className="text-green-600"
                  />

                  <span>Fast Deposits</span>
                </div>

                <div className="flex items-center gap-3">
                  <Check
                    size={18}
                    className="text-green-600"
                  />

                  <span>Fast Withdrawals</span>
                </div>
              </div>

              <button
                className={`w-full mt-10 py-3 rounded-xl font-semibold transition ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                Open Account
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}