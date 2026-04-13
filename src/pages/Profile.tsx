
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function Profile() {
//   const navigate = useNavigate();
//   const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

//   const [user, setUser] = useState<any>(null);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [promo, setPromo] = useState("");
//   const [promoStatus, setPromoStatus] = useState("");

//   const loadProfile = async () => {
//     const res = await fetch(`${API}/profile/${userLocal.id}`);
//     const data = await res.json();
//     setUser(data);
//     localStorage.setItem("user", JSON.stringify(data));
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const convertBase64 = (file: File) => {
//     return new Promise<string>((resolve) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//     });
//   };

//   const updateAvatar = async () => {
//     if (!avatarFile) return;

//     const base64 = await convertBase64(avatarFile);

//     await fetch(`${API}/update-avatar`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userId: userLocal.id,
//         avatar: base64,
//       }),
//     });

//     loadProfile();
//     setAvatarFile(null);
//   };

//   // 🔥 TELEGRAM CONNECT
//   const connectTelegram = () => {
//     window.open(`https://t.me/CPMMarket_bot?start=${userLocal.id}`, "_blank");
//   };

//   const applyPromo = async () => {
//     const res = await fetch(`${API}/promo/redeem`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userId: userLocal.id,
//         code: promo,
//       }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       setPromoStatus("✅ Success");
//       loadProfile();
//     } else {
//       setPromoStatus("❌ " + data.error);
//     }
//   };

//   if (!user) return <div className="text-white p-10">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Navbar />

//       <div className="max-w-5xl mx-auto p-6">

//         <h1 className="text-4xl font-bold text-yellow-400 mb-8">
//           PROFILE
//         </h1>

//         <div className="grid grid-cols-2 gap-8">

//           {/* LEFT */}
//           <div className="bg-white/5 p-6 rounded-xl">

//             <img
//               src={user.avatar || "https://i.pravatar.cc/150"}
//               className="w-32 h-32 rounded-xl mb-4"
//             />

//             <input
//               type="file"
//               onChange={(e: any) => setAvatarFile(e.target.files[0])}
//             />

//             {avatarFile && (
//               <button
//                 onClick={updateAvatar}
//                 className="mt-2 bg-yellow-500 text-black px-4 py-1 rounded"
//               >
//                 Save Avatar
//               </button>
//             )}

//             <p className="mt-4 text-lg">{user.name}</p>
//             <p className="text-white/60">{user.email}</p>

//             <p className="mt-2">💰 ${user.money}</p>
//             <p>⭐ Level {user.level}</p>

//           </div>

//           {/* RIGHT */}
//           <div className="space-y-6">

//             {/* TELEGRAM */}
//             <div className="bg-white/5 p-6 rounded-xl">
//               <h2 className="text-yellow-400 mb-3">Telegram</h2>

//               {user.tg_id ? (
//                 <p>✅ Connected: {user.tg_id}</p>
//               ) : (
//                 <button
//                   onClick={connectTelegram}
//                   className="bg-blue-500 px-4 py-2 rounded"
//                 >
//                   Connect Telegram
//                 </button>
//               )}
//             </div>

//             {/* PROMO */}
//             <div className="bg-white/5 p-6 rounded-xl">
//               <h2 className="text-yellow-400 mb-3">Promo Code</h2>

//               <input
//                 value={promo}
//                 onChange={(e) => setPromo(e.target.value)}
//                 className="w-full p-2 bg-black border border-white/20 rounded"
//                 placeholder="Enter code"
//               />

//               <button
//                 onClick={applyPromo}
//                 className="mt-2 bg-yellow-500 text-black px-4 py-1 rounded"
//               >
//                 Apply
//               </button>

//               {promoStatus && <p className="mt-2">{promoStatus}</p>}
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

export default function Profile() {
  const navigate = useNavigate();
  const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [promo, setPromo] = useState("");
  const [promoStatus, setPromoStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SAFE FETCH ================= */
  const safeFetchJSON = async (url: string) => {
    try {
      const res = await fetch(url);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        return null;
      }
    } catch (e) {
      return null;
    }
  };

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async () => {
    if (!userLocal?.id) return;
    const data = await safeFetchJSON(`${API}/profile/${userLocal.id}`);
    if (data) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ================= BASE64 ================= */
  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  /* ================= AVATAR ================= */
  const updateAvatar = async () => {
    if (!avatarFile) return;
    setLoading(true);
    const base64 = await convertBase64(avatarFile);
    await fetch(`${API}/update-avatar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userLocal.id, avatar: base64 }),
    });
    await loadProfile();
    setAvatarFile(null);
    setLoading(false);
  };

  const connectTelegram = () => {
    if (!userLocal?.id) return;
    window.open(`https://t.me/CPMMarket_bot?start=${userLocal.id}`, "_blank");
  };

  const applyPromo = async () => {
    const res = await fetch(`${API}/promo/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userLocal.id, code: promo }),
    });
    const data = await res.json();
    if (data.success) {
      setPromoStatus("✅ Success");
      setPromo("");
      loadProfile();
    } else {
      setPromoStatus("❌ " + data.error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center text-white italic font-black text-2xl tracking-tighter">
        LOADING...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-6">
        {/* КНОПКА НАЗАД */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-white/20 hover:text-yellow-400 transition-all mb-8 uppercase text-[10px] font-black tracking-[3px]"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> 
          Назад в маркет
        </button>

        <h1 className="text-6xl font-black italic uppercase leading-none mb-12 tracking-tighter">
          Мой <span className="text-yellow-400">Профиль</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ЛЕВАЯ КАРТОЧКА (ИНФО) */}
          <div className="lg:col-span-5 bg-white/5 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[80px] rounded-full"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <img
                  src={user.avatar || "https://i.pravatar.cc/150"}
                  className="w-44 h-44 rounded-[2.5rem] object-cover border-4 border-white/5 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                  alt="avatar"
                />
                <label className="absolute bottom-2 right-2 bg-yellow-500 text-black p-3 rounded-2xl cursor-pointer hover:bg-yellow-400 shadow-xl active:scale-90 transition-all">
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  />
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h3l2-2h6l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/></svg>
                </label>
              </div>

              {avatarFile && (
                <button
                  onClick={updateAvatar}
                  disabled={loading}
                  className="mb-6 bg-white text-black font-black uppercase text-[10px] px-6 py-2 rounded-full tracking-widest hover:bg-yellow-400 transition-colors"
                >
                  {loading ? "Загрузка..." : "Сохранить новое фото"}
                </button>
              )}

              <h2 className="text-3xl font-black uppercase italic tracking-tight">{user.name}</h2>
              <p className="text-white/30 font-medium mb-6">{user.email}</p>

              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-white/5 rounded-3xl p-4 border border-white/5">
                  <p className="text-[10px] font-black text-yellow-500/50 tracking-widest uppercase mb-1">Уровень</p>
                  <p className="text-2xl font-black italic uppercase text-yellow-400">{user.level}</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-3xl p-4 border border-white/5">
                  <p className="text-[10px] font-black text-blue-500/50 tracking-widest uppercase mb-1">Баланс</p>
                  <p className="text-2xl font-black italic uppercase text-blue-400">${user.balance?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА (НАСТРОЙКИ) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* ТЕЛЕГРАМ */}
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between group">
              <div>
                <h3 className="text-xl font-black uppercase italic mb-1 group-hover:text-blue-400 transition-colors">Telegram Connect</h3>
                <p className="text-white/30 text-xs font-bold uppercase tracking-wider">Привязка аккаунта для уведомлений</p>
              </div>
              {user.tg_id ? (
                <div className="bg-blue-500/10 text-blue-400 px-6 py-3 rounded-2xl border border-blue-500/20 font-black text-xs uppercase tracking-widest">
                  ID: {user.tg_id}
                </div>
              ) : (
                <button
                  onClick={connectTelegram}
                  className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[2px] hover:bg-blue-400 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  Привязать ТГ
                </button>
              )}
            </div>

            {/* ПРОМОКОД */}
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-xl font-black uppercase italic mb-6">Активация промокода</h3>
              <div className="flex gap-3">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="flex-1 bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-yellow-500/50 transition-all font-black uppercase tracking-widest placeholder:text-white/10"
                  placeholder="ВВЕДИТЕ КОД"
                />
                <button
                  onClick={applyPromo}
                  className="bg-yellow-500 text-black px-10 rounded-2xl font-black uppercase text-[10px] tracking-[2px] hover:bg-yellow-400 transition-all active:scale-95"
                >
                  ОК
                </button>
              </div>
              {promoStatus && (
                <div className={`mt-4 p-4 rounded-xl text-center font-black uppercase text-[10px] tracking-widest ${promoStatus.includes('✅') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {promoStatus}
                </div>
              )}
            </div>

            {/* ДОПОЛНИТЕЛЬНО (ЗАГЛУШКА) */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-[2.5rem] p-8 flex items-center justify-between">
              <div className="text-black">
                <h3 className="text-xl font-black uppercase italic leading-none mb-1">Реферальная система</h3>
                <p className="text-black/50 text-[10px] font-bold uppercase tracking-widest">Приглашай друзей и получай бонусы</p>
              </div>
              <button className="bg-black text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">Скоро</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}