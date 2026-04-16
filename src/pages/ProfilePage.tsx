// import { useEffect, useState } from "react";

// const API = "https://cpmmarker.onrender.com";

// export default function Profile() {
//   const [user, setUser] = useState<any>(null);
//   const [promo, setPromo] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [tgLoading, setTgLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   /* ================= LOAD USER ================= */
//   const loadUser = async () => {
//     try {
//       const res = await fetch(`${API}/profile/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (data?.id) setUser(data);
//       else setUser(null);
//     } catch (e) {
//       console.log("LOAD USER ERROR:", e);
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   /* ================= TELEGRAM CONNECT ================= */
//   const connectTG = async () => {
//     try {
//       setTgLoading(true);

//       const res = await fetch(`${API}/profile/telegram/link`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (data?.link) {
//         window.open(data.link, "_blank");
//       }

//       setTimeout(loadUser, 2000);
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setTgLoading(false);
//     }
//   };

//   /* ================= PROMO ================= */
//   const applyPromo = async () => {
//     if (!promo.trim()) return alert("Enter promo code");

//     setLoading(true);

//     try {
//       const res = await fetch(`${API}/promo/redeem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ code: promo }),
//       });

//       const data = await res.json();

//       if (data?.success) {
//         alert("Promo activated!");
//         setPromo("");
//         loadUser();
//       } else {
//         alert(data?.error || "Invalid promo");
//       }
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= AVATAR UPLOAD (FILE) ================= */
//   const uploadAvatar = async () => {
//     if (!file) return alert("Select image first");

//     const form = new FormData();
//     form.append("avatar", file);

//     try {
//       const res = await fetch(`${API}/profile/upload-avatar`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: form,
//       });

//       const data = await res.json();

//       if (data?.id) {
//         setUser(data);
//         setFile(null);
//         alert("Avatar updated!");
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   /* ================= LOADING STATE ================= */
//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0b0d]">
//         Loading...
//       </div>
//     );
//   }

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-[#0a0b0d] text-white p-6">

//       <div className="max-w-4xl mx-auto">

//         {/* HEADER */}
//         <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6">

//           <div className="w-24 h-24 rounded-2xl bg-yellow-400 text-black flex items-center justify-center text-3xl font-black overflow-hidden">

//             {user.avatar ? (
//               <img
//                 src={user.avatar}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               user.name?.[0]
//             )}

//           </div>

//           <div>
//             <h1 className="text-3xl font-black">{user.name}</h1>
//             <p className="text-white/40">{user.email}</p>
//             <p className="text-sm text-white/60 mt-1">
//               ID: #{user.id}
//             </p>
//           </div>

//         </div>

//         {/* STATS */}
//         <div className="grid grid-cols-3 gap-4 mt-6">

//           <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
//             <p className="text-white/40 text-sm">Discount</p>
//             <p className="text-2xl font-black text-yellow-400">
//               {user.discount || 0}%
//             </p>
//           </div>

//           <div className="bg-white/5 p-5 rounded-2xl border border-white/10">

//             <p className="text-white/40 text-sm">Telegram</p>

//             {user.telegram_id ? (
//               <div>
//                 <p className="text-green-400 font-bold">
//                   Connected
//                 </p>
//                 <p className="text-sm text-white/60">
//                   @{user.telegram_username}
//                 </p>
//               </div>
//             ) : (
//               <button
//                 onClick={connectTG}
//                 disabled={tgLoading}
//                 className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl"
//               >
//                 {tgLoading ? "Connecting..." : "Connect Telegram"}
//               </button>
//             )}

//           </div>

//           <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
//             <p className="text-white/40 text-sm">Orders</p>
//             <p className="text-2xl font-black">0</p>
//           </div>

//         </div>

//         {/* PROMO */}
//         <div className="mt-6 bg-white/5 border border-white/10 p-6 rounded-2xl">

//           <h2 className="font-bold mb-3">Promo Code</h2>

//           <div className="flex gap-3">

//             <input
//               value={promo}
//               onChange={(e) => setPromo(e.target.value)}
//               placeholder="Enter promo..."
//               className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
//             />

//             <button
//               onClick={applyPromo}
//               className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-xl"
//             >
//               {loading ? "..." : "Apply"}
//             </button>

//           </div>

//         </div>

//         {/* AVATAR UPLOAD */}
//         <div className="mt-6 bg-white/5 border border-white/10 p-6 rounded-2xl">

//           <h2 className="font-bold mb-3">Upload Avatar</h2>

//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) =>
//               setFile(e.target.files?.[0] || null)
//             }
//             className="w-full text-sm"
//           />

//           <button
//             onClick={uploadAvatar}
//             className="mt-3 px-6 py-2 bg-green-500 text-white font-bold rounded-xl"
//           >
//             Upload
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }







