
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// /* ================= SAFE USER ================= */
// const getUser = () => {
//   try {
//     const raw = localStorage.getItem("user");
//     if (!raw || raw === "undefined") return {};
//     return JSON.parse(raw);
//   } catch {
//     return {};
//   }
// };

// export default function Profile() {
//   const navigate = useNavigate();

//   const userLocal = getUser();

//   const [user, setUser] = useState<any>(null);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [promo, setPromo] = useState("");
//   const [promoStatus, setPromoStatus] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= SAFE FETCH ================= */
//   const safeFetchJSON = async (url: string, options?: any) => {
//     try {
//       const res = await fetch(url, options);
//       const text = await res.text();

//       try {
//         return JSON.parse(text);
//       } catch {
//         console.error("NOT JSON:", text);
//         return null;
//       }
//     } catch (e) {
//       console.error("FETCH ERROR:", e);
//       return null;
//     }
//   };

//   /* ================= LOAD PROFILE ================= */
//   const loadProfile = async () => {
//     if (!userLocal?.id) return;

//     const data = await safeFetchJSON(`${API}/profile/${userLocal.id}`);

//     if (data) {
//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   /* ================= BASE64 ================= */
//   const convertBase64 = (file: File) => {
//     return new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = reject;
//     });
//   };

//   /* ================= AVATAR ================= */
//   const updateAvatar = async () => {
//     if (!avatarFile) return;

//     setLoading(true);

//     const base64 = await convertBase64(avatarFile);

//     const data = await safeFetchJSON(`${API}/update-avatar`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: userLocal.id,
//         avatar: base64,
//       }),
//     });

//     if (data) {
//       await loadProfile();
//       setAvatarFile(null);
//     }

//     setLoading(false);
//   };

//   /* ================= TELEGRAM ================= */
//   const connectTelegram = () => {
//     if (!userLocal?.id) return;

//     window.open(
//       `https://t.me/CPMMarket_bot?start=${userLocal.id}`,
//       "_blank"
//     );
//   };

//   /* ================= PROMO ================= */
//   const applyPromo = async () => {
//     const data = await safeFetchJSON(`${API}/promo/redeem`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: userLocal.id,
//         code: promo,
//       }),
//     });

//     if (data?.success) {
//       setPromoStatus("✅ Успешно активирован");
//       setPromo("");
//       loadProfile();
//     } else {
//       setPromoStatus("❌ " + (data?.error || "Ошибка"));
//     }
//   };

//   /* ================= LOADING ================= */
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-[#050608] flex items-center justify-center text-white font-black text-2xl">
//         LOADING...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#050608] text-white pb-20">
//       <Navbar />

//       <div className="max-w-6xl mx-auto px-6 pt-6">

//         {/* BACK */}
//         <button
//           onClick={() => navigate(-1)}
//           className="mb-8 text-white/30 hover:text-yellow-400"
//         >
//           ← BACK
//         </button>

//         <h1 className="text-5xl font-black italic mb-10">
//           PROFILE
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

//           {/* LEFT */}
//           <div className="bg-white/5 p-8 rounded-2xl border border-white/10">

//             <img
//               src={user.avatar || "https://i.pravatar.cc/300"}
//               className="w-40 h-40 rounded-2xl object-cover"
//             />

//             <input
//               type="file"
//               className="mt-4"
//               onChange={(e) =>
//                 setAvatarFile(e.target.files?.[0] || null)
//               }
//             />

//             {avatarFile && (
//               <button
//                 onClick={updateAvatar}
//                 disabled={loading}
//                 className="mt-4 bg-yellow-400 text-black px-6 py-2 font-bold"
//               >
//                 {loading ? "LOADING..." : "SAVE AVATAR"}
//               </button>
//             )}

//             <h2 className="mt-6 text-2xl font-bold">
//               {user.name}
//             </h2>

//             <p className="text-white/40">{user.email}</p>
//           </div>

//           {/* RIGHT */}
//           <div className="space-y-6">

//             {/* TELEGRAM */}
//             <div className="bg-white/5 p-6 rounded-xl">
//               <h3 className="font-bold mb-2">Telegram</h3>

//               {user.telegram_id ? (
//                 <p>ID: {user.telegram_id}</p>
//               ) : (
//                 <button
//                   onClick={connectTelegram}
//                   className="bg-blue-500 px-4 py-2 rounded"
//                 >
//                   CONNECT
//                 </button>
//               )}
//             </div>

//             {/* PROMO */}
//             <div className="bg-white/5 p-6 rounded-xl">
//               <h3 className="font-bold mb-2">Promo</h3>

//               <input
//                 value={promo}
//                 onChange={(e) => setPromo(e.target.value)}
//                 className="w-full p-2 bg-black border border-white/10"
//               />

//               <button
//                 onClick={applyPromo}
//                 className="mt-3 bg-yellow-400 text-black px-4 py-2"
//               >
//                 APPLY
//               </button>

//               {promoStatus && (
//                 <p className="mt-2 text-sm">{promoStatus}</p>
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

/* ================= SAFE USER ================= */
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

    try {
      return JSON.parse(text);
    } catch {
      console.log("❌ NOT JSON:", text);
      return null;
    }
  } catch (e) {
    console.log("FETCH ERROR:", e);
    return null;
  }
};

