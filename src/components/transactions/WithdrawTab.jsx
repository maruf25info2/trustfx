import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function WithdrawTab({
  accounts,
  paymentMethods,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [withdrawAccount, setWithdrawAccount] =
    useState(accounts?.[0]?.id || "");

  const [withdrawMethod, setWithdrawMethod] =
    useState(
      paymentMethods?.[0]?.method_name || ""
    );

  const [withdrawAmount, setWithdrawAmount] =
    useState("");

  const [withdrawDetails, setWithdrawDetails] =
    useState("");

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (
      !withdrawAccount ||
      !withdrawAmount ||
      !withdrawMethod ||
      !withdrawDetails
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", user.id)
        .single();

      if (profile?.status === "disabled") {
        setMessage(
          "Your account has been disabled. Please contact support."
        );
        return;
      }

      const { data: account } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("id", withdrawAccount)
        .single();

      if (!account) {
        setMessage("Trading account not found.");
        return;
      }

      if (
        account?.account_type?.toLowerCase() ===
        "demo"
      ) {
        setMessage(
          "Withdrawals are not allowed for Demo Accounts."
        );
        return;
      }

      if (
        Number(withdrawAmount) >
        Number(account.balance)
      ) {
        setMessage("Insufficient balance.");
        return;
      }

      const { error } = await supabase
        .from("withdrawals")
        .insert([
          {
            user_id: user.id,
            account_id: withdrawAccount,
            amount: Number(withdrawAmount),
            payment_method: withdrawMethod,
            account_details: withdrawDetails,
            status: "Pending",
          },
        ]);

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Withdrawal request submitted successfully."
        );

        setWithdrawAmount("");
        setWithdrawDetails("");
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleWithdraw}
      className="space-y-6"
    >
      <div>
        <label className="block mb-2 font-medium">
          Trading Account
        </label>

        <select
          value={withdrawAccount}
          onChange={(e) =>
            setWithdrawAccount(e.target.value)
          }
          className="w-full border rounded-xl p-4"
        >
          {accounts.map((account) => (
            <option
              key={account.id}
              value={account.id}
            >
              #{account.account_number} -{" "}
              {account.account_type} - $
              {account.balance}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Withdraw Method
        </label>

        <select
          value={withdrawMethod}
          onChange={(e) =>
            setWithdrawMethod(e.target.value)
          }
          className="w-full border rounded-xl p-4"
        >
          {paymentMethods.map((item) => (
            <option
              key={item.id}
              value={item.method_name}
            >
              {item.method_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Wallet / Number
        </label>

        <input
          type="text"
          value={withdrawDetails}
          onChange={(e) =>
            setWithdrawDetails(e.target.value)
          }
          placeholder="Enter wallet or number"
          className="w-full border rounded-xl p-4"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Amount
        </label>

        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) =>
            setWithdrawAmount(e.target.value)
          }
          placeholder="Enter amount"
          className="w-full border rounded-xl p-4"
        />
      </div>

      {message && (
        <div className="bg-slate-100 p-4 rounded-xl">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 text-white px-8 py-4 rounded-xl"
      >
        {loading
          ? "Submitting..."
          : "Submit Withdrawal"}
      </button>
    </form>
  );
}