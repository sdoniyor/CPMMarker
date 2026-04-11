// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API = "https://cpmmarker.onrender.com";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const localUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const [user, setUser] = useState<any>(localUser);

//   useEffect(() => {
//     const loadUser = async () => {
//       if (!localUser.id) return;

//       try {
//         const res = await fetch(`${API}/profile/${localUser.id}`);
//         const data = await res.json();
//         setUser(data);
//       } catch (err) {
//         console.log("Profile load error", err);
//       }
//     };

//     loadUser();
//   }, []);

//   return (
//     <div className="w-full h-[70px] flex items-center justify-between px-6
//       bg-black/60 backdrop-blur-xl border-b border-white/10
//       shadow-[0_0_30px_rgba(234,179,8,0.15)]">

//       {/* LOGO */}
//       <div
//         onClick={() => navigate("/market")}
//         className="text-yellow-400 font-extrabold tracking-[0.3em] text-lg cursor-pointer
//         hover:scale-105 transition"
//       >
//         CPM MARKET
//       </div>

//       {/* CENTER MENU */}
//       <div className="flex items-center gap-6 text-white/70 font-semibold">

//         <button onClick={() => navigate("/market")}
//           className="hover:text-yellow-400 transition">
//           MARKET
//         </button>

//         {/* <div className="w-[1px] h-5 bg-white/20" />

//         <button onClick={() => navigate("/wheel")}
//           className="hover:text-yellow-400 transition">
//           SPIN
//         </button> */}

//       </div>

//       {/* PROFILE */}
//       <div className="flex items-center gap-3 cursor-pointer"
//         onClick={() => navigate("/profile")}>

//         <div className="text-right">
//           <p className="text-xs text-white/60">PLAYER</p>
//           <p className="text-sm font-bold text-white">
//             {user?.name || "Guest"}
//           </p>
//         </div>

//         {/* AVATAR FROM DB */}
//         <div className="w-10 h-10 rounded-full overflow-hidden border border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]">

//           {user?.avatar ? (
//             <img
//               src={user.avatar}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full bg-yellow-500 flex items-center justify-center text-black font-bold">
//               {user?.name?.[0] || "G"}
//             </div>
//           )}

//         </div>

//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API = "https://cpmmarker.onrender.com";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Для подсветки активной страницы

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
  }, [location.pathname]); // Обновляем данные при переходах

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full h-[80px] flex items-center justify-between px-8 
      bg-[#050608]/90 backdrop-blur-2xl border-b border-white/5 
      sticky top-0 z-[1000]">
      
      {/* LEFT: LOGO */}
      <div 
        onClick={() => navigate("/market")}
        className="flex items-center gap-2 group cursor-pointer"
      >
        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center 
          shadow-[0_0_20px_rgba(234,179,8,0.3)] group-hover:rotate-12 transition-transform">
          <span className="text-black font-black italic text-xl">C</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-white font-black italic tracking-tighter text-xl group-hover:text-yellow-400 transition-colors">
            CPM<span className="text-yellow-500 group-hover:text-white">MARKET</span>
          </span>
          <span className="text-[8px] font-bold text-white/20 tracking-[0.4em] uppercase">Digital Dealership</span>
        </div>
      </div>

      {/* CENTER: MENU */}
      <div className="hidden md:flex items-center gap-1">
        {[
          { name: "MARKET", path: "/market" },
          { name: "GARAGE", path: "/garage" },
          { name: "ROULETTE", path: "/wheel" },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-6 py-2 rounded-full text-[11px] font-black italic tracking-widest transition-all
              ${isActive(item.path) 
                ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]" 
                : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* RIGHT: PROFILE & BALANCE */}
      <div className="flex items-center gap-6">
        
        {/* BALANCE */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Available Balance</span>
          <span className="text-lg font-black italic text-yellow-400 leading-none">
            ${user?.money?.toLocaleString() || "0"}
          </span>
        </div>

        <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

        {/* PROFILE CARD */}
        <div 
          onClick={() => navigate("/profile")}
          className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-1 pr-4 rounded-2xl border border-white/5 cursor-pointer transition-all"
        >
          {/* AVATAR BOX */}
          <div className="relative group">
            <div className="absolute inset-0 bg-yellow-500 blur-md opacity-20 group-hover:opacity-50 transition-opacity" />
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 relative z-10">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-black font-black italic">
                  {user?.name?.[0] || "G"}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black italic text-yellow-500 uppercase leading-none">Member</span>
            <span className="text-xs font-bold text-white truncate max-w-[80px]">
              {user?.name || "Guest"}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}