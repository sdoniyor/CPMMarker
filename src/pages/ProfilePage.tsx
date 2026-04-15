// import { useEffect, useState } from "react";
// import { apiFetch } from "../api/api";

// export default function Profile() {
//   const [user, setUser] = useState<any>(null);

//   const load = async () => {
//     const data = await apiFetch("/profile/me");
//     setUser(data);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   if (!user) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>{user.name}</h1>
//       <p>{user.email}</p>
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.id) setUser(data);
    };

    load();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center text-white">
        LOADING...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white">
      {/* <Navbar /> */}

      <div className="max-w-5xl mx-auto p-6">

        {/* HEADER CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

          <div className="flex items-center gap-6">

            <div className="w-24 h-24 rounded-2xl bg-yellow-400 text-black flex items-center justify-center text-3xl font-black">
              {user.name?.[0]}
            </div>

            <div>
              <h1 className="text-3xl font-black">
                {user.name}
              </h1>
              <p className="text-white/40">{user.email}</p>

              <div className="mt-2 text-sm text-white/60">
                ID: #{user.id}
              </div>
            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mt-6">

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <p className="text-white/40 text-sm">Discount</p>
            <p className="text-2xl font-black text-yellow-400">
              {user.discount || 0}%
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <p className="text-white/40 text-sm">Orders</p>
            <p className="text-2xl font-black">0</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <p className="text-white/40 text-sm">Status</p>
            <p className="text-2xl font-black text-green-400">Active</p>
          </div>

        </div>

      </div>
    </div>
  );
}