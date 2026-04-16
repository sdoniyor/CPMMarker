import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const loadUser = async () => {
    try {
      const data = await apiFetch("/profile/me");
      if (data?.id) {
        setUser(data);

        // 🔥 кеш синхронизация
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (e) {
      console.log("Navbar load error", e);
    }
  };

  /* ================= FIRST LOAD ================= */
  useEffect(() => {
    const cached = localStorage.getItem("user");

    if (cached) {
      setUser(JSON.parse(cached));
    }

    loadUser();
  }, []);

  /* ================= LIVE SYNC ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      loadUser();
    }, 5000); // обновление каждые 5 сек

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full h-[70px] fixed top-0 left-0 z-50 
      bg-black/40 backdrop-blur-xl border-b border-white/10">

      <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">

        {/* LEFT LOGO */}
        <div
          onClick={() => navigate("/market")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-black">
            C
          </div>

          <span className="text-white font-black text-lg">
            CPM<span className="text-yellow-400">MARKET</span>
          </span>
        </div>

        {/* CENTER NAV */}
        <div className="hidden md:flex gap-6 text-sm text-white/60">
          <button
            onClick={() => navigate("/market")}
            className="hover:text-white transition"
          >
            Market
          </button>
        </div>

        {/* RIGHT USER */}
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 cursor-pointer"
        >
          {/* AVATAR */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white/10 border border-white/10">
            {user?.avatar ? (
              <img
                src={`${user.avatar}?t=${Date.now()}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black bg-yellow-400 font-bold">
                {user?.name?.[0] || "G"}
              </div>
            )}
          </div>

          {/* NAME */}
          <div className="hidden sm:block">
            <div className="text-white text-sm font-semibold">
              {user?.name || "Guest"}
            </div>
            <div className="text-white/40 text-xs">
              {user?.email || ""}
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}