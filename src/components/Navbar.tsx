
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiFetch } from "../api/api";

// // Константа для базового URL твоего сервера
// const SERVER_URL = "https://cpmmarker.onrender.com";

// export default function Navbar() {
//   const [user, setUser] = useState<any>(null);
//   const navigate = useNavigate();

//   const loadUser = async () => {
//     try {
//       const data = await apiFetch("/profile/me");
//       if (data?.id) {
//         setUser(data);
//         // Синхронизируем локальное хранилище
//         localStorage.setItem("user", JSON.stringify(data));
//       }
//     } catch (e) {
//       console.log("Navbar load error", e);
//     }
//   };

//   /* ================= ПЕРВАЯ ЗАГРУЗКА ================= */
//   useEffect(() => {
//     const cached = localStorage.getItem("user");
//     if (cached) {
//       try {
//         setUser(JSON.parse(cached));
//       } catch (e) {
//         console.error("Parse error", e);
//       }
//     }
//     loadUser();
//   }, []);

//   /* ================= ОБНОВЛЕНИЕ ДАННЫХ ================= */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       loadUser();
//     }, 5000); 
//     return () => clearInterval(interval);
//   }, []);

//     /* ================= ЛОГИКА АВАТАРА ================= */
//     const getAvatarUrl = (): string | undefined => {
//       if (!user?.avatar) return undefined; // Заменяем null на undefined
      
//       const path = user.avatar.startsWith("http") 
//         ? user.avatar 
//         : `${SERVER_URL}${user.avatar}`;

//       return `${path}?t=${new Date().getTime()}`;
//     };

//   return (
//     <nav className="w-full h-[70px] fixed top-0 left-0 z-[100] 
//       bg-[#0a0a0a] border-b border-white/5 shadow-xl">
//       {/* Заменили bg-black/40 на жесткий цвет #0a0a0a. 
//         Теперь он не будет казаться белым из-за прозрачности.
//       */}

//       <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">

//         {/* ЛОГОТИП */}
//         <div
//           onClick={() => navigate("/market")}
//           className="flex items-center gap-3 cursor-pointer group"
//         >
//           <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-black group-hover:rotate-6 transition">
//             C
//           </div>

//           <span className="text-white font-black text-lg tracking-tight">
//             CPM<span className="text-yellow-400">MARKET</span>
//           </span>
//         </div>

//         {/* НАВИГАЦИЯ */}
//         <div className="hidden md:flex gap-8">
//           <button
//             onClick={() => navigate("/market")}
//             className="text-xs font-black text-white/40 hover:text-white transition uppercase tracking-widest"
//           >
//             Market
//           </button>
//         </div>

//         {/* ПРОФИЛЬ */}
//         <div
//           onClick={() => navigate("/profile")}
//           className="flex items-center gap-3 cursor-pointer bg-white/5 p-1.5 pr-4 rounded-xl border border-white/5 hover:bg-white/10 transition"
//         >
//           {/* АВАТАРКА */}
//           <div className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0">
//             {user?.avatar ? (
//               <img
//                 src={getAvatarUrl()}
//                 className="w-full h-full object-cover"
//                 alt="Avatar"
//                 onError={(e) => {
//                   // Если картинка не загрузилась (например 404), прячем её и покажем букву
//                   (e.target as HTMLImageElement).style.display = 'none';
//                 }}
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-black bg-yellow-400 font-bold">
//                 {user?.name?.[0]?.toUpperCase() || "A"}
//               </div>
//             )}
//           </div>

//           {/* ДАННЫЕ */}
//           <div className="hidden sm:block leading-tight">
//             <div className="text-white text-[13px] font-bold">
//               {user?.name || "Admin"}
//             </div>
//             <div className="text-yellow-400 text-[10px] font-black uppercase">
//               {user?.discount > 0 ? `Sale -${user.discount}%` : "No Discount"}
//             </div>
//           </div>
//         </div>

//       </div>
//     </nav>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = "https://cpmmarker.onrender.com";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const loadUser = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${SERVER_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.id) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch {}
  };

  useEffect(() => {
    loadUser();
  }, []);

  const goProfile = () => {
    if (!token) {
      navigate("/auth"); // ❗ вместо белого экрана
      return;
    }
    navigate("/profile");
  };

  return (
    <nav className="w-full h-[70px] fixed top-0 left-0 z-[100] bg-[#0a0a0a] border-b border-white/5">
      <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">

        <div onClick={() => navigate("/market")} className="text-white font-black cursor-pointer">
          CPM<span className="text-yellow-400">MARKET</span>
        </div>

        <div
          onClick={goProfile}
          className="cursor-pointer flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-black">
            {user?.name?.[0] || "U"}
          </div>

          <div className="hidden sm:block">
            <div className="text-white text-sm">{user?.name || "Guest"}</div>
          </div>
        </div>

      </div>
    </nav>
  );
}