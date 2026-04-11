
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cpmmarker.onrender.com";

export default function Profile() {
  const navigate = useNavigate();

  const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [promo, setPromo] = useState("");
  const [promoStatus, setPromoStatus] = useState("");

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async () => {
    if (!userLocal?.id) return;

    const res = await fetch(`${API}/profile/${userLocal.id}`);
    const data = await res.json();

    setUser(data);

    // sync localStorage
    localStorage.setItem("user", JSON.stringify(data));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ================= BASE64 ================= */
  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  /* ================= AVATAR UPLOAD ================= */
  const handleAvatarChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const updateAvatar = async () => {
    if (!avatarFile) return alert("Choose image first");

    try {
      const base64 = await convertBase64(avatarFile);

      const res = await fetch(`${API}/update-avatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userLocal.id,
          avatar: base64,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("✅ Avatar updated");
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (e) {
      alert("Server error");
    }
  };

  /* ================= PROMO ================= */
  const applyPromo = async () => {
    try {
      const res = await fetch(`${API}/promo/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userLocal.id,
          code: promo,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPromoStatus("✅ Promo activated successfully!");
        loadProfile(); // обновляем данные пользователя
      } else {
        setPromoStatus("❌ " + data.error);
      }
    } catch {
      setPromoStatus("❌ Server error");
    }
  };

  /* ================= LOADING ================= */
  if (!user) {
    return (
      <div className="text-white p-10 min-h-screen bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-[900px] grid grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="bg-white/5 p-6 rounded-xl text-center border border-white/10">

          {/* AVATAR */}
          <img
            src={user.avatar || "https://i.pravatar.cc/150"}
            className="w-32 h-32 rounded-full mx-auto border-2 border-yellow-400 object-cover"
          />

          <h1 className="text-yellow-400 text-xl mt-3">
            {user.name}
          </h1>

          <p className="text-white/50 text-sm">ID #{user.id}</p>

          {/* FILE INPUT */}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="mt-4 w-full text-sm"
          />

          <button
            onClick={updateAvatar}
            className="mt-3 w-full bg-yellow-400 text-black py-2 rounded font-bold"
          >
            Upload Avatar
          </button>

          <button
            onClick={() => navigate("/market")}
            className="mt-3 w-full bg-white/10 py-2 rounded"
          >
            Back
          </button>
        </div>

        {/* RIGHT */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

          <h2 className="text-yellow-400 font-bold mb-4">
            PROFILE INFO
          </h2>

          <p>Email: {user.email}</p>
          <p>Level: {user.level}</p>
          <p>Money: ${user.money}</p>

          {/* PROMO */}
          <div className="mt-6">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              className="w-full p-2 bg-black border border-white/10 rounded"
            />

            <button
              onClick={applyPromo}
              className="mt-2 w-full bg-yellow-400 text-black py-2 rounded font-bold"
            >
              Apply Promo
            </button>

            {promoStatus && (
              <p className="text-sm mt-2 text-white/70">
                {promoStatus}
              </p>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="mt-6 w-full bg-red-500 py-2 rounded font-bold"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}