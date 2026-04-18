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
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

type Mode = "login" | "register";

const API = "https://cpmmarker.onrender.com";

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [ref, setRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  /* ================= REF + FORCE AUTH ================= */
  useEffect(() => {
    const urlRef = new URLSearchParams(window.location.search).get("ref");

    if (urlRef) {
      // 🔥 ВАЖНО: сбрасываем токен если пришли по рефералке
      localStorage.removeItem("token");

      setRef(urlRef);
      setMode("register");
    }
  }, []);

  /* ================= CHECK AUTH (FIXED) ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    // ❌ НЕ просто проверка наличия
    if (!token) return;

    // 🔥 даём время UI не дергаться
    const timeout = setTimeout(() => {
      navigate("/market", { replace: true });
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  /* ================= AUTH ================= */
  const handleAuth = async () => {
    if (!email || !password) return alert("Fill all fields");

    try {
      setLoading(true);

      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      const body = isRegister
        ? {
            name,
            email,
            password,
            referredBy: ref || null,
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

        navigate("/market", { replace: true });
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

        <h1 className="text-3xl font-black text-center mb-2">
          CPM <span className="text-yellow-400">MARKET</span>
        </h1>

        <p className="text-center text-white/40 mb-6 text-sm">
          Welcome back
        </p>

        {ref && (
          <div className="mb-4 text-center text-xs text-yellow-400">
            🔥 Referral active: {ref}
          </div>
        )}

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