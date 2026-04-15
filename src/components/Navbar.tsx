
// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const API = "https://cpmmarker.onrender.com";

// /* ================= GET USER ================= */
// const getUser = () => {
//   try {
//     const raw = localStorage.getItem("user");
//     if (!raw || raw === "undefined" || raw === "null") return null;
//     return JSON.parse(raw);
//   } catch {
//     return null;
//   }
// };

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [user, setUser] = useState<any>(getUser());

//   /* ================= LOAD USER ================= */
//   useEffect(() => {
//     const loadUser = async () => {
//       const local = getUser();

//       if (!local?.id) {
//         setUser(null);
//         return;
//       }

//       try {
//         const res = await fetch(`${API}/profile/${local.id}`);
//         const data = await res.json();

//         if (data) {
//           console.log("🔥 NAV USER:", data);

//           setUser(data);

//           // ВСЕГДА одинаково сохраняем
//           localStorage.setItem("user", JSON.stringify(data));
//         }
//       } catch (err) {
//         console.log("❌ Profile load error", err);
//       }
//     };

//     loadUser();
//   }, [location.pathname]);

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <nav className="w-full h-[90px] flex items-center justify-between px-6 md:px-12 bg-[#050608]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[1000]">

//       {/* LOGO */}
//       <div
//         onClick={() => navigate("/market")}
//         className="flex items-center gap-4 cursor-pointer"
//       >
//         <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center">
//           <span className="text-black font-black text-2xl">C</span>
//         </div>

//         <div>
//           <span className="text-white font-black text-2xl">
//             CPM<span className="text-yellow-500">MARKET</span>
//           </span>
//         </div>
//       </div>

//       {/* CENTER */}
//       <div className="hidden md:flex gap-2">
//         <button
//           onClick={() => navigate("/market")}
//           className={`px-6 py-2 rounded-xl font-black text-xs ${
//             isActive("/market")
//               ? "bg-yellow-500 text-black"
//               : "text-white/40"
//           }`}
//         >
//           MARKET
//         </button>
//       </div>

//       {/* USER */}
//       <div
//         onClick={() => navigate("/profile")}
//         className="flex items-center gap-3 cursor-pointer"
//       >
//         <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10">
//           {user?.avatar ? (
//             <img src={user.avatar} className="w-full h-full object-cover" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-yellow-500 text-black font-bold">
//               {user?.name?.[0] || "G"}
//             </div>
//           )}
//         </div>

//         <div className="hidden sm:block">
//           <div className="text-sm font-bold text-white">
//             {user?.name || "Guest"}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cpmmarker.onrender.com";

const getToken = () => localStorage.getItem("token");

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const load = async () => {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API}/profile/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (data?.id) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <nav className="flex justify-between p-4 text-white">

      <div onClick={() => navigate("/market")}>
        CPM MARKET
      </div>

      <div onClick={() => navigate("/profile")}>
        {user?.name || "Guest"}
      </div>

    </nav>
  );
}