import { useState } from "react";
import { apiFetch } from "../api/api";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  const handleAuth = async () => {
    const endpoint = isRegister ? "/auth/register" : "/auth/login";

    const data = await apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(
        isRegister ? { name, email, password } : { email, password }
      ),
    });

    if (!data?.token) return alert("Error");

    localStorage.setItem("token", data.token);

    const user = await apiFetch("/profile/me");

    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "/market";
  };

  return (
    <div>
      <h1>{isRegister ? "Register" : "Login"}</h1>

      {isRegister && (
        <input placeholder="name" onChange={(e) => setName(e.target.value)} />
      )}

      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleAuth}>
        {isRegister ? "Register" : "Login"}
      </button>

      <button onClick={() => setMode(isRegister ? "login" : "register")}>
        switch
      </button>
    </div>
  );
}