
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// /* ================= SAFE USER ================= */
// const getUser = () => {
//   try {
//     const raw = localStorage.getItem("user");
//     if (!raw || raw === "undefined" || raw === "null") return null;
//     return JSON.parse(raw);
//   } catch {
//     return null;
//   }
// };

// /* ================= SAFE FETCH ================= */
// const safeFetch = async (url: string, options?: any) => {
//   try {
//     const res = await fetch(url, options);
//     const text = await res.text();
//     try {
//       return JSON.parse(text);
//     } catch {
//       console.log("NOT JSON:", text);
//       return null;
//     }
//   } catch (e) {
//     console.log("FETCH ERROR:", e);
//     return null;
//   }
// };

// export default function Profile() {
//   const navigate = useNavigate();
//   const localUser = getUser();

//   const [user, setUser] = useState<any>(null);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [promo, setPromo] = useState("");
//   const [promoStatus, setPromoStatus] = useState("");
//   const [loading, setLoading] = useState(false);

//   const loadProfile = async () => {
//     if (!localUser?.id) return;
//     const data = await safeFetch(`${API}/profile/${localUser.id}`);
//     if (data) {
//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const convertBase64 = (file: File) =>
//     new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = reject;
//     });

//   const updateAvatar = async () => {
//     if (!avatarFile || !localUser?.id) return;
//     setLoading(true);
//     const base64 = await convertBase64(avatarFile);
//     const data = await safeFetch(`${API}/update-avatar`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: localUser.id, avatar: base64 }),
//     });
//     if (data) {
//       await loadProfile();
//       setAvatarFile(null);
//     }
//     setLoading(false);
//   };

//   const connectTelegram = () => {
//     if (!localUser?.id) return;
//     window.open(`https://t.me/CPMMarket_bot?start=${localUser.id}`, "_blank");
//   };

//   const applyPromo = async () => {
//     if (!localUser?.id) return;
//     const data = await safeFetch(`${API}/promo/redeem`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: localUser.id, code: promo }),
//     });
//     if (data?.success) {
//       setPromoStatus("✅ Успешно активирован");
//       setPromo("");
//       loadProfile();
//     } else {
//       setPromoStatus("❌ " + (data?.error || "Ошибка"));
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
//         <div className="animate-pulse text-yellow-400 font-black text-2xl tracking-widest">
//           LOADING...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0a0b0d] text-white pb-20 selection:bg-yellow-400/30">
//       <Navbar />

//       <div className="max-w-5xl mx-auto px-6 pt-10">
        
//         {/* КНОПКА НАЗАД - Теперь заметная */}
//         <button
//           onClick={() => navigate(-1)}
//           className="group mb-8 flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all active:scale-95"
//         >
//           <span className="text-yellow-400 group-hover:-translate-x-1 transition-transform">←</span>
//           <span className="text-sm font-bold tracking-wider uppercase">Вернуться</span>
//         </button>

//         <header className="mb-12">
//           <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">
//             MY PROFILE
//           </h1>
//           <div className="h-1 w-20 bg-yellow-400 mt-2"></div>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* ЛЕВАЯ КОЛОНКА - АВАТАР */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm flex flex-col items-center text-center">
//               <div className="relative group">
//                 <img
//                   src={user.avatar || "https://i.pravatar.cc/300"}
//                   className="w-48 h-48 rounded-2xl object-cover border-2 border-yellow-400/20 group-hover:border-yellow-400 transition-colors shadow-2xl shadow-yellow-400/5"
//                   alt="Avatar"
//                 />
//                 <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
//                   <span className="text-xs font-bold uppercase">Сменить фото</span>
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
//                   />
//                 </label>
//               </div>

//               <div className="mt-6">
//                 <h2 className="text-2xl font-black truncate max-w-[200px]">{user.name}</h2>
//                 <p className="text-white/40 text-sm">{user.email}</p>
//               </div>

//               {avatarFile && (
//                 <button
//                   onClick={updateAvatar}
//                   disabled={loading}
//                   className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black transition-all shadow-lg shadow-yellow-400/20"
//                 >
//                   {loading ? "SAVING..." : "SAVE CHANGES"}
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* ПРАВАЯ КОЛОНКА - ИНФО */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* ТЕЛЕГРАМ */}
//             <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
//               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//                 <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.64 6.3-2.73 7.55-3.26 3.58-1.51 4.32-1.78 4.81-1.79.11 0 .35.03.5.16.13.12.17.29.18.41.01.03.01.08 0 .13z"/></svg>
//               </div>
              
