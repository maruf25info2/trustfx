import { useState } from "react";
import {
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-screen w-72 bg-slate-900 text-white p-6 z-50 transform transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <h1 className="text-3xl font-bold mb-10">
          TrustFX Admin
        </h1>

        <nav className="space-y-3">
          <Link
            to="/admin"
            onClick={() =>
              setSidebarOpen(false)
            }
            className={`block px-4 py-3 rounded-xl transition ${
              location.pathname === "/admin"
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/admin/deposits"
            onClick={() =>
              setSidebarOpen(false)
            }
            className={`block px-4 py-3 rounded-xl transition ${
              location.pathname ===
              "/admin/deposits"
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            💰 Deposits
          </Link>

          <Link
            to="/admin/withdrawals"
            onClick={() =>
              setSidebarOpen(false)
            }
            className={`block px-4 py-3 rounded-xl transition ${
              location.pathname ===
              "/admin/withdrawals"
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            💸 Withdrawals
          </Link>

          <Link
            to="/admin/payment-methods"
            onClick={() =>
              setSidebarOpen(false)
            }
            className={`block px-4 py-3 rounded-xl transition ${
              location.pathname ===
              "/admin/payment-methods"
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            🏦 Payment Methods
          </Link>

          <Link
            to="/admin/users"
            onClick={() =>
              setSidebarOpen(false)
            }
            className={`block px-4 py-3 rounded-xl transition ${
              location.pathname ===
              "/admin/users"
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`}
          >
            👥 Users
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl transition"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b px-4 h-16 flex items-center">
          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="text-2xl"
          >
            ☰
          </button>

          <h2 className="ml-4 font-bold text-lg">
            TrustFX Admin
          </h2>
        </header>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}