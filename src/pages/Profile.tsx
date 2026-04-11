// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API = "https://cpmmarker.onrender.com";

// export default function Profile() {
//   const navigate = useNavigate();

//   const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

//   const [user, setUser] = useState<any>(null);
//   const [avatar, setAvatar] = useState("");
//   const [promo, setPromo] = useState("");
//   const [promoStatus, setPromoStatus] = useState("");

//   const loadProfile = async () => {
//     const res = await fetch(`${API}/profile/${userLocal.id}`);
//     const data = await res.json();
//     setUser(data);
//     setAvatar(data.avatar);
//   };

//   const updateAvatar = async () => {
//     await fetch(`${API}/update-avatar`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: userLocal.id,
//         avatar,
//       }),
//     });

//     loadProfile();
//   };

//   const applyPromo = async () => {
//     try {
//       const res = await fetch(`${API}/apply-promo`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code: promo }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setPromoStatus(`✅ Promo activated: ${data.discount}%`);
//       } else {
//         setPromoStatus("❌ Invalid code");
//       }
//     } catch {
//       setPromoStatus("❌ Server error");
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   if (!user) {
//     return (
//       <div className="text-white p-10 bg-black min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white flex items-center justify-center p-6">

//       <div className="w-[950px] grid grid-cols-2 gap-6">

//         {/* LEFT PANEL */}
//         <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(234,179,8,0.15)]">

//           {/* AVATAR */}
//           <img
//             src={user.avatar || "https://i.pravatar.cc/150"}
//             className="w-32 h-32 rounded-full mx-auto border-2 border-yellow-400 shadow-lg"
//           />

//           <h1 className="text-2xl mt-4 font-bold text-yellow-400">
//             {user.name}
//           </h1>

//           <p className="text-white/50 text-sm">ID #{user.id}</p>

//           {/* AVATAR EDIT */}
//           <input
//             className="w-full mt-4 p-2 bg-black/40 border border-white/10 rounded"
//             placeholder="Avatar URL"
//             value={avatar}
//             onChange={(e) => setAvatar(e.target.value)}
//           />

//           <button
//             onClick={updateAvatar}
//             className="mt-3 w-full bg-yellow-500 text-black py-2 rounded font-bold hover:scale-105 transition"
//           >
//             Update Avatar
//           </button>

//           {/* BACK BUTTON */}
//           <button
//             onClick={() => navigate("/market")}
//             className="mt-3 w-full bg-white/10 border border-white/10 py-2 rounded hover:bg-white/20 transition"
//           >
//             ← Back to Market
//           </button>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">

//           <h2 className="text-lg font-bold text-yellow-400 mb-4">
//             PLAYER INFO
//           </h2>

//           <div className="space-y-3 text-white/70">
//             <p><b>Email:</b> {user.email}</p>
//             <p><b>Level:</b> {user.level}</p>
//             <p><b>Name:</b> {user.name}</p>
//           </div>

//           {/* PROMO CODE */}
//           <div className="mt-6 p-4 border border-yellow-500/30 rounded-xl bg-yellow-500/5">

//             <p className="text-yellow-400 font-bold mb-2">
//               PROMO CODE
//             </p>

//             <input
//               value={promo}
//               onChange={(e) => setPromo(e.target.value)}
//               placeholder="Enter code..."
//               className="w-full p-2 bg-black/40 border border-white/10 rounded"
//             />

//             <button
//               onClick={applyPromo}
//               className="mt-2 w-full bg-yellow-500 text-black py-2 rounded font-bold hover:scale-105 transition"
//             >
//               Apply
//             </button>

//             {promoStatus && (
//               <p className="text-xs mt-2 text-white/70">{promoStatus}</p>
//             )}
//           </div>

//           {/* LOGOUT */}
//           <button
//             onClick={() => {
//               localStorage.clear();
//               window.location.href = "/login";
//             }}
//             className="mt-6 w-full bg-red-500 py-2 rounded font-bold hover:scale-105 transition"
//           >
//             Logout
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }








import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ================= AVATAR UPLOAD ================= */
  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

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
    alert("Avatar updated");
  };

  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  /* ================= PROMO ================= */
  const applyPromo = async () => {
    try {
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
        setPromoStatus("✅ Promo activated successfully!");
      } else {
        setPromoStatus("❌ " + data.error);
      }
    } catch {
      setPromoStatus("❌ Server error");
    }
  };

  if (!user) {
    return (
      <div className="text-white p-10 min-h-screen bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-[900px] grid grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="bg-white/5 p-6 rounded-xl text-center border border-white/10">

          {/* AVATAR */}
          <img
            src={user.avatar || "https://i.pravatar.cc/150"}
            className="w-32 h-32 rounded-full mx-auto border-2 border-yellow-400"
          />

          <h1 className="text-yellow-400 text-xl mt-3">
            {user.name}
          </h1>

          {/* FILE UPLOAD */}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="mt-4 w-full text-sm"
          />

          <button
            onClick={updateAvatar}
            className="mt-3 w-full bg-yellow-400 text-black py-2 rounded font-bold"
          >
            Upload Avatar
          </button>

          <button
            onClick={() => navigate("/market")}
            className="mt-3 w-full bg-white/10 py-2 rounded"
          >
            Back
          </button>
        </div>

        {/* RIGHT */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

          <h2 className="text-yellow-400 font-bold mb-4">
            PROFILE INFO
          </h2>

          <p>Email: {user.email}</p>
          <p>Level: {user.level}</p>

          {/* PROMO */}
          <div className="mt-6">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              className="w-full p-2 bg-black border border-white/10 rounded"
            />

            <button
              onClick={applyPromo}
              className="mt-2 w-full bg-yellow-400 text-black py-2 rounded font-bold"
            >
              Apply Promo
            </button>

            {promoStatus && (
              <p className="text-sm mt-2 text-white/70">
                {promoStatus}
              </p>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="mt-6 w-full bg-red-500 py-2 rounded font-bold"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
