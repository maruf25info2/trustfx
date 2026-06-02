import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  useState,
  useEffect,
  useRef,
} from "react";
import { supabase } from "../lib/supabase";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [profile, setProfile] =
    useState(null);
const [notifications, setNotifications] =
  useState([]);
const [unreadCount, setUnreadCount] =
  useState(0);
const [
  showNotifications,
  setShowNotifications,
] = useState(false);
const profileMenuRef = useRef(null);

    const [sidebarOpen, setSidebarOpen] =
  useState(false);

useEffect(() => {
  loadProfile();
  loadNotifications();

  const interval =
    setInterval(() => {
      loadNotifications();
    }, 5000);

  return () =>
    clearInterval(interval);
}, []);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(
        event.target
      )
    ) {
      setShowProfileMenu(false);
setShowNotifications(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);
  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
const loadNotifications =
  async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(10);

      setNotifications(data || []);

setUnreadCount(
  (data || []).filter(
    (item) => !item.is_read
  ).length
);
    } catch (error) {
      console.log(error);
    }
  };
  const markNotificationsAsRead =
  async () => {
    try {
      const unreadIds =
        notifications
          .filter(
            (item) => !item.is_read
          )
          .map((item) => item.id);

      if (
        unreadIds.length === 0
      ) {
        return;
      }

      await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .in("id", unreadIds);

      loadNotifications();
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside
  className={`
    fixed lg:static
    top-0 left-0
    h-screen
    w-72
    bg-white
    border-r
    z-50
    transform
    transition-transform
    duration-300
    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full"
    }
    lg:translate-x-0
  `}
>
        <div className="p-8">
          
          <h1 className="text-4xl font-bold text-blue-700">
            Trust
            <span className="text-green-500">
              FX
            </span>

          </h1>
          <p className="text-sm text-gray-500 mt-2">
  Trade With Confidence
</p>
        </div>

        <nav className="px-5 space-y-2">
<Link
  to="/dashboard"
  onClick={() => setSidebarOpen(false)}
  className={`block px-4 py-3 rounded-xl transition ${
    location.pathname === "/dashboard"
      ? "bg-blue-600 text-white"
      : "hover:bg-slate-100 hover:translate-x-1"
  }`}
>
  📊 Dashboard
</Link>

<Link
  to="/dashboard/open-account"
  onClick={() => setSidebarOpen(false)}
  className={`block px-4 py-3 rounded-xl transition ${
  location.pathname ===
  "/dashboard/open-account"
    ? "bg-blue-600 text-white"
    : "hover:bg-slate-100 hover:translate-x-1"
}`}
>
  💼 Open Account
</Link>

<Link
  to="/dashboard/transactions"
  onClick={() => setSidebarOpen(false)}
  className={`block px-4 py-3 rounded-xl transition ${
    location.pathname === "/dashboard/transactions"
      ? "bg-blue-600 text-white"
      : "hover:bg-slate-100 hover:translate-x-1"
  }`}
>
  💳 Transactions
</Link>

          <Link
            to="/dashboard/trading-history"
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-3 rounded-xl transition ${
  location.pathname ===
  "/dashboard/trading-history"
    ? "bg-blue-600 text-white"
    : "hover:bg-slate-100 hover:translate-x-1"
}`}
          >
            📈 Trading History
          </Link>

        

          <Link
            to="/dashboard/settings"
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-3 rounded-xl transition ${
  location.pathname ===
"/dashboard/settings"
    ? "bg-blue-600 text-white"
    : "hover:bg-slate-100 hover:translate-x-1"
}`}
          >
            ⚙️ Settings
          </Link>
          <div className="mt-8 px-5">
  <button
    onClick={handleLogout}
    className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-xl transition"
  >
    🚪 Sign Out
  </button>
</div>
        </nav>
      </aside>

{sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
    onClick={() =>
      setSidebarOpen(false)
    }
  />
)}

      <main className="flex-1">
        {/* Header */}
        <header className="bg-white h-20 border-b px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
  <button
    onClick={() =>
      setSidebarOpen(!sidebarOpen)
    }
    className="lg:hidden text-2xl"
  >
    ☰
  </button>

  <div className="hidden md:flex gap-8 text-sm font-medium">
    <span>📅 Economic Calendar</span>
    <span>⬇ Downloads</span>
    <span>🎧 Support</span>
  </div>
 </div>

          <div
  ref={profileMenuRef}
  className="relative flex items-center gap-4"
>
<button
  onClick={() => {
    setShowNotifications(
      !showNotifications
    );

    markNotificationsAsRead();
  }}
  className="relative p-2 text-xl"
>
  🔔

 {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</button>
            <button
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-slate-400 text-white flex items-center justify-center">
                {initials}
              </div>

              <p className="font-semibold">
                {profile?.full_name ||
                  "Loading..."}
              </p>
            </button>
{showNotifications && (
  <div className="absolute right-0 top-14 w-[320px] max-w-[90vw] bg-white border rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
    <div className="p-4 border-b font-semibold">
      Notifications
    </div>

    {notifications.length === 0 ? (
      <div className="p-4 text-gray-500">
        No notifications
      </div>
    ) : (
 notifications.map((item) => (
  <div
    key={item.id}
    className={`p-3 border-b hover:bg-slate-50 ${
      !item.is_read
        ? "bg-blue-50"
        : ""
    }`}
  >
          <div className="font-semibold">
            {item.title}
          </div>

          <div className="text-sm text-gray-500 mt-1">
            {item.message}
          </div>
        </div>
      ))
    )}
  </div>
)}
            {showProfileMenu && (
              <div className="absolute right-0 top-15 w-55 bg-white border rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b bg-slate-50">
                  <div className="font-semibold">
                    {profile?.full_name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {profile?.email}
                  </div>

<div className="mt-2 text-sm font-semibold text-blue-600">
  ID: {profile?.client_id}
</div>
                </div>

                <button className="w-full text-left px-5 py-4 hover:bg-slate-50">
                  Settings
                </button>

                <button className="w-full text-left px-5 py-4 hover:bg-slate-50">
                  Statistics
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page */}
        <Outlet />
      </main>
    </div>
  );
}