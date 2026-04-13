
// import { useState } from "react";
// import { LogIn, UserPlus, Eye, EyeOff, Sparkles } from "lucide-react";

// type Mode = "login" | "register";

// export default function Auth() {
//   const [mode, setMode] = useState<Mode>("login");
//   const [showPassword, setShowPassword] = useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const isRegister = mode === "register";

//   const handleAuth = async () => {
//     const endpoint = isRegister ? "/register" : "/login";

//     const body = isRegister
//       ? { name, email, password }
//       : { email, password };

//     try {
//       const res = await fetch(
//         `https://cpmmarker.onrender.com${endpoint}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || "Error");
//         return;
//       }

//       if (isRegister) {
//         alert("Account created!");
//         setMode("login");
//       } else {
//         localStorage.setItem("user", JSON.stringify(data.user));
//         localStorage.setItem("token", data.token);
//         window.location.href = "/market";
//       }
//     } catch {
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">

//       {/* BACKGROUND GLOW */}
//       <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 blur-[140px] rounded-full -top-40 -left-40" />
//       <div className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full -bottom-40 -right-40" />

//       {/* CARD */}
//       <div className="w-[420px] p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl z-10">

//         {/* TITLE */}
//         <h1 className="text-3xl font-black text-center text-yellow-400 tracking-tight mb-2">
//           CPM MARKET
//         </h1>
//         <p className="text-center text-white/40 text-sm mb-6">
//           Welcome back to the system
//         </p>

//         {/* TABS */}
//         <div className="flex p-1 bg-black/40 rounded-2xl mb-6 border border-white/10">
//           <button
//             onClick={() => setMode("login")}
//             className={`flex-1 py-3 rounded-xl font-bold transition-all ${
//               mode === "login"
//                 ? "bg-yellow-500 text-black shadow-lg"
//                 : "text-white/40 hover:text-white"
//             }`}
//           >
//             <LogIn size={16} className="inline mr-1" />
//             LOGIN
//           </button>

//           <button
//             onClick={() => setMode("register")}
//             className={`flex-1 py-3 rounded-xl font-bold transition-all ${
//               mode === "register"
//                 ? "bg-yellow-500 text-black shadow-lg"
//                 : "text-white/40 hover:text-white"
//             }`}
//           >
//             <UserPlus size={16} className="inline mr-1" />
//             SIGN UP
//           </button>
//         </div>

//         {/* INPUTS */}
//         <div className="space-y-3">

//           {isRegister && (
//             <input
//               className="w-full p-4 rounded-xl bg-black/40 border border-white/10 focus:border-yellow-400/50 outline-none transition"
//               placeholder="Username"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           )}

//           <input
//             className="w-full p-4 rounded-xl bg-black/40 border border-white/10 focus:border-yellow-400/50 outline-none transition"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <div className="relative">
//             <input
//               className="w-full p-4 rounded-xl bg-black/40 border border-white/10 focus:border-yellow-400/50 outline-none transition"
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 top-4 text-white/30 hover:text-white"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//         </div>

//         {/* BUTTON */}
//         <button
//           onClick={handleAuth}
//           className="w-full mt-6 py-4 rounded-2xl font-black text-black bg-yellow-500 hover:bg-yellow-400 transition-all active:scale-95 shadow-[0_0_40px_rgba(234,179,8,0.25)] flex items-center justify-center gap-2"
//         >
//           {isRegister ? (
//             <>
//               <Sparkles size={18} />
//               CREATE ACCOUNT
//             </>
//           ) : (
//             <>
//               <LogIn size={18} />
//               SIGN IN
//             </>
//           )}
//         </button>

//         {/* FOOTER */}
//         <p className="text-center text-white/30 text-xs mt-5">
//           Secure login system • v1.0
//         </p>
//       </div>
//     </div>
//   );
// }



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

    const body = isRegister
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(
        `https://cpmmarker.onrender.com${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error");
        return;
      }

      // ✅ REGISTER
      if (isRegister) {
        alert("Account created!");
        setMode("login");
        return;
      }

      // 🔥 LOGIN FIX (ВАЖНО)
      localStorage.setItem("user", JSON.stringify(data)); // ❗ НЕ data.user
      localStorage.setItem("token", data.token || "");

      window.location.href = "/market";

    } catch (e) {
      console.error(e);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">

      <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 blur-[140px] rounded-full -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full -bottom-40 -right-40" />

      <div className="w-[420px] p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl z-10">

        <h1 className="text-3xl font-black text-center text-yellow-400 mb-2">
          CPM MARKET
        </h1>

        <div className="flex p-1 bg-black/40 rounded-2xl mb-6 border border-white/10">

          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-3 rounded-xl font-bold ${
              mode === "login"
                ? "bg-yellow-500 text-black"
                : "text-white/40"
            }`}
          >
            LOGIN
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-3 rounded-xl font-bold ${
              mode === "register"
                ? "bg-yellow-500 text-black"
                : "text-white/40"
            }`}
          >
            SIGN UP
          </button>
        </div>

        <div className="space-y-3">

          {isRegister && (
            <input
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

        </div>

        <button
          onClick={handleAuth}
          className="w-full mt-6 py-4 rounded-2xl font-black bg-yellow-500 text-black"
        >
          {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
        </button>

      </div>
    </div>
  );
}