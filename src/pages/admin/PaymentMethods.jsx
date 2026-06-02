import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [methodName, setMethodName] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editMethodName, setEditMethodName] =
    useState("");
  const [editAccountInfo, setEditAccountInfo] =
    useState("");

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .order("id", { ascending: false });

    setMethods(data || []);
  };

  const addMethod = async (e) => {
    e.preventDefault();

    if (!methodName || !accountInfo) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from("payment_methods")
        .insert([
          {
            method_name: methodName,
            account_info: accountInfo,
            status: "active",
          },
        ]);

      if (!error) {
        setMethodName("");
        setAccountInfo("");
        fetchMethods();
      }
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (method) => {
    setEditingId(method.id);
    setEditMethodName(method.method_name);
    setEditAccountInfo(method.account_info);
  };

  const saveEdit = async () => {
    const { error } = await supabase
      .from("payment_methods")
      .update({
        method_name: editMethodName,
        account_info: editAccountInfo,
      })
      .eq("id", editingId);

    if (!error) {
      setEditingId(null);
      fetchMethods();
    }
  };

  const toggleStatus = async (method) => {
    const newStatus =
      method.status === "active"
        ? "disabled"
        : "active";

    const { error } = await supabase
      .from("payment_methods")
      .update({
        status: newStatus,
      })
      .eq("id", method.id);

    if (!error) {
      fetchMethods();
    }
  };

  const deleteMethod = async (id) => {
    if (
      !window.confirm(
        "Delete this payment method?"
      )
    )
      return;

    await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);

    fetchMethods();
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Payment Methods
      </h1>

      <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
        <form
          onSubmit={addMethod}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Method Name"
            value={methodName}
            onChange={(e) =>
              setMethodName(e.target.value)
            }
            className="w-full border rounded-xl p-4"
          />

          <textarea
            placeholder="Account Information"
            value={accountInfo}
            onChange={(e) =>
              setAccountInfo(e.target.value)
            }
            className="w-full border rounded-xl p-4"
            rows="4"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-8 py-4 rounded-xl"
          >
            {loading
              ? "Adding..."
              : "Add Method"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">
          Existing Methods
        </h2>

        <div className="space-y-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className="border rounded-2xl p-5"
            >
              {editingId === method.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editMethodName}
                    onChange={(e) =>
                      setEditMethodName(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl p-3"
                  />

                  <textarea
                    value={editAccountInfo}
                    onChange={(e) =>
                      setEditAccountInfo(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl p-3"
                    rows="3"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl"
                    >
                      Save
                    </button>

                    <button
                      onClick={() =>
                        setEditingId(null)
                      }
                      className="bg-gray-500 text-white px-4 py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">
                        {method.method_name}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          method.status ===
                          "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {method.status ||
                          "active"}
                      </span>
                    </div>

                    <p className="text-gray-600 whitespace-pre-wrap">
                      {
                        method.account_info
                      }
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        startEdit(method)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        toggleStatus(method)
                      }
                      className={`px-4 py-2 rounded-xl text-white ${
                        method.status ===
                        "active"
                          ? "bg-orange-600"
                          : "bg-green-600"
                      }`}
                    >
                      {method.status ===
                      "active"
                        ? "Disable"
                        : "Enable"}
                    </button>

                    <button
                      onClick={() =>
                        deleteMethod(
                          method.id
                        )
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}