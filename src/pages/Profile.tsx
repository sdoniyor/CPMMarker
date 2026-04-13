
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
//     if (!userLocal?.id) return;
//     try {
//       const res = await fetch(`${API}/profile/${userLocal.id}`);
//       const data = await res.json();
//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
//     } catch (err) {
//       console.error("Profile load error", err);
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const convertBase64 = (file: File) => {
//     return new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = reject;
//     });
//   };

//   const handleAvatarChange = (e: any) => {
//     const file = e.target.files?.[0];
//     if (file) setAvatarFile(file);
//   };

//   const updateAvatar = async () => {
//     if (!avatarFile) return alert("Please select an image");
//     try {
//       const base64 = await convertBase64(avatarFile);
//       const res = await fetch(`${API}/update-avatar`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: userLocal.id, avatar: base64 }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setUser(data.user);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         alert("✅ Avatar updated!");
//         setAvatarFile(null);
//       }
//     } catch (e) {
//       alert("Error uploading avatar");
//     }
//   };

//   const applyPromo = async () => {
//     if (!promo) return;
//     try {
//       const res = await fetch(`${API}/promo/redeem`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: userLocal.id, code: promo }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setPromoStatus("✅ Success!");
//         loadProfile();
//         setPromo("");
//       } else {
//         setPromoStatus("❌ " + data.error);
//       }
//     } catch {
//       setPromoStatus("❌ Error");
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#050608] text-white font-sans relative overflow-x-hidden">
//       <Navbar />

//       {/* BACKGROUND DECOR */}
//       <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1d26_0%,#050608_100%)] pointer-events-none z-0" />
//       <div className="absolute top-1/4 -left-20 w-80 h-80 bg-yellow-500/5 blur-[120px] pointer-events-none" />

//       <div className="relative z-10 max-w-[1100px] mx-auto p-6 lg:p-12 animate-in fade-in duration-700">
        
//         {/* HEADER */}
//         <div className="mb-10">
//           <h1 className="text-5xl font-black italic tracking-tighter uppercase">
//             PLAYER <span className="text-yellow-500">PROFILE</span>
//           </h1>
//           <div className="h-1 w-20 bg-yellow-500 mt-2"></div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          
//           {/* LEFT COLUMN: IDENTITY */}
//           <div className="space-y-6">
//             <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl">
//               <div className="relative inline-block group">
//                 <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
//                 <img
//                   src={user.avatar || "https://i.pravatar.cc/150"}
//                   className="w-40 h-40 rounded-[2rem] mx-auto border-2 border-yellow-500/50 object-cover relative z-10 transition-transform group-hover:scale-105"
//                   alt="avatar"
//                 />
//                 <label className="absolute bottom-2 right-2 z-20 bg-yellow-500 text-black p-2 rounded-xl cursor-pointer hover:scale-110 transition shadow-lg">
//                   <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
//                   📷
//                 </label>
//               </div>

//               <h2 className="text-3xl font-black italic uppercase mt-6 tracking-tighter">
//                 {user.name}
//               </h2>
//               <p className="text-yellow-500/50 font-bold tracking-[0.3em] text-[10px] uppercase mb-6">
//                 ID #{user.id}
//               </p>

//               {avatarFile && (
//                 <button
//                   onClick={updateAvatar}
//                   className="w-full bg-yellow-500 text-black font-black italic py-3 rounded-2xl text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all mb-4"
//                 >
//                   Confirm New Avatar
//                 </button>
//               )}

//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
//                   <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Balance</p>
//                   <p className="text-xl font-black italic text-yellow-400">${user.money?.toLocaleString()}</p>
//                 </div>
//                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
//                   <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Level</p>
//                   <p className="text-xl font-black italic text-white">{user.level}</p>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={() => {
//                 localStorage.clear();
//                 window.location.href = "/login";
//               }}
//               className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-black italic py-4 rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all"
//             >
//               Logout Account
//             </button>
//           </div>

//           {/* RIGHT COLUMN: SETTINGS & PROMO */}
//           <div className="space-y-6">
            
//             {/* STATS CARD */}
//             <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
//               <h3 className="text-xs font-black italic text-yellow-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
//                 <div className="w-2 h-2 bg-yellow-500 rotate-45"></div> Account Information
//               </h3>
              
//               <div className="space-y-6">
//                 <div className="flex justify-between items-center border-b border-white/5 pb-4">
//                   <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Email Address</span>
//                   <span className="font-bold text-white/80">{user.email}</span>
//                 </div>
//                 <div className="flex justify-between items-center border-b border-white/5 pb-4">
//                   <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Account Status</span>
//                   <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase italic border border-green-500/20">Active</span>
//                 </div>
//               </div>
//             </div>

//             {/* PROMO CARD */}
//             <div className="bg-gradient-to-br from-yellow-500/10 to-transparent backdrop-blur-xl border border-yellow-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-8 opacity-5">
//                 <span className="text-8xl font-black italic italic uppercase tracking-tighter">GIFT</span>
//               </div>

//               <h3 className="text-xs font-black italic text-yellow-500 uppercase tracking-[0.3em] mb-6 relative z-10">
//                 Redeem Promo Code
//               </h3>

//               <div className="flex gap-3 relative z-10">
//                 <input
//                   value={promo}
//                   onChange={(e) => setPromo(e.target.value)}
//                   placeholder="ENTER CODE"
//                   className="flex-1 px-6 py-4 rounded-2xl bg-black/60 border border-white/10 focus:border-yellow-500 outline-none font-bold italic uppercase text-xs tracking-widest transition-all"
//                 />
//                 <button
//                   onClick={applyPromo}
//                   className="bg-yellow-500 text-black font-black italic px-8 py-4 rounded-2xl text-xs uppercase hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all"
//                 >
//                   Apply
//                 </button>
//               </div>

//               {promoStatus && (
//                 <div className={`mt-4 text-[10px] font-black uppercase tracking-widest italic ${promoStatus.includes("✅") ? "text-green-400" : "text-red-400"}`}>
//                   {promoStatus}
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => navigate("/market")}
//               className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black italic text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all text-white/40 hover:text-white"
//             >
//               ← Return to Market
//             </button>
//           </div>

