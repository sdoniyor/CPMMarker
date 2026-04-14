
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// const safeJSON = (value: any) => {
//   try {
//     if (!value || value === "undefined" || value === "null") return null;
//     return JSON.parse(value);
//   } catch {
//     return null;
//   }
// };

// export default function Market() {
//   const [cars, setCars] = useState<any[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [search, setSearch] = useState("");
//   const [onlyPremium, setOnlyPremium] = useState(false);
//   const navigate = useNavigate();

//   const userLocal = safeJSON(localStorage.getItem("user"));

//   useEffect(() => {
//     loadCars();
//     if (userLocal?.id) loadUser();
//   }, []);

//   const safeFetchJSON = async (url: string) => {
//     try {
//       const res = await fetch(url);
//       const text = await res.text();
//       if (!text || text === "undefined") return null;
//       return JSON.parse(text);
//     } catch (e) {
//       console.error("❌ Fetch Error:", e);
//       return null;
//     }
//   };

//   const loadCars = async () => {
//     const data = await safeFetchJSON(`${API}/cars`);
//     setCars(Array.isArray(data) ? data : []);
//   };

//   const loadUser = async () => {
//     const data = await safeFetchJSON(`${API}/profile/${userLocal.id}`);
//     if (data) setUser(data);
//   };

//   const parseSafe = (val: any) => {
//     try {
//       if (!val || val === "undefined") return [];
//       return typeof val === "string" ? JSON.parse(val) : val;
//     } catch { return []; }
//   };

//   const isDiscountCar = (car: any) => {
//     if (!user?.discount) return false;
//     const allowed = parseSafe(user.discount_cars);
//     return Array.isArray(allowed) && allowed.includes(car.id);
//   };

//   const getPrice = (car: any) => {
//     if (isDiscountCar(car)) {
//       return Math.floor(car.price - (car.price * user.discount) / 100);
//     }
//     return car.price;
//   };

//   const filteredCars = cars.filter((car) => {
//     const matchSearch = car.name?.toLowerCase().includes(search.toLowerCase()) ||
//                         car.brand?.toLowerCase().includes(search.toLowerCase());
//     return onlyPremium ? (matchSearch && car.premium) : matchSearch;
//   });

//   return (
//     <div className="min-h-screen bg-[#050608] text-white selection:bg-yellow-500/30">
//       {/* ПЛАВАЮЩИЙ ГРАДИЕНТ НА ФОНЕ */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-[120px]" />
//         <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
//       </div>

//       <Navbar />

//       <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-10">
        
//         {/* HEADER & FILTERS */}
//         <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center gap-6 mb-12">
//           <div>
//             <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
//               AUTO <span className="text-yellow-400">MARKET</span>
//             </h1>
//             <p className="text-white/30 font-bold mt-2 tracking-widest uppercase text-sm">
//               Exclusive vehicles for top players
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
//             <div className="relative flex-1 lg:w-80 group">
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Find your beast..."
//                 className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-yellow-400/50 outline-none transition-all placeholder:text-white/20 font-medium"
//               />
//               <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-yellow-400 transition-colors">
//                 🔍
//               </div>
//             </div>

//             <button
//               onClick={() => setOnlyPremium(!onlyPremium)}
//               className={`px-8 py-4 rounded-2xl font-black transition-all active:scale-95 flex items-center gap-2 border ${
//                 onlyPremium 
//                 ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]" 
//                 : "bg-white/5 text-white border-white/10 hover:bg-white/10"
//               }`}
//             >
//               <span>👑</span> PREMIUM
//             </button>
//           </div>
//         </div>

//         {/* CAR GRID */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {filteredCars.map((car) => {
//             const hasDiscount = isDiscountCar(car);
//             const finalPrice = getPrice(car);

//             return (
//               <div
//                 key={car.id}
//                 onClick={() => navigate(`/car/${car.id}`)}
//                 className="group relative bg-[#0d0e12] border border-white/5 rounded-[2rem] overflow-hidden hover:border-yellow-400/50 hover:-translate-y-2 transition-all duration-500 shadow-2xl"
//               >
//                 {/* BADGES */}
//                 <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
//                   {hasDiscount && (
//                     <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
//                       -{user.discount}% OFF
//                     </span>
//                   )}
//                   {car.premium && (
//                     <span className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
//                       Premium
//                     </span>
//                   )}
//                 </div>

//                 {/* IMAGE CONTAINER */}
//                 <div className="relative h-56 flex items-center justify-center p-6 bg-gradient-to-b from-white/[0.02] to-transparent">
//                   <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/5 transition-colors duration-500" />
//                   <img
//                     src={car.image_url}
//                     className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
//                     alt={car.name}
//                   />
//                 </div>

