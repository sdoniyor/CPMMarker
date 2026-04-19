
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SERVER_URL = "https://cpmmarker.onrender.com";

// export default function Navbar() {
//   const [user, setUser] = useState<any>(null);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   const loadUser = async () => {
//     if (!token) return;

//     try {
//       const res = await fetch(`${SERVER_URL}/profile/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (data?.id) setUser(data);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const goProfile = (e: any) => {
//     e?.preventDefault?.();   // 💥 FIX 1
//     e?.stopPropagation?.();  // 💥 FIX 2

//     if (!token) {
//       navigate("/", { replace: true });
//       return;
//     }

//     navigate("/profile", { replace: false });
//   };

//   return (
//     <nav className="w-full h-[70px] fixed top-0 left-0 z-[100] bg-[#0a0a0a] border-b border-white/5">
//       <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">

//         <div
//           onClick={() => navigate("/market")}
//           className="text-white font-black cursor-pointer"
//         >
//           CPM<span className="text-yellow-400">MARKET</span>
//         </div>

//         {/* 💥 ВАЖНО: button вместо div */}
//         <button
//           type="button"
//           onClick={goProfile}
//           className="flex items-center gap-3 cursor-pointer"
//         >
//           <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-black">
//             {user?.name?.[0] || "U"}
//           </div>

//           <div className="hidden sm:block text-white text-sm">
//             {user?.name || "Guest"}
//           </div>
//         </button>

//       </div>
//     </nav>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = "https://cpmmarker.onrender.com";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loadUser = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${SERVER_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.id) setUser(data);
    } catch (e) {
      console.log("NAVBAR LOAD ERROR:", e);
    }
  };

  useEffect(() => {
    loadUser();

    // 🔥 слушаем обновление профиля
    const handler = () => {
      loadUser();
    };

    window.addEventListener("profile-update", handler);

    return () => {
      window.removeEventListener("profile-update", handler);
    };
  }, [token]);

  const goProfile = (e: any) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    navigate("/profile");
  };

  return (
    <nav className="w-full h-[70px] fixed top-0 left-0 z-[100] bg-[#0a0a0a] border-b border-white/5">
      <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">

        <div
          onClick={() => navigate("/market")}
          className="text-white font-black cursor-pointer"
        >
          CPM<span className="text-yellow-400">MARKET</span>
        </div>

        <button
          type="button"
          onClick={goProfile}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-black overflow-hidden">
            {user?.avatar ? (
              <img
                src={`${SERVER_URL}${user.avatar}?t=${Date.now()}`} // 🔥 cache fix
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.[0] || "U"
            )}
          </div>

          <div className="hidden sm:block text-white text-sm">
            {user?.name || "Guest"}
          </div>
        </button>

      </div>
    </nav>
  );
}