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
    if (!email || !password) {
      alert("Заполни email и password");
      return;
    }

    const endpoint = isRegister ? "/register" : "/login";

    const body = isRegister
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(
        `https://cpmmarker.onrender.com${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка сервера");
        return;
      }

      if (isRegister) {
        alert("Аккаунт создан!");
        setMode("login");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        window.location.href = "/market";
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-[400px] p-8 bg-[#111] rounded-2xl">

        <h1 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          CPM MARKET
        </h1>

        {/* TABS */}
        <div className="flex mb-6 gap-2">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 p-2 rounded ${
              mode === "login" ? "bg-yellow-500 text-black" : "bg-gray-800"
            }`}
          >
            LOGIN
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 p-2 rounded ${
              mode === "register" ? "bg-yellow-500 text-black" : "bg-gray-800"
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* NAME */}
        {isRegister && (
          <input
            className="w-full p-2 mb-2 bg-gray-900 rounded"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {/* EMAIL */}
        <input
          className="w-full p-2 mb-2 bg-gray-900 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative mb-4">
          <input
            className="w-full p-2 bg-gray-900 rounded"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-400"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAuth}
          className="w-full bg-yellow-500 text-black font-bold p-2 rounded"
        >
          {isRegister ? (
            <>
              <Sparkles size={18} /> CREATE ACCOUNT
            </>
          ) : (
            <>
              <LogIn size={18} /> SIGN IN
            </>
          )}
        </button>
      </div>
    </div>
  );
}