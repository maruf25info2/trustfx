export default function Hero() {
  return (
    <section className="bg-slate-900 text-white min-h-screen flex items-center pt-22 pb-15">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div>
            <span className="inline-block bg-blue-700/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Trusted Global Trading Platform
            </span>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Trade Global Markets
              <span className="block text-blue-500">
                With Confidence
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mb-8">
              Access Forex, Crypto, Commodities and Indices through a
              professional multi-asset trading platform.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
                ✓ Secure Trading
              </span>

              <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
                ✓ Fast Withdrawals
              </span>

              <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
                ✓ Multi Asset Broker
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold shadow-lg transition">
                Open Live Account
              </button>

              <button className="border border-gray-500 hover:border-white px-8 py-4 rounded-xl font-semibold transition">
                View Markets
              </button>
            </div>
          </div>

          {/* Right Side Card */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">
              Market Overview
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span>EUR/USD</span>
                <span className="font-bold text-green-600">
                  1.0872
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>BTC/USD</span>
                <span className="font-bold text-green-600">
                  $105,400
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>GOLD</span>
                <span className="font-bold text-green-600">
                  $3,320
                </span>
              </div>

              <div className="flex justify-between">
                <span>NASDAQ</span>
                <span className="font-bold text-green-600">
                  21,550
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-slate-100 rounded-xl p-4">
                <h4 className="text-sm text-gray-500">
                  Active Traders
                </h4>

                <p className="text-2xl font-bold">
                  250K+
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <h4 className="text-sm text-gray-500">
                  Monthly Volume
                </h4>

                <p className="text-2xl font-bold">
                  $850M+
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6 text-center">
              <div>
                <p className="text-gray-500 text-xs">
                  Accounts
                </p>

                <p className="font-bold text-sm">
                  10K+
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">
                  Assets
                </p>

                <p className="font-bold text-sm">
                  250+
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">
                  Uptime
                </p>

                <p className="font-bold text-sm">
                  99.9%
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}