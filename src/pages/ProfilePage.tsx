import { useEffect, useState } from "react";

const API = "https://cpmmarker.onrender.com";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [promo, setPromo] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= LOAD USER ================= */
  const loadUser = async () => {
    const res = await fetch(`${API}/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data?.id) setUser(data);
  };

  useEffect(() => {
    loadUser();
  }, []);

  /* ================= TELEGRAM CONNECT ================= */
  const connectTG = () => {
    const userId = user?.id;
    window.open(`https://t.me/YOUR_BOT_USERNAME?start=${userId}`, "_blank");
  };

  /* ================= PROMO ================= */
  const applyPromo = async () => {
    setLoading(true);

    const res = await fetch(`${API}/promo/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: promo }),
    });

    const data = await res.json();

    setLoading(false);

    if (data?.success) {
      alert("Promo activated!");
      setPromo("");
      loadUser();
    } else {
      alert(data?.error || "Error");
    }
  };

  /* ================= AVATAR ================= */
  const uploadAvatar = async () => {
    const res = await fetch(`${API}/profile/update-avatar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar }),
    });

    const data = await res.json();

    if (data?.id) {
      setUser(data);
      alert("Avatar updated!");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        LOADING...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white p-6">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto">

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6">

          <div className="w-24 h-24 rounded-2xl bg-yellow-400 text-black flex items-center justify-center text-3xl font-black overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : (
              user.name?.[0]
            )}
          </div>

          <div>
            <h1 className="text-3xl font-black">{user.name}</h1>
            <p className="text-white/40">{user.email}</p>

            <p className="text-sm text-white/60 mt-1">
              ID: #{user.id}
            </p>
          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mt-6">

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <p className="text-white/40 text-sm">Discount</p>
            <p className="text-2xl font-black text-yellow-400">
              {user.discount || 0}%
            </p>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <p className="text-white/40 text-sm">Telegram</p>

            {user.telegram_id ? (
              <div>
                <p className="text-green-400 font-bold">Connected</p>
                <p className="text-sm text-white/60">
                  @{user.telegram_username}
                </p>
              </div>
            ) : (
              <button
                onClick={connectTG}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl"
              >
                Connect Telegram
              </button>
            )}
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <p className="text-white/40 text-sm">Orders</p>
            <p className="text-2xl font-black">0</p>
          </div>

        </div>

        {/* PROMO */}
        <div className="mt-6 bg-white/5 border border-white/10 p-6 rounded-2xl">

          <h2 className="font-bold mb-3">Promo Code</h2>

          <div className="flex gap-3">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Enter promo..."
              className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
            />

            <button
              onClick={applyPromo}
              className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-xl"
            >
              {loading ? "..." : "Apply"}
            </button>
          </div>

        </div>

        {/* AVATAR UPLOAD */}
        <div className="mt-6 bg-white/5 border border-white/10 p-6 rounded-2xl">

          <h2 className="font-bold mb-3">Change Avatar</h2>

          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Image URL..."
            className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
          />

          <button
            onClick={uploadAvatar}
            className="mt-3 px-6 py-2 bg-green-500 text-white font-bold rounded-xl"
          >
            Save Avatar
          </button>

        </div>

      </div>
    </div>
  );
}