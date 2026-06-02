import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import DepositTab from "../../components/transactions/DepositTab";
import WithdrawTab from "../../components/transactions/WithdrawTab";

export default function Transactions() {
  const [activeTab, setActiveTab] =
    useState("deposit");

  const [accounts, setAccounts] = useState([]);
  const [paymentMethods, setPaymentMethods] =
    useState([]);

  useEffect(() => {
    fetchAccounts();
    fetchPaymentMethods();
  }, []);

  const fetchAccounts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("trading_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (data) {
      setAccounts(data);
    }
  };

  const fetchPaymentMethods = async () => {
    const { data } = await supabase
      .from("payment_methods")
      .select("*");

    if (data) {
      setPaymentMethods(data);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Transactions
      </h1>

      <div className="bg-white rounded-3xl shadow-sm p-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() =>
              setActiveTab("deposit")
            }
            className={`px-6 py-3 rounded-xl ${
              activeTab === "deposit"
                ? "bg-blue-700 text-white"
                : "bg-slate-100"
            }`}
          >
            Deposit / Add Fund
          </button>

          <button
            onClick={() =>
              setActiveTab("withdraw")
            }
            className={`px-6 py-3 rounded-xl ${
              activeTab === "withdraw"
                ? "bg-red-600 text-white"
                : "bg-slate-100"
            }`}
          >
            Withdraw
          </button>
        </div>

        {activeTab === "deposit" && (
          <DepositTab
            accounts={accounts}
            paymentMethods={paymentMethods}
          />
        )}

        {activeTab === "withdraw" && (
          <WithdrawTab
            accounts={accounts}
            paymentMethods={paymentMethods}
          />
        )}
      </div>
    </div>
  );
}