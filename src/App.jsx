import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

import DashboardHome from "./pages/dashboard/DashboardHome";
import OpenAccount from "./pages/dashboard/OpenAccount";
import Transactions from "./pages/dashboard/Transactions";
import TradingHistory from "./pages/dashboard/TradingHistory";
import Settings from "./pages/dashboard/Settings";


import AdminDashboard from "./pages/admin/AdminDashboard";
import Deposits from "./pages/admin/Deposits";
import Withdrawals from "./pages/admin/Withdrawals";
import PaymentMethods from "./pages/admin/PaymentMethods";
import Users from "./pages/admin/Users";


import ProtectedAdmin from "./components/ProtectedAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />}
/>

        {/* Admin Routes */}
        <Route
  path="/admin"
  element={
    <ProtectedAdmin>
      <AdminLayout />
    </ProtectedAdmin>
  }
>
  <Route
    index
    element={<AdminDashboard />}
  />

  <Route
    path="deposits"
    element={<Deposits />}
  />

  <Route
    path="withdrawals"
    element={<Withdrawals />}
  />

  <Route
    path="payment-methods"
    element={<PaymentMethods />}
  />

  <Route
    path="users"
    element={<Users />}
  />
</Route>

        {/* User Dashboard Routes */}
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={<DashboardHome />}
          />

          <Route
            path="open-account"
            element={<OpenAccount />}
          />

          <Route
            path="transactions"
            element={<Transactions />}
          />

          <Route
            path="trading-history"
            element={<TradingHistory />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}