//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-in {
//           animation: fadeIn 0.6s ease-out forwards;
//         }
//       `}} />
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

  const loadProfile = async () => {
    const res = await fetch(`${API}/profile/${userLocal.id}`);
    const data = await res.json();
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
    });
  };

  const updateAvatar = async () => {
    if (!avatarFile) return;

    const base64 = await convertBase64(avatarFile);

    await fetch(`${API}/update-avatar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userLocal.id,
        avatar: base64,
      }),
    });

    loadProfile();
    setAvatarFile(null);
  };

  // 🔥 TELEGRAM CONNECT
  const connectTelegram = () => {
    window.open(`https://t.me/YOUR_BOT_NAME?start=${userLocal.id}`, "_blank");
  };

  const applyPromo = async () => {
    const res = await fetch(`${API}/promo/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userLocal.id,
        code: promo,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setPromoStatus("✅ Success");
      loadProfile();
    } else {
      setPromoStatus("❌ " + data.error);
    }
  };

  if (!user) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-4xl font-bold text-yellow-400 mb-8">
          PROFILE
        </h1>

        <div className="grid grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="bg-white/5 p-6 rounded-xl">

            <img
              src={user.avatar || "https://i.pravatar.cc/150"}
              className="w-32 h-32 rounded-xl mb-4"
            />

            <input
              type="file"
              onChange={(e: any) => setAvatarFile(e.target.files[0])}
            />

            {avatarFile && (
              <button
                onClick={updateAvatar}
                className="mt-2 bg-yellow-500 text-black px-4 py-1 rounded"
              >
                Save Avatar
              </button>
            )}

            <p className="mt-4 text-lg">{user.name}</p>
            <p className="text-white/60">{user.email}</p>

            <p className="mt-2">💰 ${user.money}</p>
            <p>⭐ Level {user.level}</p>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* TELEGRAM */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-yellow-400 mb-3">Telegram</h2>

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
              <h2 className="text-yellow-400 mb-3">Promo Code</h2>

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

              {promoStatus && <p className="mt-2">{promoStatus}</p>}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}