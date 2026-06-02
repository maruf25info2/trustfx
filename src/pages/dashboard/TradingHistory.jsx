import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TradingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: accounts } = await supabase
        .from("trading_accounts")
        .select("id, account_number")
        .eq("user_id", user.id);

      const accountMap = {};

      (accounts || []).forEach((account) => {
        accountMap[account.id] =
          account.account_number;
      });

      const { data: deposits } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("id", {
          ascending: false,
        });

      const { data: withdrawals } =
        await supabase
          .from("withdrawals")
          .select("*")
          .eq("user_id", user.id)
          .order("id", {
            ascending: false,
          });

      const depositHistory = (
        deposits || []
      ).map((item) => ({
        ...item,
        history_type: item.type,
        account_number:
          accountMap[item.account_id] ||
          "N/A",
      }));

      const withdrawalHistory = (
        withdrawals || []
      ).map((item) => ({
        ...item,
        history_type: "Withdraw",
        account_number:
          accountMap[item.account_id] ||
          "N/A",
      }));

      const allHistory = [
        ...depositHistory,
        ...withdrawalHistory,
      ];

      allHistory.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

      setHistory(allHistory);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Transaction History
      </h1>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[450px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b">
                  <th className="text-left py-4">
                    Date
                  </th>

                  <th className="text-left py-4">
                    Trading Account
                  </th>

                  <th className="text-left py-4">
                    Type
                  </th>

                  <th className="text-left py-4">
                    Amount
                  </th>

                  <th className="text-left py-4">
                    Method
                  </th>

                  <th className="text-left py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr
                    key={
                      item.history_type +
                      "-" +
                      item.id
                    }
                    className="border-b"
                  >
                    <td className="py-4">
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </td>

                    <td className="py-4 font-medium">
                      #{item.account_number}
                    </td>

                    <td className="py-4">
                      {item.history_type}
                    </td>

                    <td className="py-4">
                      ${item.amount}
                    </td>

                    <td className="py-4">
                      {item.payment_method}
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.status ===
                          "Approved"
                            ? "bg-green-100 text-green-700"
                            : item.status ===
                              "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}