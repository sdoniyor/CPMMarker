import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://unshunnable-fibrinogenically-pia.ngrok-free.dev";

export default function Navbar() {
  const navigate = useNavigate();

  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState<any>(localUser);

  useEffect(() => {
    const loadUser = async () => {
      if (!localUser.id) return;

      try {
        const res = await fetch(`${API}/profile/${localUser.id}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log("Profile load error", err);
      }
    };

    loadUser();
  }, []);

  return (
    <div className="w-full h-[70px] flex items-center justify-between px-6
      bg-black/60 backdrop-blur-xl border-b border-white/10
      shadow-[0_0_30px_rgba(234,179,8,0.15)]">

      {/* LOGO */}
      <div
        onClick={() => navigate("/market")}
        className="text-yellow-400 font-extrabold tracking-[0.3em] text-lg cursor-pointer
        hover:scale-105 transition"
      >
        CPM MARKET
      </div>

      {/* CENTER MENU */}
      <div className="flex items-center gap-6 text-white/70 font-semibold">

        <button onClick={() => navigate("/market")}
          className="hover:text-yellow-400 transition">
          MARKET
        </button>

        <div className="w-[1px] h-5 bg-white/20" />

        <button onClick={() => navigate("/wheel")}
          className="hover:text-yellow-400 transition">
          SPIN
        </button>

      </div>

      {/* PROFILE */}
      <div className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/profile")}>

        <div className="text-right">
          <p className="text-xs text-white/60">PLAYER</p>
          <p className="text-sm font-bold text-white">
            {user?.name || "Guest"}
          </p>
        </div>

        {/* AVATAR FROM DB */}
        <div className="w-10 h-10 rounded-full overflow-hidden border border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]">

          {user?.avatar ? (
            <img
              src={user.avatar}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-yellow-500 flex items-center justify-center text-black font-bold">
              {user?.name?.[0] || "G"}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}