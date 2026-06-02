import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const [userAccounts, setUserAccounts] = useState([]);
  const [userDeposits, setUserDeposits] = useState([]);
  const [userWithdrawals, setUserWithdrawals] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      [
        user.full_name,
        user.email,
        user.client_id?.toString(),
        user.phone,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setUsers(data || []);
      setFilteredUsers(data || []);
    }

    setLoading(false);
  };

  const toggleUserStatus = async (user) => {
    const newStatus =
      user.status === "active"
        ? "disabled"
        : "active";

    const { error } = await supabase
      .from("profiles")
      .update({
        status: newStatus,
      })
      .eq("id", user.id);

    if (!error) {
      fetchUsers();
    }
  };

  const loadUserDetails = async (user) => {
    setSelectedUser(user);

    const { data: accounts } = await supabase
      .from("trading_accounts")
      .select("*")
      .eq("user_id", user.id);

    const { data: deposits } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", "Deposit")
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    const { data: withdrawals } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    setUserAccounts(accounts || []);
    setUserDeposits(deposits || []);
    setUserWithdrawals(withdrawals || []);

    const balance = (accounts || []).reduce(
      (sum, acc) =>
        sum + Number(acc.balance || 0),
      0
    );

    setTotalBalance(balance);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">
          Users Management
        </h1>

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-xl px-4 py-3 w-full md:w-96"
        />
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        {loading ? (
          <p>Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b">
                  <th className="text-left py-4">
                    Client ID
                  </th>

                  <th className="text-left py-4">
                    Name
                  </th>

                  <th className="text-left py-4">
                    Phone
                  </th>

                  <th className="text-left py-4">
                    Status
                  </th>

                  <th className="text-left py-4">
                    Join Date
                  </th>

                  <th className="text-left py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b"
                  >
                    <td className="py-4">
                      {user.client_id}
                    </td>

                    <td className="py-4">
                      {user.full_name || "-"}
                    </td>

                    <td className="py-4">
                      {user.phone || "-"}
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status || "active"}
                      </span>
                    </td>

                    <td className="py-4">
                      {new Date(
                        user.created_at
                      ).toLocaleString()}
                    </td>

                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            loadUserDetails(user)
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            toggleUserStatus(user)
                          }
                          className={`px-4 py-2 rounded-lg text-white ${
                            user.status === "active"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        >
                          {user.status === "active"
                            ? "Disable"
                            : "Enable"}
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

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                User Details
              </h2>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="text-red-500 font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <p>
                <strong>Client ID:</strong>{" "}
                {selectedUser.client_id}
              </p>

              <p>
                <strong>Name:</strong>{" "}
                {selectedUser.full_name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedUser.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedUser.phone}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedUser.status}
              </p>

              <p>
                <strong>Join Date:</strong>{" "}
                {new Date(
                  selectedUser.created_at
                ).toLocaleString()}
              </p>

              <hr className="my-6" />

              <h3 className="text-xl font-bold">
                Trading Accounts
              </h3>

              <p>
                Total Accounts: {userAccounts.length}
              </p>

              <hr className="my-6" />

              <h3 className="text-xl font-bold">
                Recent Deposits
              </h3>

              <p>
                Total Deposits Loaded:{" "}
                {userDeposits.length}
              </p>

              <hr className="my-6" />

              <h3 className="text-xl font-bold">
                Recent Withdrawals
              </h3>

              <p>
                Total Withdrawals Loaded:{" "}
                {userWithdrawals.length}
              </p>

              <hr className="my-6" />

              <h3 className="text-xl font-bold">
                Total Balance: $
                {totalBalance}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}