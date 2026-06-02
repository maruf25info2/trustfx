import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function OpenAccount() {
  const [accountType, setAccountType] = useState("Live");
  const [platform, setPlatform] = useState("MT5");
  const [currency, setCurrency] = useState("USD");
  const [leverage, setLeverage] = useState("1:100");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generateAccountNumber = () => {
    return Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please login first.");
        return;
      }

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

      const accountNumber = generateAccountNumber();

      const { error } = await supabase
        .from("trading_accounts")
        .insert([
          {
            user_id: user.id,
            account_number: accountNumber,
            account_type: accountType,
            platform: platform,
            currency: currency,
            leverage: leverage,
            balance: 0,
            status: "Active",
          },
        ]);

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          `Trading Account Created Successfully. Account Number: ${accountNumber}`
        );
      }
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Open Trading Account
      </h1>

      <div className="bg-white rounded-3xl shadow-sm p-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">
                Account Type
              </label>

              <select
                value={accountType}
                onChange={(e) =>
                  setAccountType(e.target.value)
                }
                className="w-full border rounded-xl p-4"
              >
                <option>Live</option>
                <option>Demo</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Trading Platform
              </label>

              <select
                value={platform}
                onChange={(e) =>
                  setPlatform(e.target.value)
                }
                className="w-full border rounded-xl p-4"
              >
                <option>MT5</option>
                <option>Web Trader</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Currency
              </label>

              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value)
                }
                className="w-full border rounded-xl p-4"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Leverage
              </label>

              <select
                value={leverage}
                onChange={(e) =>
                  setLeverage(e.target.value)
                }
                className="w-full border rounded-xl p-4"
              >
                <option>1:100</option>
                <option>1:200</option>
                <option>1:500</option>
              </select>
            </div>
          </div>

          {message && (
            <div className="mt-6 p-4 rounded-xl bg-slate-100">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
          >
            {loading
              ? "Creating Account..."
              : "Open Trading Account"}
          </button>
        </form>
      </div>
    </div>
  );
}