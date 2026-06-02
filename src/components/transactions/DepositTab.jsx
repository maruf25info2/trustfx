import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DepositTab({
  accounts,
  paymentMethods,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [accountId, setAccountId] = useState("");
  const [method, setMethod] = useState("");

  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] =
    useState("");

  const [proofImage, setProofImage] =
    useState(null);

  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts]);

  useEffect(() => {
    if (
      paymentMethods.length > 0 &&
      !method
    ) {
      setMethod(
        paymentMethods[0].method_name
      );
    }
  }, [paymentMethods]);

  const selectedMethod = paymentMethods.find(
    (item) => item.method_name === method
  );

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (
      !accountId ||
      !method ||
      !amount ||
      !transactionId ||
      !proofImage
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

      const { data: selectedAccount } =
        await supabase
          .from("trading_accounts")
          .select("account_type")
          .eq("id", accountId)
          .single();

      if (
        selectedAccount?.account_type
          ?.toLowerCase() === "demo"
      ) {
        setMessage(
          "Deposits are not allowed for Demo Accounts."
        );
        return;
      }

      const fileExt =
        proofImage.name.split(".").pop();

      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("payment-proofs")
          .upload(filePath, proofImage);

      if (uploadError) {
        setMessage(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(filePath);

      const { error } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: user.id,
            account_id: accountId,
            type: "Deposit",
            amount: Number(amount),
            status: "Pending",
            payment_method: method,
            transaction_id: transactionId,
            proof_url: publicUrl,
          },
        ]);

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Deposit request submitted successfully."
        );

        setAmount("");
        setTransactionId("");
        setProofImage(null);
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
      onSubmit={handleDeposit}
      className="space-y-6"
    >
      <div>
        <label className="block mb-2 font-medium">
          Trading Account
        </label>

        <select
          value={accountId}
          onChange={(e) =>
            setAccountId(e.target.value)
          }
          className="w-full border rounded-xl p-4"
        >
          {accounts.map((account) => (
            <option
              key={account.id}
              value={account.id}
            >
              #{account.account_number}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Payment Method
        </label>

        <select
          value={method}
          onChange={(e) =>
            setMethod(e.target.value)
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

      <div className="bg-slate-100 rounded-xl p-4">
        <p className="font-medium">
          Payment Information
        </p>

        <p className="mt-2 text-lg break-all">
          {selectedMethod?.account_info ||
            "No information found"}
        </p>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Amount
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          placeholder="Enter amount"
          className="w-full border rounded-xl p-4"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Transaction ID
        </label>

        <input
          type="text"
          value={transactionId}
          onChange={(e) =>
            setTransactionId(e.target.value)
          }
          placeholder="Enter transaction ID"
          className="w-full border rounded-xl p-4"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Payment Screenshot
        </label>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) =>
            setProofImage(
              e.target.files?.[0] || null
            )
          }
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
        className="bg-blue-700 text-white px-8 py-4 rounded-xl"
      >
        {loading
          ? "Submitting..."
          : "Submit Deposit"}
      </button>
    </form>
  );
}