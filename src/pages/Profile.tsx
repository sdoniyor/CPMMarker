
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

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const navigate = useNavigate();
  const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [promo, setPromo] = useState("");
  const [promoStatus, setPromoStatus] = useState("");

  /* ================= SAFE FETCH ================= */
  const safeFetchJSON = async (url: string) => {
    try {
      const res = await fetch(url);
      const text = await res.text();

      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("❌ Not JSON:", text);
        return null;
      }
    } catch (e) {
      console.error("Fetch error:", e);
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

    const base64 = await convertBase64(avatarFile);

    await fetch(`${API}/update-avatar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userLocal.id,
        avatar: base64,
      }),
    });

    loadProfile();
    setAvatarFile(null);
  };

  /* ================= TELEGRAM CONNECT ================= */
  const connectTelegram = () => {
    if (!userLocal?.id) return;

    window.open(
      `https://t.me/CPMMarket_bot?start=${userLocal.id}`,
      "_blank"
    );
  };

  /* ================= PROMO ================= */
  const applyPromo = async () => {
    const res = await fetch(`${API}/promo/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userLocal.id,
        code: promo,
      }),
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

  /* ================= LOADING ================= */
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">
          PROFILE
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="bg-white/5 p-6 rounded-xl">

            <img
              src={user.avatar || "https://i.pravatar.cc/150"}
              className="w-32 h-32 rounded-xl mb-4 object-cover"
            />

            <input
              type="file"
              onChange={(e) =>
                setAvatarFile(e.target.files?.[0] || null)
              }
            />

            {avatarFile && (
              <button
                onClick={updateAvatar}
                className="mt-2 bg-yellow-500 text-black px-4 py-1 rounded"
              >
                Save Avatar
              </button>
            )}

            <p className="mt-4 text-lg font-bold">{user.name}</p>
            <p className="text-white/60">{user.email}</p>

            {/* LEVEL ONLY */}
            <p className="mt-2 text-white/80">
              ⭐ Level {user.level}
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* TELEGRAM */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-yellow-400 mb-3">
                Telegram
              </h2>

              {user.tg_id ? (
                <p>✅ Connected: {user.tg_id}</p>
              ) : (
                <button
                  onClick={connectTelegram}
                  className="bg-blue-500 px-4 py-2 rounded"
                >
                  Connect Telegram
                </button>
              )}
            </div>

            {/* PROMO */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-yellow-400 mb-3">
                Promo Code
              </h2>

              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="w-full p-2 bg-black border border-white/20 rounded"
                placeholder="Enter code"
              />

              <button
                onClick={applyPromo}
                className="mt-2 bg-yellow-500 text-black px-4 py-1 rounded"
              >
                Apply
              </button>

              {promoStatus && (
                <p className="mt-2 text-sm">
                  {promoStatus}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}