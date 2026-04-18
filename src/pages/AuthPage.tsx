// import { useState } from "react";
// import { apiFetch } from "../api/api";

// export default function Auth() {
//   const [mode, setMode] = useState<"login" | "register">("login");

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const isRegister = mode === "register";

//   const handleAuth = async () => {
//     const endpoint = isRegister ? "/auth/register" : "/auth/login";

//     const data = await apiFetch(endpoint, {
//       method: "POST",
//       body: JSON.stringify(
//         isRegister ? { name, email, password } : { email, password }
//       ),
//     });

//     if (!data?.token) return alert("Error");

//     localStorage.setItem("token", data.token);

//     const user = await apiFetch("/profile/me");

//     localStorage.setItem("user", JSON.stringify(user));

//     window.location.href = "/market";
//   };

//   return (
//     <div>
//       <h1>{isRegister ? "Register" : "Login"}</h1>

//       {isRegister && (
//         <input placeholder="name" onChange={(e) => setName(e.target.value)} />
//       )}

//       <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />

//       <input
//         placeholder="password"
//         type="password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={handleAuth}>
//         {isRegister ? "Register" : "Login"}
//       </button>

//       <button onClick={() => setMode(isRegister ? "login" : "register")}>
//         switch
//       </button>
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

  // 🔥 REF
  const [ref, setRef] = useState<string | null>(null);

  const isRegister = mode === "register";

  /* ================= GET REF FROM URL ================= */
  useEffect(() => {
    const urlRef = new URLSearchParams(window.location.search).get("ref");
    if (urlRef) {
      setRef(urlRef);
      setMode("register"); // авто переключение на регистрацию
    }
  }, []);

  /* ================= AUTH ================= */
  const handleAuth = async () => {
    const endpoint = isRegister ? "/auth/register" : "/auth/login";

    const body = isRegister
      ? {
          name,
          email,
          password,
          referredBy: ref, // 🔥 ВАЖНО
        }
      : { email, password };

    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.error || "Error");
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/market";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d] text-white px-4">

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">

        {/* TITLE */}
        <h1 className="text-3xl font-black text-center mb-2">
          CPM <span className="text-yellow-400">MARKET</span>
        </h1>

        <p className="text-center text-white/40 mb-6 text-sm">
          Welcome back 👋
        </p>

        {/* REF INFO */}
        {ref && (
          <div className="mb-4 text-center text-xs text-yellow-400">
            🔥 Referral activated
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
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none"
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none"
          />

          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none"
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
          className="w-full mt-6 py-3 rounded-xl bg-yellow-400 text-black font-black hover:scale-[1.02] transition"
        >
          {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
        </button>

      </div>
    </div>
  );
}