
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

//       // ✅ REGISTER
//       if (isRegister) {
//         alert("Account created!");
//         setMode("login");
//         return;
//       }

//       // 🔥 LOGIN FIX (ВАЖНО)
//       localStorage.setItem("user", JSON.stringify(data)); // ❗ НЕ data.user
//       localStorage.setItem("token", data.token || "");

//       window.location.href = "/market";

//     } catch (e) {
//       console.error(e);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">

//       <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 blur-[140px] rounded-full -top-40 -left-40" />
//       <div className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full -bottom-40 -right-40" />

//       <div className="w-[420px] p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl z-10">

//         <h1 className="text-3xl font-black text-center text-yellow-400 mb-2">
//           CPM MARKET
//         </h1>

//         <div className="flex p-1 bg-black/40 rounded-2xl mb-6 border border-white/10">

//           <button
//             onClick={() => setMode("login")}
//             className={`flex-1 py-3 rounded-xl font-bold ${
//               mode === "login"
//                 ? "bg-yellow-500 text-black"
//                 : "text-white/40"
//             }`}
//           >
//             LOGIN
//           </button>

//           <button
//             onClick={() => setMode("register")}
//             className={`flex-1 py-3 rounded-xl font-bold ${
//               mode === "register"
//                 ? "bg-yellow-500 text-black"
//                 : "text-white/40"
//             }`}
//           >
//             SIGN UP
//           </button>
//         </div>

//         <div className="space-y-3">

//           {isRegister && (
//             <input
//               placeholder="Username"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
//             />
//           )}

//           <input
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 top-4"
//             >
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>

//         </div>

//         <button
//           onClick={handleAuth}
//           className="w-full mt-6 py-4 rounded-2xl font-black bg-yellow-500 text-black"
//         >
//           {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
//         </button>

//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Mode = "login" | "register";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ FIX: ОБЯЗАТЕЛЬНО внутри компонента
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      console.log("AUTH RESPONSE:", data);

      if (!res.ok) {
        alert(data.error || "Error");
        return;
      }

      // ================= REGISTER =================
      if (isRegister) {
        alert("Account created!");
        setMode("login");
        setName("");
        setEmail("");
        setPassword("");
        return;
      }

      // ================= LOGIN =================
      if (!data) {
        alert("Empty response");
        return;
      }

      // сохраняем пользователя
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token || "");

      window.location.href = "/market";
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-[420px] p-8 rounded-3xl border border-white/10 bg-white/5">

        <h1 className="text-3xl font-black text-center text-yellow-400 mb-6">
          CPM MARKET
        </h1>

        {/* TABS */}
        <div className="flex mb-6 bg-black/40 rounded-xl p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg font-bold ${
              mode === "login"
                ? "bg-yellow-500 text-black"
                : "text-white/40"
            }`}
          >
            LOGIN
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-lg font-bold ${
              mode === "register"
                ? "bg-yellow-500 text-black"
                : "text-white/40"
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
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none"
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none"
          />

          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-white/40"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAuth}
          className="w-full mt-6 py-4 bg-yellow-500 text-black font-black rounded-xl"
        >
          {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
        </button>
      </div>
    </div>
  );
}