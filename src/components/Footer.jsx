export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-slate-950 text-white pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-blue-500">
              Trust
              <span className="text-green-500">
                FX
              </span>
            </h2>

            <p className="mt-4 text-gray-400">
              Trade Forex, Crypto,
              Commodities and Indices
              with confidence through a
              professional trading platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Quick Links
            </h3>

            <div className="space-y-3 text-gray-400">
              <a
                href="#"
                className="block hover:text-white"
              >
                Home
              </a>

              <a
                href="#markets"
                className="block hover:text-white"
              >
                Markets
              </a>

              <a
                href="#about"
                className="block hover:text-white"
              >
                About
              </a>

              <a
                href="#contact"
                className="block hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Support
            </h3>

            <div className="space-y-3 text-gray-400">
              <p>support@trustfx.com</p>
              <p>+1 (000) 000-0000</p>
              <p>24/7 Customer Support</p>
            </div>
          </div>

          {/* Risk Warning */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Risk Warning
            </h3>

            <p className="text-gray-400 text-sm leading-6">
              Trading leveraged products
              carries a high level of risk
              and may not be suitable for
              all investors. Please ensure
              you fully understand the
              risks involved.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 TrustFX. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}