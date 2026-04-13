
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function Market() {
//   const [cars, setCars] = useState<any[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [search, setSearch] = useState("");
//   const [onlyPremium, setOnlyPremium] = useState(false);

//   const navigate = useNavigate();
//   const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

//   useEffect(() => {
//     loadCars();
//     loadUser();
//   }, []);

//   /* ================= SAFE FETCH ================= */
//   const safeFetchJSON = async (url: string) => {
//     const res = await fetch(url);
//     const text = await res.text();

//     try {
//       return JSON.parse(text);
//     } catch (e) {
//       console.error("❌ Server returned non-JSON:", text);
//       return null;
//     }
//   };

//   /* ================= LOAD ================= */
//   const loadCars = async () => {
//     try {
//       const data = await safeFetchJSON(`${API}/cars`);
//       setCars(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Ошибка загрузки авто:", err);
//     }
//   };

//   const loadUser = async () => {
//     if (!userLocal.id) return;

//     try {
//       const data = await safeFetchJSON(`${API}/profile/${userLocal.id}`);
//       if (data) setUser(data);
//     } catch (err) {
//       console.error("Ошибка загрузки профиля:", err);
//     }
//   };

//   /* ================= DISCOUNT ================= */
//   const isDiscountCar = (car: any) => {
//     if (!user?.discount || !user?.discount_cars) return false;

//     const allowed =
//       typeof user.discount_cars === "string"
//         ? JSON.parse(user.discount_cars)
//         : user.discount_cars;

//     return Array.isArray(allowed) ? allowed.includes(car.id) : false;
//   };

//   const getDiscountPercent = (car: any) => {
//     if (!user?.discount || !user?.discount_cars) return 0;

//     const allowed =
//       typeof user.discount_cars === "string"
//         ? JSON.parse(user.discount_cars)
//         : user.discount_cars;

//     return Array.isArray(allowed) && allowed.includes(car.id)
//       ? user.discount
//       : 0;
//   };

//   const getPrice = (car: any) => {
//     if (isDiscountCar(car)) {
//       return Math.floor(car.price - (car.price * user.discount) / 100);
//     }
//     return car.price;
//   };

//   /* ================= FILTER ================= */
//   const filteredCars = cars.filter((car) => {
//     const matchSearch =
//       car.name?.toLowerCase().includes(search.toLowerCase()) ||
//       car.brand?.toLowerCase().includes(search.toLowerCase());

//     const matchPremium = onlyPremium ? car.premium : true;

//     return matchSearch && matchPremium;
//   });

//   return (
//     <div className="min-h-screen bg-[#050608] text-white relative">

//       {/* NAVBAR */}
//       <div className="sticky top-0 z-[100] bg-[#050608]/80 backdrop-blur-xl border-b border-white/5">
//         <Navbar />
//       </div>

//       {/* BACKGROUND */}
//       <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1d26_0%,#050608_100%)] pointer-events-none z-0" />

//       <div className="relative z-10 max-w-[1400px] mx-auto p-4 lg:p-8">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/10">

//           <h1 className="text-4xl font-black italic uppercase">
//             AUTO <span className="text-yellow-500">MARKET</span>
//           </h1>

//           <div className="flex gap-4">
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="SEARCH..."
//               className="px-6 py-3 bg-black/40 border border-white/10 rounded-xl"
//             />

//             <button
//               onClick={() => setOnlyPremium(!onlyPremium)}
//               className={`px-6 py-3 rounded-xl font-black ${
//                 onlyPremium ? "bg-yellow-500 text-black" : "bg-white/10"
//               }`}
//             >
//               PREMIUM
//             </button>
//           </div>
//         </div>

//         {/* GRID */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

//           {filteredCars.map((car) => {
//             const discounted = isDiscountCar(car);
//             const discountPercent = getDiscountPercent(car);
//             const price = getPrice(car);

//             return (
//               <div
//                 key={car.id}
//                 onClick={() => navigate(`/car/${car.id}`)}
//                 className="relative cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500 transition"
//               >

//                 {/* 🔥 DISCOUNT BADGE */}
//                 {discounted && (
//                   <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg z-10">
//                     -{discountPercent}%
//                   </div>
//                 )}

//                 {/* IMAGE */}
//                 <div className="h-40 flex items-center justify-center">
//                   <img
//                     src={car.image_url}
//                     className="h-full object-contain"
//                   />
//                 </div>

//                 {/* INFO */}
//                 <div className="p-4">

//                   <h2 className="font-bold">{car.name}</h2>
//                   <p className="text-white/40 text-sm">{car.brand}</p>

//                   <div className="flex justify-between mt-3">
//                     <div>
//                       {discounted && (
//                         <p className="line-through text-xs text-white/30">
//                           ${car.price}
//                         </p>
//                       )}

//                       <p className="text-yellow-400 font-bold">
//                         ${price}
//                       </p>
//                     </div>

//                     {car.premium && <span>👑</span>}
//                   </div>

//                 </div>
//               </div>
//             );
//           })}

//         </div>

//         {/* EMPTY */}
//         {filteredCars.length === 0 && (
//           <div className="text-center mt-20 text-white/30">
//             NO CARS FOUND
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

/* ================= SAFE JSON ================= */
const safeJSON = (value: any) => {
  try {
    if (!value || value === "undefined" || value === "null") return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export default function Market() {
  const [cars, setCars] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [onlyPremium, setOnlyPremium] = useState(false);

  const navigate = useNavigate();

  // ✅ SAFE LOCAL STORAGE
  const userLocal = safeJSON(localStorage.getItem("user"));

  useEffect(() => {
    loadCars();
    if (userLocal?.id) loadUser();
  }, []);

  /* ================= SAFE FETCH ================= */
  const safeFetchJSON = async (url: string) => {
    try {
      const res = await fetch(url);
      const text = await res.text();

      if (!text || text === "undefined") return null;

      return JSON.parse(text);
    } catch (e) {
      console.error("❌ Server returned non-JSON:", e);
      return null;
    }
  };

  /* ================= LOAD ================= */
  const loadCars = async () => {
    const data = await safeFetchJSON(`${API}/cars`);
    setCars(Array.isArray(data) ? data : []);
  };

  const loadUser = async () => {
    try {
      const data = await safeFetchJSON(`${API}/profile/${userLocal.id}`);
      if (data) setUser(data);
    } catch (err) {
      console.error("Profile error:", err);
    }
  };

  /* ================= SAFE DISCOUNT ================= */
  const parseSafe = (val: any) => {
    try {
      if (!val || val === "undefined") return [];
      return typeof val === "string" ? JSON.parse(val) : val;
    } catch {
      return [];
    }
  };

  const isDiscountCar = (car: any) => {
    if (!user?.discount) return false;

    const allowed = parseSafe(user.discount_cars);
    return Array.isArray(allowed) && allowed.includes(car.id);
  };

  const getDiscountPercent = (car: any) => {
    if (!user?.discount) return 0;

    const allowed = parseSafe(user.discount_cars);
    return allowed.includes(car.id) ? user.discount : 0;
  };

  const getPrice = (car: any) => {
    if (isDiscountCar(car)) {
      return Math.floor(car.price - (car.price * user.discount) / 100);
    }
    return car.price;
  };

  /* ================= FILTER ================= */
  const filteredCars = cars.filter((car) => {
    const matchSearch =
      car.name?.toLowerCase().includes(search.toLowerCase()) ||
      car.brand?.toLowerCase().includes(search.toLowerCase());

    const matchPremium = onlyPremium ? car.premium : true;

    return matchSearch && matchPremium;
  });

  return (
    <div className="min-h-screen bg-[#050608] text-white relative">

      {/* NAVBAR */}
      <div className="sticky top-0 z-[100] bg-[#050608]/80 backdrop-blur-xl border-b border-white/5">
        <Navbar />
      </div>

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1d26_0%,#050608_100%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto p-4 lg:p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/10">

          <h1 className="text-4xl font-black italic uppercase">
            AUTO <span className="text-yellow-500">MARKET</span>
          </h1>

          <div className="flex gap-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH..."
              className="px-6 py-3 bg-black/40 border border-white/10 rounded-xl"
            />

            <button
              onClick={() => setOnlyPremium(!onlyPremium)}
              className={`px-6 py-3 rounded-xl font-black ${
                onlyPremium ? "bg-yellow-500 text-black" : "bg-white/10"
              }`}
            >
              PREMIUM
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {filteredCars.map((car) => {
            const discounted = isDiscountCar(car);
            const discountPercent = getDiscountPercent(car);
            const price = getPrice(car);

            return (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="relative cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500 transition"
              >

                {/* DISCOUNT */}
                {discounted && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg z-10">
                    -{discountPercent}%
                  </div>
                )}

                {/* IMAGE */}
                <div className="h-40 flex items-center justify-center">
                  <img
                    src={car.image_url}
                    className="h-full object-contain"
                    alt=""
                  />
                </div>

                {/* INFO */}
                <div className="p-4">
                  <h2 className="font-bold">{car.name}</h2>
                  <p className="text-white/40 text-sm">{car.brand}</p>

                  <div className="flex justify-between mt-3">
                    <div>
                      {discounted && (
                        <p className="line-through text-xs text-white/30">
                          ${car.price}
                        </p>
                      )}

                      <p className="text-yellow-400 font-bold">
                        ${price}
                      </p>
                    </div>

                    {car.premium && <span>👑</span>}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* EMPTY */}
        {filteredCars.length === 0 && (
          <div className="text-center mt-20 text-white/30">
            NO CARS FOUND
          </div>
        )}

      </div>
    </div>
  );
}