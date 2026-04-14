
// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const API = "https://cpmmarker.onrender.com";

// const safeGetUser = () => {
//   try {
//     const item = localStorage.getItem("user");
//     if (!item || item === "undefined" || item === "null") return null;
//     return JSON.parse(item);
//   } catch {
//     return null;
//   }
// };

// const isActivePath = (path: string, current: string): boolean => {
//   return current === path;
// };

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const localUser = safeGetUser();
//   const [user, setUser] = useState<any>(localUser);

//   useEffect(() => {
//     const loadUser = async () => {
//       if (!localUser?.id) return;

//       try {
//         const res = await fetch(`${API}/profile/${localUser.id}`);
//         const data = await res.json();

//         if (data) {
//           setUser(data);
//           localStorage.setItem("user", JSON.stringify(data)); // 🔥 sync fix
//         }
//       } catch (err) {
//         console.log("Profile load error", err);
//       }
//     };

//     loadUser();
//   }, [location.pathname]);

//   return (
//     <nav className="w-full h-[80px] flex items-center justify-between px-8 
//       bg-[#050608]/90 backdrop-blur-2xl border-b border-white/5 
//       sticky top-0 z-[1000]">

//       {/* LEFT */}
//       <div
//         onClick={() => navigate("/market")}
//         className="flex items-center gap-3 cursor-pointer"
//       >
//         <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
//           <span className="text-black font-black text-xl">C</span>
//         </div>

//         <div className="flex flex-col leading-none">
//           <span className="text-white font-black text-xl">
//             CPM<span className="text-yellow-500">MARKET</span>
//           </span>
//         </div>
//       </div>

//       {/* CENTER */}
//       <div className="hidden md:flex">
//         <button
//           onClick={() => navigate("/market")}
//           className={`px-6 py-2 rounded-full font-black text-xs ${
//             isActivePath("/market", location.pathname)
//               ? "bg-yellow-500 text-black"
//               : "text-white/40"
//           }`}
//         >
//           MARKET
//         </button>
//       </div>

//       {/* RIGHT */}
//       <div className="flex items-center gap-6">

//         {/* BALANCE */}
//         <div className="hidden sm:flex flex-col items-end">
//           <span className="text-[10px] text-white/30">Balance</span>
//           <span className="text-yellow-400 font-black">
//             ${user?.money || 0}
//           </span>
//         </div>

//         {/* PROFILE */}
//         <div
//           onClick={() => navigate("/profile")}
//           className="flex items-center gap-3 cursor-pointer"
//         >
//           <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10">
//             {user?.avatar ? (
//               <img src={user.avatar} className="w-full h-full object-cover" />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-black bg-yellow-400 font-black">
//                 {user?.name?.[0] || "G"}
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col">
//             <span className="text-[10px] text-yellow-500">Player</span>
//             <span className="text-xs text-white">
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

const safeGetUser = () => {
  try {
    const item = localStorage.getItem("user");
    if (!item || item === "undefined" || item === "null") return null;
    return JSON.parse(item);
  } catch {
    return null;
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const localUser = safeGetUser();
  const [user, setUser] = useState<any>(localUser);

  useEffect(() => {
    const loadUser = async () => {
      if (!localUser?.id) return;
      try {
        const res = await fetch(`${API}/profile/${localUser.id}`);
        const data = await res.json();
        if (data) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.log("Profile load error", err);
      }
    };
    loadUser();
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full h-[90px] flex items-center justify-between px-6 md:px-12 bg-[#050608]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[1000] selection:bg-yellow-500/30">
      
      {/* LEFT: LOGO */}
      <div
        onClick={() => navigate("/market")}
        className="flex items-center gap-4 cursor-pointer group"
      >
        <div className="relative">
          <div className="w-12 h-12 bg-yellow-500 rounded-2xl rotate-3 group-hover:rotate-12 transition-transform duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            <span className="text-black font-black text-2xl -rotate-3 group-hover:-rotate-12 transition-transform">C</span>
          </div>
          <div className="absolute -inset-1 bg-yellow-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div className="flex flex-col">
          <span className="text-white font-black text-2xl tracking-tighter leading-none italic">
            CPM<span className="text-yellow-500">MARKET</span>
          </span>
          <span className="text-[10px] text-white/30 font-bold tracking-[0.3em] uppercase">Universe</span>
        </div>
      </div>

      {/* CENTER: NAV LINKS */}
      <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
        <button
          onClick={() => navigate("/market")}
          className={`px-8 py-2.5 rounded-xl font-black text-xs tracking-widest transition-all ${
            isActive("/market")
              ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
              : "text-white/40 hover:text-white hover:bg-white/5"
          }`}
        >
          MARKET
        </button>
        {/* Можно добавить другие ссылки здесь */}
      </div>

      {/* RIGHT: USER INFO */}
      <div className="flex items-center gap-4 md:gap-8">
        
        {/* BALANCE BOX */}
        {/* <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl hover:border-yellow-500/30 transition-colors">
          <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 font-bold">
            $
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black text-white/30 leading-none">Balance</span>
            <span className="text-sm font-black text-white tabular-nums">
              {(user?.money || 0).toLocaleString()}
            </span>
          </div>
        </div> */}

        {/* PROFILE CHIP */}
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-yellow-500/50 transition-colors">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-black bg-yellow-500 font-black text-lg">
                  {user?.name?.[0] || "G"}
                </div>
              )}
            </div>
            {/* Online Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#050608] rounded-full"></div>
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-[9px] uppercase font-black text-yellow-500 tracking-tighter">Level 10</span>
            <span className="text-sm font-black text-white group-hover:text-yellow-400 transition-colors">
              {user?.name || "Guest"}
            </span>
          </div>
        </div>

      </div>
    </nav>
  );
}