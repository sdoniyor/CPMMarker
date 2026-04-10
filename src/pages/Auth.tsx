import { useState } from "react";
import { LogIn, UserPlus, Eye, EyeOff, Sparkles } from "lucide-react";

type Mode = "login" | "register";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  const handleAuth = async () => {
    const endpoint = isRegister ? "/register" : "/login";
    const body = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`https://render.com/docs/troubleshooting-deploys${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      if (isRegister) {
        alert("Account created! Now login");
        setMode("login");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        window.location.href = "/market";
      }
    } catch (e) { alert("Server error"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,#111827,#000)] text-white relative overflow-hidden font-sans">
      <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full -top-40 -left-40" />
      
      <div className="w-[400px] p-8 rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl relative z-10">
        <h1 className="text-3xl font-black text-center text-yellow-400 italic tracking-tighter mb-8">CPM MARKET</h1>

        {/* TABS - Исправленное переключение */}
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 mb-6">
          <button 
            onClick={() => setMode("login")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              mode === "login" ? "bg-yellow-500 text-black shadow-lg" : "text-white/40 hover:text-white"
            }`}
          >
            <LogIn size={18} /> LOGIN
          </button>
          <button 
            onClick={() => setMode("register")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              mode === "register" ? "bg-yellow-500 text-black shadow-lg" : "text-white/40 hover:text-white"
            }`}
          >
            <UserPlus size={18} /> SIGN UP
          </button>
        </div>

        <div className="space-y-4">
          {isRegister && (
            <input
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-yellow-500/50 outline-none transition-all"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-yellow-500/50 outline-none transition-all"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-yellow-500/50 outline-none transition-all"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-white/20 hover:text-white">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            onClick={handleAuth}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-[0_0_30px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2 mt-2"
          >
            {isRegister ? <><Sparkles size={20}/> CREATE ACCOUNT</> : <><LogIn size={20}/> SIGN IN</>}
          </button>
        </div>
      </div>
    </div>
  );
}