export default function Profile() {
  const navigate = useNavigate();

  const localUser = getUser();

  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [promo, setPromo] = useState("");
  const [promoStatus, setPromoStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async () => {
    if (!localUser?.id) return;

    const data = await safeFetch(
      `${API}/profile/${localUser.id}`
    );

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
    if (!avatarFile || !localUser?.id) return;

    setLoading(true);

    const base64 = await convertBase64(avatarFile);

    const data = await safeFetch(`${API}/update-avatar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: localUser.id,
        avatar: base64,
      }),
    });

    if (data) {
      await loadProfile();
      setAvatarFile(null);
    }

    setLoading(false);
  };

  /* ================= TELEGRAM ================= */
  const connectTelegram = () => {
    if (!localUser?.id) return;

    window.open(
      `https://t.me/CPMMarket_bot?start=${localUser.id}`,
      "_blank"
    );
  };

  /* ================= PROMO ================= */
  const applyPromo = async () => {
    if (!localUser?.id) return;

    const data = await safeFetch(`${API}/promo/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: localUser.id,
        code: promo,
      }),
    });

    if (data?.success) {
      setPromoStatus("✅ Успешно активирован");
      setPromo("");
      loadProfile();
    } else {
      setPromoStatus("❌ " + (data?.error || "Ошибка"));
    }
  };

  /* ================= LOADING ================= */
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center text-white font-black text-2xl">
        LOADING...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608] text-white pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-6">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-white/30 hover:text-yellow-400"
        >
          ← BACK
        </button>

        <h1 className="text-5xl font-black italic mb-10">
          PROFILE
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">

            <img
              src={user.avatar || "https://i.pravatar.cc/300"}
              className="w-40 h-40 rounded-2xl object-cover"
            />

            <input
              type="file"
              className="mt-4"
              onChange={(e) =>
                setAvatarFile(e.target.files?.[0] || null)
              }
            />

            {avatarFile && (
              <button
                onClick={updateAvatar}
                disabled={loading}
                className="mt-4 bg-yellow-400 text-black px-6 py-2 font-bold"
              >
                {loading ? "LOADING..." : "SAVE AVATAR"}
              </button>
            )}

            <h2 className="mt-6 text-2xl font-bold">
              {user.name}
            </h2>

            <p className="text-white/40">{user.email}</p>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* TELEGRAM */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="font-bold mb-2">Telegram</h3>

              {user.telegram_id ? (
                <p>ID: {user.telegram_id}</p>
              ) : (
                <button
                  onClick={connectTelegram}
                  className="bg-blue-500 px-4 py-2 rounded"
                >
                  CONNECT
                </button>
              )}
            </div>

            {/* PROMO */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="font-bold mb-2">Promo</h3>

              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="w-full p-2 bg-black border border-white/10"
              />

              <button
                onClick={applyPromo}
                className="mt-3 bg-yellow-400 text-black px-4 py-2"
              >
                APPLY
              </button>

              {promoStatus && (
                <p className="mt-2 text-sm">{promoStatus}</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}