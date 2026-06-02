import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const { data: withdrawalsData, error } =
        await supabase
          .from("withdrawals")
          .select("*")
          .order("id", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      const withdrawals = withdrawalsData || [];

      const userIds = [
        ...new Set(
          withdrawals.map(
            (item) => item.user_id
          )
        ),
      ];

      const accountIds = [
        ...new Set(
          withdrawals.map(
            (item) => item.account_id
          )
        ),
      ];

      const { data: profiles } =
        await supabase
          .from("profiles")
          .select("id, client_id")
          .in("id", userIds);

      const { data: accounts } =
        await supabase
          .from("trading_accounts")
          .select("id, account_number")
          .in("id", accountIds);

      const profileMap = {};
      const accountMap = {};

      (profiles || []).forEach((item) => {
        profileMap[item.id] = item;
      });

      (accounts || []).forEach((item) => {
        accountMap[item.id] = item;
      });

      const enrichedWithdrawals =
        withdrawals.map((withdrawal) => ({
          ...withdrawal,
          client_id:
            profileMap[
              withdrawal.user_id
            ]?.client_id || "-",
          account_number:
            accountMap[
              withdrawal.account_id
            ]?.account_number || "-",
        }));

      setWithdrawals(
        enrichedWithdrawals
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (
    withdrawal
  ) => {
    try {
      if (
        withdrawal.status !== "Pending"
      ) {
        alert("Already processed.");
        return;
      }

      setProcessingId(withdrawal.id);

      const {
        data: latestWithdrawal,
      } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("id", withdrawal.id)
        .single();

      if (
        !latestWithdrawal ||
        latestWithdrawal.status !==
          "Pending"
      ) {
        alert("Already processed.");
        return;
      }

      const { data: account } =
        await supabase
          .from("trading_accounts")
          .select("*")
          .eq(
            "id",
            latestWithdrawal.account_id
          )
          .single();

      if (!account) {
        alert(
          "Trading account not found."
        );
        return;
      }

      const currentBalance = Number(
        account.balance || 0
      );

      const withdrawAmount = Number(
        latestWithdrawal.amount || 0
      );

      if (
        withdrawAmount >
        currentBalance
      ) {
        alert(
          "Insufficient account balance."
        );
        return;
      }

      const newBalance =
        currentBalance -
        withdrawAmount;

      const {
        error: balanceError,
      } = await supabase
        .from("trading_accounts")
        .update({
          balance: newBalance,
        })
        .eq("id", account.id);

      if (balanceError) {
        alert(balanceError.message);
        return;
      }

      const {
        error: statusError,
      } = await supabase
        .from("withdrawals")
        .update({
          status: "Approved",
        })
        .eq(
          "id",
          latestWithdrawal.id
        );

      if (statusError) {
        alert(statusError.message);
        return;
      }
await supabase
  .from("notifications")
  .insert([
    {
      user_id:
        latestWithdrawal.user_id,
      title:
        "Withdrawal Approved",
      message: `Your withdrawal request of $${latestWithdrawal.amount} has been approved.`,
    },
  ]);
      alert("Withdrawal approved.");

      fetchWithdrawals();
    } catch (error) {
      console.log(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (
    withdrawal
  ) => {
    try {
      if (
        withdrawal.status !== "Pending"
      ) {
        alert("Already processed.");
        return;
      }

      setProcessingId(withdrawal.id);

      const { error } =
        await supabase
          .from("withdrawals")
          .update({
            status: "Rejected",
          })
          .eq("id", withdrawal.id);

if (error) {
  alert(error.message);
} else {
  await supabase
    .from("notifications")
    .insert([
      {
        user_id:
          withdrawal.user_id,
        title:
          "Withdrawal Rejected",
        message: `Your withdrawal request of $${withdrawal.amount} has been rejected.`,
      },
    ]);

  alert(
    "Withdrawal rejected."
  );

  fetchWithdrawals();
}
    } catch (error) {
      console.log(error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Withdrawal Requests
      </h1>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        {loading ? (
          <p>Loading...</p>
        ) : withdrawals.length === 0 ? (
          <p>No withdrawals found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">
                    Client ID
                  </th>

                  <th className="text-left py-4 px-4">
                    Trading Account
                  </th>

                  <th className="text-left py-4 px-4">
                    Amount
                  </th>

                  <th className="text-left py-4 px-4">
                    Method
                  </th>

                  <th className="text-left py-4 px-4">
                    Details
                  </th>

                  <th className="text-left py-4 px-4">
                    Status
                  </th>

                  <th className="text-left py-4 px-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {withdrawals.map(
                  (withdrawal) => (
                    <tr
                      key={withdrawal.id}
                      className="border-b"
                    >
                      <td className="py-4 px-4">
                        {
                          withdrawal.client_id
                        }
                      </td>

                      <td className="py-4 px-4 font-semibold">
                        {
                          withdrawal.account_number
                        }
                      </td>

                      <td className="py-4 px-4 font-medium">
                        $
                        {
                          withdrawal.amount
                        }
                      </td>

                      <td className="py-4 px-4">
                        {
                          withdrawal.payment_method
                        }
                      </td>

                      <td className="py-4 px-4">
                        {
                          withdrawal.account_details
                        }
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            withdrawal.status ===
                            "Approved"
                              ? "bg-green-100 text-green-700"
                              : withdrawal.status ===
                                "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {
                            withdrawal.status
                          }
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            disabled={
                              withdrawal.status !==
                                "Pending" ||
                              processingId ===
                                withdrawal.id
                            }
                            onClick={() =>
                              handleApprove(
                                withdrawal
                              )
                            }
                            className={`px-3 py-2 rounded-lg text-sm text-white ${
                              withdrawal.status !==
                              "Pending"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            Approve
                          </button>

                          <button
                            disabled={
                              withdrawal.status !==
                                "Pending" ||
                              processingId ===
                                withdrawal.id
                            }
                            onClick={() =>
                              handleReject(
                                withdrawal
                              )
                            }
                            className={`px-3 py-2 rounded-lg text-sm text-white ${
                              withdrawal.status !==
                              "Pending"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}