//                 {/* INFO */}
//                 <div className="p-8 pt-2">
//                   <p className="text-yellow-400/50 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
//                     {car.brand || "Concept"}
//                   </p>
//                   <h2 className="text-2xl font-black truncate leading-tight group-hover:text-yellow-400 transition-colors">
//                     {car.name}
//                   </h2>
                  
//                   <div className="flex items-end justify-between mt-6">
//                     <div className="flex flex-col">
//                       {hasDiscount && (
//                         <span className="text-white/20 line-through text-sm font-bold">
//                           ${car.price.toLocaleString()}
//                         </span>
//                       )}
//                       <span className="text-3xl font-black text-white tracking-tighter">
//                         ${finalPrice.toLocaleString()}
//                       </span>
//                     </div>
                    
//                     <div className="w-12 h-12 bg-white/5 group-hover:bg-yellow-400 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-[360deg] duration-700">
//                       <span className="group-hover:hidden text-white/20">→</span>
//                       <span className="hidden group-hover:block text-black font-bold">🛒</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* EMPTY STATE */}
//         {filteredCars.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[3rem]">
//             <span className="text-6xl mb-4 opacity-20">🚗💨</span>
//             <h3 className="text-2xl font-black text-white/20 uppercase tracking-widest">
//               No matching cars found
//             </h3>
//             <button 
//               onClick={() => {setSearch(""); setOnlyPremium(false);}}
//               className="mt-6 text-yellow-400 font-bold hover:underline"
//             >
//               Reset filters
//             </button>
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

/* ================= SAFE USER ================= */
const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") return null;

    const parsed = JSON.parse(raw);

    // 🔥 ВАЖНО: у тебя user лежит как { user, token }
    return parsed.user || parsed;
  } catch {
    return null;
  }
};

/* ================= SAFE FETCH ================= */
const safeFetch = async (url: string) => {
  try {
    const res = await fetch(url);
    const text = await res.text();

    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      console.log("❌ NOT JSON:", text);
      return null;
    }
  } catch (e) {
    console.log("❌ FETCH ERROR:", e);
    return null;
  }
};

export default function Market() {
  const [cars, setCars] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [onlyPremium, setOnlyPremium] = useState(false);

  const navigate = useNavigate();

  const localUser = getUser();

  /* ================= LOAD ================= */
  useEffect(() => {
    loadCars();

    if (localUser?.id) {
      loadUser(localUser.id);
    }
  }, []);

  const loadCars = async () => {
    const data = await safeFetch(`${API}/cars`);
    setCars(Array.isArray(data) ? data : []);
  };

  const loadUser = async (id: number) => {
    const data = await safeFetch(`${API}/profile/${id}`);
    if (data) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  /* ================= HELPERS ================= */
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

  const getPrice = (car: any) => {
    if (isDiscountCar(car)) {
      return Math.floor(
        car.price - (car.price * user.discount) / 100
      );
    }
    return car.price;
  };

  /* ================= FILTER ================= */
  const filteredCars = cars.filter((car) => {
    const matchSearch =
      car.name?.toLowerCase().includes(search.toLowerCase()) ||
      car.brand?.toLowerCase().includes(search.toLowerCase());

    return onlyPremium
      ? matchSearch && car.premium
      : matchSearch;
  });

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050608] text-white">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">

          <div>
            <h1 className="text-5xl font-black">
              AUTO <span className="text-yellow-400">MARKET</span>
            </h1>
            <p className="text-white/40 text-sm">
              Choose your car
            </p>
          </div>

          <div className="flex gap-4">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
            />

            <button
              onClick={() => setOnlyPremium(!onlyPremium)}
              className={`px-4 py-2 rounded-xl ${
                onlyPremium
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10"
              }`}
            >
              👑 Premium
            </button>
          </div>
        </div>

        {/* CARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCars.map((car) => {
            const hasDiscount = isDiscountCar(car);
            const finalPrice = getPrice(car);

            return (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="bg-[#0c0c0c] p-4 rounded-2xl cursor-pointer hover:border-yellow-400 border border-transparent"
              >
                <img
                  src={car.image_url}
                  className="w-full h-40 object-contain"
                />

                <h2 className="text-xl font-bold mt-2">
                  {car.brand} {car.name}
                </h2>

                {/* PRICE */}
                <div className="mt-2">
                  {hasDiscount && (
                    <div className="text-red-400 line-through text-sm">
                      ${car.price}
                    </div>
                  )}

                  <div className="text-green-400 font-bold text-lg">
                    ${finalPrice}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY */}
        {filteredCars.length === 0 && (
          <div className="text-center mt-20 text-white/30">
            No cars found
          </div>
        )}
      </div>
    </div>
  );
}