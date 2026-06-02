import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Deposits() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      setLoading(true);

      const { data: depositsData, error } =
        await supabase
          .from("transactions")
          .select("*")
          .eq("type", "Deposit")
          .order("id", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      const deposits = depositsData || [];

      const userIds = [
        ...new Set(
          deposits.map((item) => item.user_id)
        ),
      ];

      const accountIds = [
        ...new Set(
          deposits.map((item) => item.account_id)
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

      const enrichedDeposits =
        deposits.map((deposit) => ({
          ...deposit,
          client_id:
            profileMap[deposit.user_id]
              ?.client_id || "-",
          account_number:
            accountMap[
              deposit.account_id
            ]?.account_number || "-",
        }));

      setDeposits(enrichedDeposits);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (deposit) => {
    try {
      if (deposit.status !== "Pending") {
        alert(
          "This deposit has already been processed."
        );
        return;
      }

      setProcessingId(deposit.id);

      const {
        data: latestDeposit,
        error: depositError,
      } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", deposit.id)
        .single();

      if (
        depositError ||
        !latestDeposit ||
        latestDeposit.status !== "Pending"
      ) {
        alert("Deposit already processed.");
        return;
      }

      const {
        data: account,
        error: accountError,
      } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq(
          "id",
          latestDeposit.account_id
        )
        .single();

      if (accountError || !account) {
        alert("Trading account not found.");
        return;
      }

      const newBalance =
        Number(account.balance || 0) +
        Number(
          latestDeposit.amount || 0
        );

      const { error: balanceError } =
        await supabase
          .from("trading_accounts")
          .update({
            balance: newBalance,
          })
          .eq("id", account.id);

      if (balanceError) {
        alert(balanceError.message);
        return;
      }

      const { error: statusError } =
        await supabase
          .from("transactions")
          .update({
            status: "Approved",
          })
          .eq("id", latestDeposit.id);
await supabase
  .from("notifications")
  .insert([
    {
      user_id:
        latestDeposit.user_id,
      title:
        "Deposit Approved",
      message: `Your deposit of $${latestDeposit.amount} has been approved successfully.`,
    },
  ]);
      if (statusError) {
        alert(statusError.message);
        return;
      }

      alert(
        "Deposit approved successfully."
      );

      fetchDeposits();
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (deposit) => {
    try {
      if (deposit.status !== "Pending") {
        alert(
          "This deposit has already been processed."
        );
        return;
      }

      setProcessingId(deposit.id);

      const { error } = await supabase
        .from("transactions")
        .update({
          status: "Rejected",
        })
        .eq("id", deposit.id)
        .eq("status", "Pending");

if (error) {
  alert(error.message);
} else {
  await supabase
    .from("notifications")
    .insert([
      {
        user_id:
          deposit.user_id,
        title:
          "Deposit Rejected",
        message: `Your deposit request of $${deposit.amount} has been rejected.`,
      },
    ]);

  alert("Deposit rejected.");

  fetchDeposits();
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
        Deposit Requests
      </h1>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        {loading ? (
          <p>Loading...</p>
        ) : deposits.length === 0 ? (
          <p>No deposits found.</p>
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
                    Transaction ID
                  </th>

                  <th className="text-left py-4 px-4">
                    Status
                  </th>

                  <th className="text-left py-4 px-4">
                    Proof
                  </th>

                  <th className="text-left py-4 px-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {deposits.map((deposit) => (
                  <tr
                    key={deposit.id}
                    className="border-b"
                  >
                    <td className="py-4 px-4">
                      {deposit.client_id}
                    </td>

                    <td className="py-4 px-4 font-semibold">
                      {
                        deposit.account_number
                      }
                    </td>

                    <td className="py-4 px-4 font-medium">
                      ${deposit.amount}
                    </td>

                    <td className="py-4 px-4">
                      {deposit.payment_method}
                    </td>

                    <td className="py-4 px-4">
                      {deposit.transaction_id}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          deposit.status ===
                          "Approved"
                            ? "bg-green-100 text-green-700"
                            : deposit.status ===
                              "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {deposit.status}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {deposit.proof_url ? (
                        <a
                          href={
                            deposit.proof_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Proof
                        </a>
                      ) : (
                        "No Proof"
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          disabled={
                            deposit.status !==
                              "Pending" ||
                            processingId ===
                              deposit.id
                          }
                          onClick={() =>
                            handleApprove(
                              deposit
                            )
                          }
                          className={`px-3 py-2 rounded-lg text-sm text-white ${
                            deposit.status !==
                            "Pending"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          Approve
                        </button>

                        <button
                          disabled={
                            deposit.status !==
                              "Pending" ||
                            processingId ===
                              deposit.id
                          }
                          onClick={() =>
                            handleReject(
                              deposit
                            )
                          }
                          className={`px-3 py-2 rounded-lg text-sm text-white ${
                            deposit.status !==
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}