import { useEffect, useState } from "react";

const API = "https://cpmmarker.onrender.com";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [promo, setPromo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [tgLoading, setTgLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= LOAD USER ================= */
  const loadUser = async () => {
    try {
      const res = await fetch(`${API}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.id) setUser(data);
      else setUser(null);
    } catch (e) {
      console.log("LOAD USER ERROR:", e);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  /* ================= TELEGRAM ================= */
  const connectTG = async () => {
    try {
      setTgLoading(true);

      const res = await fetch(`${API}/profile/telegram/link`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.link) {
        window.open(data.link, "_blank");
      }

      setTimeout(loadUser, 2000);
    } catch (e) {
      console.log(e);
    } finally {
      setTgLoading(false);
    }
  };

  /* ================= PROMO ================= */
  const applyPromo = async () => {
    if (!promo.trim()) return alert("Enter promo code");

    setLoading(true);

    try {
      const res = await fetch(`${API}/promo/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: promo }),
      });

      const data = await res.json();

      if (data?.success) {
        alert("Promo activated!");
        setPromo("");
        loadUser();
      } else {
        alert(data?.error || "Invalid promo");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILE SELECT ================= */
  const handleFile = (file: File) => {
    setFile(file);

    // превью
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ================= UPLOAD AVATAR ================= */
  const uploadAvatar = async () => {
    if (!file) return alert("Select image first");

    const form = new FormData();
    form.append("avatar", file);

    try {
      const res = await fetch(`${API}/profile/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();

      if (data?.id) {
        setUser(data);
        setFile(null);
        setPreview(null);
        alert("Avatar updated!");
      } else {
        alert("Upload error");
      }
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= LOADING ================= */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0b0d]">
        Loading...
      </div>
    );
  }

  /* ================= AVATAR SRC ================= */
  const avatarSrc = preview
    ? preview
    : user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API}${user.avatar}`
    : null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6">

          <div className="w-24 h-24 rounded-2xl bg-yellow-400 text-black flex items-center justify-center text-3xl font-black overflow-hidden">

            {avatarSrc ? (
              <img
                src={avatarSrc}
                className="w-full h-full object-cover"
              />
            ) : (
              user.name?.[0]
            )}

          </div>

          <div>
            <h1 className="text-3xl font-black">{user.name}</h1>
            <p className="text-white/40">{user.email}</p>
            <p className="text-sm text-white/60 mt-1">
              ID: #{user.id}
            </p>
          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mt-6">

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <p className="text-white/40 text-sm">Discount</p>
            <p className="text-2xl font-black text-yellow-400">
              {user.discount || 0}%
            </p>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">

            <p className="text-white/40 text-sm">Telegram</p>

            {user.telegram_id ? (
              <div>
                <p className="text-green-400 font-bold">
                  Connected
                </p>
                <p className="text-sm text-white/60">
                  @{user.telegram_username}
                </p>
              </div>
            ) : (
              <button
                onClick={connectTG}
                disabled={tgLoading}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl"
              >
                {tgLoading ? "Connecting..." : "Connect Telegram"}
              </button>
            )}

          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <p className="text-white/40 text-sm">Orders</p>
            <p className="text-2xl font-black">0</p>
          </div>

        </div>

        {/* PROMO */}
        <div className="mt-6 bg-white/5 border border-white/10 p-6 rounded-2xl">

          <h2 className="font-bold mb-3">Promo Code</h2>

          <div className="flex gap-3">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Enter promo..."
              className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
            />

            <button
              onClick={applyPromo}
              className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-xl"
            >
              {loading ? "..." : "Apply"}
            </button>
          </div>

        </div>

        {/* AVATAR UPLOAD */}
        <div className="mt-6 bg-white/5 border border-white/10 p-6 rounded-2xl">

          <h2 className="font-bold mb-3">Upload Avatar</h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleFile(e.target.files[0])
            }
            className="w-full text-sm"
          />

          {preview && (
            <img
              src={preview}
              className="mt-3 w-24 h-24 object-cover rounded-xl"
            />
          )}

          <button
            onClick={uploadAvatar}
            className="mt-3 px-6 py-2 bg-green-500 text-white font-bold rounded-xl"
          >
            Upload
          </button>

        </div>

      </div>
    </div>
  );
}