
// import { useState, useEffect } from "react";
// import { Eye, EyeOff } from "lucide-react";

// type Mode = "login" | "register";

// const API = "https://cpmmarker.onrender.com";

// export default function Auth() {
//   const [mode, setMode] = useState<Mode>("login");
//   const [showPassword, setShowPassword] = useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [ref, setRef] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const isRegister = mode === "register";

//   /* ================= GET REF ================= */
//   useEffect(() => {
//     const urlRef = new URLSearchParams(window.location.search).get("ref");

//     if (urlRef) {
//       setRef(urlRef);

//       // авто регистрация
//       setMode("register");
//     }
//   }, []);

//   /* ================= AUTH ================= */
//   const handleAuth = async () => {
//     try {
//       setLoading(true);

//       const endpoint = isRegister ? "/auth/register" : "/auth/login";

//       const body = isRegister
//         ? {
//             name,
//             email,
//             password,

//             // 🔥 FIX: правильное имя поля
//             referred_by: ref || null,
//           }
//         : { email, password };

//       const res = await fetch(`${API}${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data?.error || "Auth error");
//         return;
//       }

//       if (data?.token) {
//         localStorage.setItem("token", data.token);
//         window.location.href = "/market";
//       } else {
//         alert("No token received");
//       }
//     } catch (e) {
//       console.log(e);
//       alert("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d] text-white px-4">

//       <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8">

//         {/* TITLE */}
//         <h1 className="text-3xl font-black text-center mb-2">
//           CPM <span className="text-yellow-400">MARKET</span>
//         </h1>

//         <p className="text-center text-white/40 mb-6 text-sm">
//           Welcome
//         </p>

//         {/* REF */}
//         {ref && (
//           <div className="mb-4 text-center text-xs text-yellow-400">
//             🔥 Referral active: {ref}
//           </div>
//         )}

//         {/* SWITCH */}
//         <div className="flex bg-black/40 rounded-xl p-1 mb-6">
//           <button
//             onClick={() => setMode("login")}
//             className={`flex-1 py-2 rounded-lg font-bold ${
//               mode === "login" ? "bg-yellow-400 text-black" : "text-white/50"
//             }`}
//           >
//             LOGIN
//           </button>

//           <button
//             onClick={() => setMode("register")}
//             className={`flex-1 py-2 rounded-lg font-bold ${
//               mode === "register" ? "bg-yellow-400 text-black" : "text-white/50"
//             }`}
//           >
//             SIGN UP
//           </button>
//         </div>

//         {/* INPUTS */}
//         <div className="space-y-3">

//           {isRegister && (
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Username"
//               className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
//             />
//           )}

//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
//           />

//           <div className="relative">
//             <input
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full p-3 rounded-xl bg-black/40 border border-white/10"
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//         </div>

//         {/* BUTTON */}
//         <button
//           onClick={handleAuth}
//           disabled={loading}
//           className="w-full mt-6 py-3 rounded-xl bg-yellow-400 text-black font-black"
//         >
//           {loading ? "Loading..." : isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
//         </button>

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

  /* ================= REF FROM URL ================= */
  useEffect(() => {
    const urlRef = new URLSearchParams(window.location.search).get("ref");

    if (urlRef) {
      setRef(urlRef);
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

            // ✅ ВАЖНО: совпадает с backend (referredBy)
            referredBy: ref || null,
          }
        : {
            email,
            password,
          };

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Auth error");
        return;
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);

        // защита от белого экрана
        window.location.href = "/market";
      } else {
        alert("Token not received");
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
          Welcome to system
        </p>

        {/* REF INFO */}
        {ref && (
          <div className="mb-4 text-center text-xs text-yellow-400">
            🔥 Referral activated: {ref}
          </div>
        )}

        {/* SWITCH */}
        <div className="flex bg-black/40 rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              mode === "login"
                ? "bg-yellow-400 text-black"
                : "text-white/50"
            }`}
          >
            LOGIN
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              mode === "register"
                ? "bg-yellow-400 text-black"
                : "text-white/50"
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
              className="absolute right-3 top-3 text-white/50"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl bg-yellow-400 text-black font-black hover:scale-[1.02] transition"
        >
          {loading
            ? "Loading..."
            : isRegister
            ? "CREATE ACCOUNT"
            : "SIGN IN"}
        </button>

      </div>
    </div>
  );
}