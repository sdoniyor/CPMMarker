
// import { useEffect, useState } from "react";

// const API = "https://cpmmarker.onrender.com";

// type User = {
//   id: number;
//   name: string;
//   email?: string;
//   discount?: number;
//   discount_cars?: number[];
//   telegram_id?: string;
//   telegram_username?: string;
//   avatar?: string;
//   ref_code?: string;
//   ref_count?: number;
// };

// export default function Profile() {
//   const [user, setUser] = useState<User | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const token = localStorage.getItem("token");

//   /* ================= LOAD ================= */
//   const loadUser = async () => {
//     try {
//       const res = await fetch(`${API}/profile/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();

//       if (data?.id) setUser(data);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   /* ================= FILE ================= */
//   const handleFile = (f: File) => {
//     setFile(f);

//     const reader = new FileReader();
//     reader.onload = () => setPreview(reader.result as string);
//     reader.readAsDataURL(f);
//   };

//   /* ================= UPLOAD ================= */
//   const uploadAvatar = async () => {
//     if (!file) return alert("Select file");

//     const form = new FormData();
//     form.append("avatar", file);

//     const res = await fetch(`${API}/profile/upload-avatar`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: form,
//     });

//     const data = await res.json();

//     if (data?.id) {
//       setUser(data);
//       setFile(null);
//       setPreview(null);
//     } else {
//       alert("Upload error");
//     }
//   };

//   if (!user) return <div className="text-white">Loading...</div>;

//   const avatar = preview
//     ? preview
//     : user.avatar
//     ? `${API}${user.avatar}`
//     : null;

//   const refLink = `${window.location.origin}/auth?ref=${user.ref_code}`;

//   return (
//     <div className="min-h-screen bg-black text-white p-6">

//       {/* USER */}
//       <div className="flex gap-4 items-center">
//         <div className="w-20 h-20 rounded-xl overflow-hidden bg-yellow-400 flex items-center justify-center text-black font-black">
//           {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : user.name[0]}
//         </div>

//         <div>
//           <h1 className="text-2xl font-bold">{user.name}</h1>
//           <p className="text-white/40">{user.email}</p>
//         </div>
//       </div>

//       {/* REF */}
//       <div className="mt-6 bg-white/10 p-4 rounded-xl">
//         <p>Referral link:</p>

//         <div className="flex gap-2 mt-2">
//           <input
//             value={refLink}
//             readOnly
//             className="flex-1 bg-black p-2 rounded"
//           />
//           <button
//             onClick={() => navigator.clipboard.writeText(refLink)}
//             className="bg-yellow-400 text-black px-4 rounded"
//           >
//             Copy
//           </button>
//         </div>

//         <p className="text-sm text-white/40 mt-2">
//           Ref count: {user.ref_count}
//         </p>
//       </div>

//       {/* UPLOAD */}
//       <div className="mt-6">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => e.target.files && handleFile(e.target.files[0])}
//         />

//         {preview && (
//           <img src={preview} className="w-20 h-20 mt-2 rounded-xl" />
//         )}

//         <button
//           onClick={uploadAvatar}
//           className="mt-3 bg-green-500 px-4 py-2 rounded"
//         >
//           Upload avatar
//         </button>
//       </div>

//       {/* DISCOUNT */}
//       <div className="mt-6">
//         <p>Discount: {user.discount}%</p>
//         <p className="text-white/40">
//           Cars: {JSON.stringify(user.discount_cars)}
//         </p>
//       </div>

//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

type Mode = "login" | "register";

const API = "https://cpmmarker.onrender.com";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [ref, setRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  /* ================= GET REF ================= */
  useEffect(() => {
    const urlRef = new URLSearchParams(window.location.search).get("ref");

    if (urlRef) {
      setRef(urlRef);

      // авто регистрация
      setMode("register");
    }
  }, []);

  /* ================= AUTH ================= */
  const handleAuth = async () => {
    try {
      setLoading(true);

      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      const body = isRegister
        ? {
            name,
            email,
            password,

            // 🔥 FIX: правильное имя поля
            referred_by: ref || null,
          }
        : { email, password };

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Auth error");
        return;
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/market";
      } else {
        alert("No token received");
      }
    } catch (e) {
      console.log(e);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d] text-white px-4">

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8">

        {/* TITLE */}
        <h1 className="text-3xl font-black text-center mb-2">
          CPM <span className="text-yellow-400">MARKET</span>
        </h1>

        <p className="text-center text-white/40 mb-6 text-sm">
          Welcome
        </p>

        {/* REF */}
        {ref && (
          <div className="mb-4 text-center text-xs text-yellow-400">
            🔥 Referral active: {ref}
          </div>
        )}

        {/* SWITCH */}
        <div className="flex bg-black/40 rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg font-bold ${
              mode === "login" ? "bg-yellow-400 text-black" : "text-white/50"
            }`}
          >
            LOGIN
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-lg font-bold ${
              mode === "register" ? "bg-yellow-400 text-black" : "text-white/50"
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* INPUTS */}
        <div className="space-y-3">

          {isRegister && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
          />

          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl bg-yellow-400 text-black font-black"
        >
          {loading ? "Loading..." : isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
        </button>

      </div>
    </div>
  );
}