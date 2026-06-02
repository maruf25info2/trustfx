import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [pendingDeposits, setPendingDeposits] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] =
    useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        });

      const { count: accountsCount } =
        await supabase
          .from("trading_accounts")
          .select("*", {
            count: "exact",
            head: true,
          });

      const { count: depositsCount } =
        await supabase
          .from("transactions")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("type", "Deposit")
          .eq("status", "Pending");

      const { count: withdrawalsCount } =
        await supabase
          .from("withdrawals")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("status", "Pending");

      setTotalUsers(usersCount || 0);
      setTotalAccounts(accountsCount || 0);
      setPendingDeposits(
        depositsCount || 0
      );
      setPendingWithdrawals(
        withdrawalsCount || 0
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <p className="text-gray-500 mb-2">
            Total Users
          </p>

          <h2 className="text-4xl font-bold">
            {totalUsers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <p className="text-gray-500 mb-2">
            Trading Accounts
          </p>

          <h2 className="text-4xl font-bold">
            {totalAccounts}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <p className="text-gray-500 mb-2">
            Pending Deposits
          </p>

          <h2 className="text-4xl font-bold text-orange-500">
            {pendingDeposits}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <p className="text-gray-500 mb-2">
            Pending Withdrawals
          </p>

          <h2 className="text-4xl font-bold text-red-500">
            {pendingWithdrawals}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">
        <h2 className="text-2xl font-bold mb-4">
          System Overview
        </h2>

        <p className="text-gray-600">
          Welcome to TrustFX Admin Panel.
          Manage users, deposits,
          withdrawals and trading accounts
          from one place.
        </p>
      </div>
    </div>
  );
}