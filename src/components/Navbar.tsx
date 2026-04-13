
// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const API = "https://cpmmarker.onrender.com";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

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
//   }, [location.pathname]);

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <nav className="w-full h-[80px] flex items-center justify-between px-8 
//       bg-[#050608]/90 backdrop-blur-2xl border-b border-white/5 
//       sticky top-0 z-[1000]">
      
//       {/* LEFT: LOGO */}
//       <div 
//         onClick={() => navigate("/market")}
//         className="flex items-center gap-3 group cursor-pointer"
//       >
//         <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center 
//           shadow-[0_0_20px_rgba(234,179,8,0.3)] group-hover:rotate-12 transition-transform duration-300">
//           <span className="text-black font-black italic text-xl">C</span>
//         </div>
//         <div className="flex flex-col leading-none">
//           <span className="text-white font-black italic tracking-tighter text-xl group-hover:text-yellow-400 transition-colors">
//             CPM<span className="text-yellow-500 group-hover:text-white">MARKET</span>
//           </span>
//           <span className="text-[8px] font-bold text-white/20 tracking-[0.4em] uppercase">Digital Dealership</span>
//         </div>
//       </div>

//       {/* CENTER: MENU (Только Market) */}
//       <div className="hidden md:flex items-center">
//         <button
//           onClick={() => navigate("/market")}
//           className={`px-8 py-2 rounded-full text-[11px] font-black italic tracking-widest transition-all
//             ${isActive("/market") 
//               ? "bg-yellow-500 text-black shadow-[0_0_25px_rgba(234,179,8,0.4)]" 
//               : "text-white/40 hover:text-white hover:bg-white/5"
//             }`}
//         >
//           MARKET
//         </button>
//       </div>

//       {/* RIGHT: PROFILE & BALANCE */}
//       <div className="flex items-center gap-6">
        
//         {/* BALANCE */}
//         <div className="hidden sm:flex flex-col items-end">
//           <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Balance</span>
//           <span className="text-lg font-black italic text-yellow-400 leading-none">
//             ${user?.money?.toLocaleString() || "0"}
//           </span>
//         </div>

//         <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

//         {/* PROFILE CARD */}
//         <div 
//           onClick={() => navigate("/profile")}
//           className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-1 pr-4 rounded-2xl border border-white/5 cursor-pointer transition-all group"
//         >
//           <div className="relative">
//             <div className="absolute inset-0 bg-yellow-500 blur-md opacity-0 group-hover:opacity-30 transition-opacity" />
//             <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 relative z-10">
//               {user?.avatar ? (
//                 <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
//               ) : (
//                 <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-black font-black italic">
//                   {user?.name?.[0] || "G"}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-col">
//             <span className="text-[10px] font-black italic text-yellow-500 uppercase leading-none">Player</span>
//             <span className="text-xs font-bold text-white truncate max-w-[90px]">
//               {user?.name || "Guest"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API = "https://cpmmarker.onrender.com";

/* 🔥 SAFE JSON PARSE (ВАЖНО) */
const safeParse = (value: string | null): any => {
  try {
    if (!value || value === "undefined" || value === "null") return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const localUser = safeParse(localStorage.getItem("user"));
  const [user, setUser] = useState(localUser);

  useEffect(() => {
    const loadUser = async () => {
      if (!localUser?.id) return;

      try {
        const res = await fetch(`${API}/profile/${localUser.id}`);
        const data = await res.json();

        if (data) setUser(data);
      } catch (err) {
        console.log("Profile load error", err);
      }
    };

    loadUser();
  }, [location.pathname]);

const isActive = (path: string): boolean =>
  location.pathname === path;

  return (
    <nav className="w-full h-[80px] flex items-center justify-between px-8 
      bg-[#050608]/90 backdrop-blur-2xl border-b border-white/5 
      sticky top-0 z-[1000]">

      {/* LEFT */}
      <div
        onClick={() => navigate("/market")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
          <span className="text-black font-black text-xl">C</span>
        </div>

        <div className="flex flex-col leading-none">
          <span className="text-white font-black text-xl">
            CPM<span className="text-yellow-500">MARKET</span>
          </span>
          <span className="text-[8px] text-white/30">Digital Dealership</span>
        </div>
      </div>

      {/* CENTER */}
      <div className="hidden md:flex">
        <button
          onClick={() => navigate("/market")}
          className={`px-6 py-2 rounded-full font-black text-xs ${
            isActive("/market")
              ? "bg-yellow-500 text-black"
              : "text-white/40"
          }`}
        >
          MARKET
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        {/* BALANCE */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[10px] text-white/30">Balance</span>
          <span className="text-yellow-400 font-black">
            ${user?.money || 0}
          </span>
        </div>

        {/* PROFILE */}
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black bg-yellow-400 font-black">
                {user?.name?.[0] || "G"}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-yellow-500">Player</span>
            <span className="text-xs text-white">
              {user?.name || "Guest"}
            </span>
          </div>
        </div>

      </div>
    </nav>
  );
} 