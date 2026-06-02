

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  MailCheck,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
export default function DashboardHome() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalBalance, setTotalBalance] =
  useState(0);

const [liveAccounts, setLiveAccounts] =
  useState(0);

const [pendingAccounts, setPendingAccounts] =
  useState(0);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false });

if (!error) {
  const accountData = data || [];

  setAccounts(accountData);

  const balance = accountData.reduce(
    (sum, account) =>
      sum + Number(account.balance || 0),
    0
  );

  setTotalBalance(balance);

  setLiveAccounts(
    accountData.filter(
      (account) =>
        account.account_type === "Live"
    ).length
  );

  setPendingAccounts(
    accountData.filter(
      (account) =>
        account.status === "Pending"
    ).length
  );
}
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
        <h2 className="text-3xl font-bold mb-3">
          Welcome to TrustFX
        </h2>

        <p className="text-gray-600">
          Complete account management, account opening,
          trading activities and account monitoring from one place.
        </p>
      </div>

<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
  <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
    <p className="text-gray-500 mb-2">
      Total Balance
    </p>

    <h2 className="text-3xl font-bold text-green-600">
      ${totalBalance.toFixed(2)}
    </h2>
  </div>

  <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
    <p className="text-gray-500 mb-2">
      Total Accounts
    </p>

    <h2 className="text-3xl font-bold">
      {accounts.length}
    </h2>
  </div>

  <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
    <p className="text-gray-500 mb-2">
      Live Accounts
    </p>

    <h2 className="text-3xl font-bold text-blue-600">
      {liveAccounts}
    </h2>
  </div>

  <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
    <p className="text-gray-500 mb-2">
      Pending Accounts
    </p>

    <h2 className="text-3xl font-bold text-orange-500">
      {pendingAccounts}
    </h2>
  </div>
</div>

{/* Verification */}
<div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-300 mb-8">
<div className="mb-8">
  <h3 className="text-2xl font-bold">
    Profile Verification
  </h3>

  <p className="text-gray-500 mt-2">
    Complete your profile verification
    and maintain account security.
  </p>
</div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
<div className="bg-slate-50 rounded-2xl p-6 text-center border">
<div className="w-16 h-16 rounded-2xl bg-green-100 mx-auto flex items-center justify-center text-green-600 text-3xl">
  <MailCheck size={32} />
</div>

  <h4 className="font-semibold mt-5">
    Email Verification
  </h4>

  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
    Verified
  </span>
</div>


          </div>

          <div className="text-center">
            <div className="bg-slate-50 rounded-2xl p-6 text-center border">
 <div className="w-16 h-16 rounded-2xl bg-yellow-100 mx-auto flex items-center justify-center text-yellow-600">
  <FileCheck size={32} />
</div>

  <h4 className="font-semibold mt-5">
    Document Verification
  </h4>

  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
    Pending
  </span>
</div>


          </div>

<div className="bg-slate-50 rounded-2xl p-6 text-center border">
<div className="w-16 h-16 rounded-2xl bg-blue-100 mx-auto flex items-center justify-center text-blue-600">
  <ShieldCheck size={32} />
</div>

  <h4 className="font-semibold mt-5">
    Account Status
  </h4>

  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
    Active
  </span>
</div>
        </div>
      </div>

      {/* Accounts */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-5">
          Trading Accounts
        </h3>

        {loading ? (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
            Loading accounts...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
              >
<div className="flex justify-between items-center">
  <h4 className="font-bold text-lg">
    {account.account_type} Account
  </h4>

  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      account.account_type === "Live"
        ? "bg-green-100 text-green-700"
        : "bg-orange-100 text-orange-700"
    }`}
  >
    {account.account_type}
  </span>
</div>

<p className="text-gray-500 mt-3">
  Account No: #{account.account_number}
</p>

<div className="grid grid-cols-2 gap-4 mt-5 text-sm">
  <div>
    <p className="text-gray-500">
      Currency
    </p>

    <p className="font-semibold">
      {account.currency}
    </p>
  </div>

  <div>
    <p className="text-gray-500">
      Leverage
    </p>

    <p className="font-semibold">
      {account.leverage}
    </p>
  </div>
</div>

<div className="mt-6 flex items-end justify-between">
  <div>
    <p className="text-sm text-gray-500">
      Balance
    </p>

    <p className="text-3xl font-bold text-green-600">
      ${Number(account.balance).toFixed(2)}
    </p>
  </div>

  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${
      account.status === "Active"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {account.status}
  </span>
</div>


              </div>
            ))}

            <div className="bg-white rounded-3xl p-6 shadow-sm flex items-center justify-center">
              <span className="text-5xl text-gray-400">
                +
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold mb-4">
            Recent Deposits & Withdrawals
          </h3>

          <p className="text-gray-500">
            No transactions found.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold mb-4">
            Recent Messages
          </h3>

          <p className="text-gray-500">
            No messages available.
          </p>
        </div>
      </div>
    </div>
  );
}