//               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 Telegram Connection
//               </h3>

//               {user.telegram_id ? (
//                 <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl">
//                   <p className="text-green-400 font-bold flex items-center gap-2">
//                     <span>✅</span> Аккаунт привязан
//                   </p>

//                   <p className="text-white/40 text-sm mt-1">
//                     ID: {user.telegram_id}
//                   </p>

//                   <p className="text-white/40 text-sm">
//                     Username: @{user.telegram_username || "none"}
//                   </p>
//                 </div>
//               ) : (
//                 <button
//                   onClick={connectTelegram}
//                   className="bg-[#229ED9] hover:bg-[#229ED9]/80 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-3"
//                 >
//                   Привязать Telegram
//                 </button>
//               )}
//             </div>

//             {/* ПРОМОКОД */}
//             <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
//               <h3 className="text-xl font-bold mb-4">Активация промокода</h3>
              
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <input
//                   placeholder="Введите код..."
//                   value={promo}
//                   onChange={(e) => setPromo(e.target.value)}
//                   className="flex-1 p-4 bg-black/40 border border-white/10 rounded-xl focus:border-yellow-400 outline-none transition-colors font-mono"
//                 />
//                 <button
//                   onClick={applyPromo}
//                   className="bg-white text-black hover:bg-yellow-400 px-8 py-4 rounded-xl font-black transition-all active:scale-95"
//                 >
//                   APPLY
//                 </button>
//               </div>

//               {promoStatus && (
//                 <p className={`mt-4 text-sm font-bold ${promoStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
//                   {promoStatus}
//                 </p>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

/* ================= GET USER ================= */
const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/* ================= SAFE FETCH ================= */
const safeFetch = async (url: string, options?: any) => {
  try {
    const res = await fetch(url, options);
    const text = await res.text();

    return JSON.parse(text);
  } catch (e) {
    console.log("FETCH ERROR:", e);
    return null;
  }
};

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [promo, setPromo] = useState("");
  const [promoStatus, setPromoStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async () => {
    const local = getUser(); // 🔥 ВСЕГДА СВЕЖИЙ

    if (!local?.id) {
      setUser(null);
      return;
    }

    const data = await safeFetch(`${API}/profile/${local.id}`);

    if (data) {
      console.log("🔥 PROFILE UPDATED:", data);

      setUser(data);

      // 🔥 всегда обновляем
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ================= AVATAR ================= */
  const convertBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const updateAvatar = async () => {
    const local = getUser();

    if (!avatarFile || !local?.id) return;

    setLoading(true);

    const base64 = await convertBase64(avatarFile);

    const data = await safeFetch(`${API}/profile/update-avatar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: local.id,
        avatar: base64,
      }),
    });

    if (data) {
      await loadProfile();
      setAvatarFile(null);
    }

    setLoading(false);
  };

  /* ================= PROMO ================= */
  const applyPromo = async () => {
    const local = getUser();

    if (!local?.id) return;

    const data = await safeFetch(`${API}/promo/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: local.id,
        code: promo,
      }),
    });

    if (data?.success) {
      setPromoStatus("✅ Успешно активирован");
      setPromo("");

      // 🔥 ОБЯЗАТЕЛЬНО перезагружаем профиль
      await loadProfile();
    } else {
      setPromoStatus("❌ " + (data?.error || "Ошибка"));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-yellow-400 font-black text-2xl">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-10">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-4 py-2 bg-white/5 rounded-full"
        >
          ← BACK
        </button>

        <h1 className="text-5xl font-black mb-10">MY PROFILE</h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="bg-white/5 p-6 rounded-3xl text-center">
            <img
              src={user.avatar || "https://i.pravatar.cc/300"}
              className="w-40 h-40 mx-auto rounded-2xl object-cover"
            />

            <h2 className="mt-4 text-xl font-black">
              {user.name}
            </h2>

            <p className="text-white/40 text-sm">
              {user.email}
            </p>
          </div>

          {/* PROMO */}
          <div className="bg-white/5 p-6 rounded-3xl">
            <h3 className="font-bold mb-4">Promo Code</h3>

            <div className="flex gap-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="flex-1 p-3 bg-black/40 rounded-xl"
              />

              <button
                onClick={applyPromo}
                className="bg-yellow-400 text-black px-6 rounded-xl font-bold"
              >
                APPLY
              </button>
            </div>

            {promoStatus && (
              <p className="mt-3 text-sm">{promoStatus}</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}