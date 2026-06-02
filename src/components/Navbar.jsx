import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="text-3xl font-bold text-blue-700"
        >
          Trust
          <span className="text-green-500">
            FX
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 font-medium text-gray-700">
          <a
            href="#"
            className="hover:text-blue-700 transition"
          >
            Home
          </a>

          <a
            href="#"
            className="hover:text-blue-700 transition"
          >
            Markets
          </a>

          <a
            href="#"
            className="hover:text-blue-700 transition"
          >
            Platforms
          </a>

          <a
            href="#"
            className="hover:text-blue-700 transition"
          >
            About
          </a>

          <a
            href="#"
            className="hover:text-blue-700 transition"
          >
            Contact
          </a>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden md:block px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg transition"
          >
            Register
          </Link>

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="md:hidden text-xl"
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="flex flex-col p-4">
            <a
              href="#"
              className="py-3 border-b"
            >
              Home
            </a>

            <a
  href="#markets"
  className="hover:text-blue-700 transition"
>
  Markets
</a>

            <a
              href="#"
              className="py-3 border-b"
            >
              Platforms
            </a>

<a
  href="#about"
  className="hover:text-blue-700 transition"
>
  About
</a>

           <a
  href="#contact"
  className="hover:text-blue-700 transition"
>
  Contact
</a>

            <Link
              to="/login"
              className="mt-4 border rounded-lg py-3 text-center"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}