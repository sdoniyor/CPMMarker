// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API = "https://cpmmarker.onrender.com";

// /* ================= SAFE FETCH ================= */
// const safeFetch = async (url: string, options: any = {}) => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await fetch(url, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//     });

//     const text = await res.text();
//     if (!text || text.startsWith("<!DOCTYPE")) return null;

//     return JSON.parse(text);
//   } catch {
//     return null;
//   }
// };

// type Car = {
//   id: number;
//   name: string;
//   brand: string;
//   price: number;
//   image_url: string;
//   premium?: boolean;
// };

// type User = {
//   id: number;
//   discount?: number;
//   promo_car_ids?: string | number[] | null;
// };

// export default function Market() {
//   const [cars, setCars] = useState<Car[]>([]);
//   const [user, setUser] = useState<User | null>(null);
//   const [search, setSearch] = useState("");
//   const [onlyPremium, setOnlyPremium] = useState(false);

//   const navigate = useNavigate();

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     const load = async () => {
//       const [carsData, userData] = await Promise.all([
//         safeFetch(`${API}/market/cars`),
//         safeFetch(`${API}/profile/me`),
//       ]);
//       console.log("Данные пользователя из API:", userData);
//       setCars(Array.isArray(carsData) ? carsData : []);
//       setUser(userData || null);
//     };

//     load();
//   }, []);

//   /* ================= PROMO CHECK ================= */
//   const hasPromoAccess = (car: Car) => {
//     if (!user?.promo_car_ids) return false;

//     let ids: number[] = [];

//     try {
//       if (typeof user.promo_car_ids === "string") {
//         ids = user.promo_car_ids.split(",").map(Number);
//       } else if (Array.isArray(user.promo_car_ids)) {
//         ids = user.promo_car_ids.map(Number);
//       }
//     } catch {
//       return false;
//     }

//     return ids.includes(car.id);
//   };

// /* ================= PRICE ================= */
// const getPrice = (car: Car) => {
//   const base = Number(car.price) || 0;
//   const discount = Number(user?.discount) || 0;

//   // 1. Если скидки у пользователя нет в принципе, возвращаем базу
//   // 2. ВАЖНО: Проверяем, входит ли эта конкретная машина в список разрешенных
//   if (discount <= 0 || !hasPromoAccess(car)) {
//     return { old: null, new: base };
//   }

//   // Считаем новую цену только если проверка выше пройдена
//   const newPrice = Math.floor(base - (base * discount) / 100);

//   return {
//     old: base,
//     new: newPrice,
//   };
// };

//   /* ================= FILTER ================= */
//   const filteredCars = (cars || [])
//     .filter((car) => {
//       const s = search.toLowerCase();
//       return (
//         car?.name?.toLowerCase().includes(s) ||
//         car?.brand?.toLowerCase().includes(s)
//       );
//     })
//     .filter((car) => (onlyPremium ? car?.premium : true));

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-[#050608] text-white">
//       <div className="max-w-[1400px] mx-auto px-6 py-10">

//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-10">
//           <div>
//             <h1 className="text-5xl font-black">
//               AUTO <span className="text-yellow-400">MARKET</span>
//             </h1>
//             <p className="text-white/40 text-sm">Choose your car</p>
//           </div>

//           <div className="flex gap-3">
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
//             />

//             <button
//               onClick={() => setOnlyPremium(!onlyPremium)}
//               className={`px-4 py-2 rounded-xl ${
//                 onlyPremium ? "bg-yellow-400 text-black" : "bg-white/10"
//               }`}
//             >
//               👑 Premium
//             </button>
//           </div>
//         </div>

//         {/* CARS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {filteredCars.map((car) => {
//             const price = getPrice(car);

//             return (
//               <div
//                 key={car.id}
//                 onClick={() => navigate(`/car/${car.id}`)}
//                 className="bg-[#0c0c0c] p-4 rounded-2xl cursor-pointer border border-transparent hover:border-yellow-400 transition"
//               >
//                 <img
//                   src={car.image_url}
//                   className="w-full h-40 object-contain"
//                 />

//                 <h2 className="text-xl font-bold mt-2">
//                   {car.brand} {car.name}
//                 </h2>

//                 {/* PRICE */}
//                 <div className="mt-2 flex items-center gap-2">
//                   {price.old && (
//                     <span className="text-white/40 line-through">
//                       ${price.old}
//                     </span>
//                   )}

//                   <span className="text-green-400 font-bold text-lg">
//                     ${price.new}
//                   </span>
//                 </div>

//                 {/* BADGE */}
//                 {hasPromoAccess(car) && (user?.discount || 0) > 0 && (
//                   <div className="mt-2 text-xs text-yellow-400">
//                     🔥 Promo active -{user?.discount}%
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* EMPTY */}
//         {filteredCars.length === 0 && (
//           <div className="text-center mt-20 text-white/30">
//             No cars found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cpmmarker.onrender.com";

/* ================= SAFE FETCH ================= */
const safeFetch = async (url: string, options: any = {}) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const text = await res.text();
    if (!text || text.startsWith("<!DOCTYPE")) return null;

    return JSON.parse(text);
  } catch {
    return null;
  }
};

/* ================= TYPES ================= */
type Car = {
  id: number;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  premium?: boolean;
};

type User = {
  id: number;
  discount?: number;
  // Проверяем оба варианта названия поля из БД
  discount_cars?: string | number[] | null;
  promo_car_ids?: string | number[] | null;
};

export default function Market() {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [onlyPremium, setOnlyPremium] = useState(false);

  const navigate = useNavigate();

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      const [carsData, userData] = await Promise.all([
        safeFetch(`${API}/market/cars`),
        safeFetch(`${API}/profile/me`),
      ]);
      
      console.log("Данные юзера из БД:", userData); // ПРОВЕРЬ НАЗВАНИЕ ПОЛЯ ТУТ
      setCars(Array.isArray(carsData) ? carsData : []);
      setUser(userData || null);
    };

    load();
  }, []);

  /* ================= PROMO CHECK ================= */
  const hasPromoAccess = (car: Car) => {
    if (!user) return false;

    // Пытаемся достать данные из любого возможного поля
    const rawData = user.discount_cars || user.promo_car_ids;
    
    if (!rawData) return false;

    let allowedIds: number[] = [];

    try {
      if (typeof rawData === "string") {
        allowedIds = rawData.split(",").map(id => Number(id.trim())).filter(id => !isNaN(id));
      } else if (Array.isArray(rawData)) {
        allowedIds = rawData.map(Number);
      }
    } catch (err) {
      return false;
    }

    const isAllowed = allowedIds.includes(Number(car.id));
    
    // Этот лог покажет в консоли, почему скидка не сработала
    if (search === "" && car.id === cars[0]?.id) {
        console.log(`Проверка: ID авто ${car.id}, Список разрешенных:`, allowedIds, "Итог:", isAllowed);
    }

    return isAllowed;
  };

  /* ================= PRICE CALCULATION ================= */
  const getPrice = (car: Car) => {
    const base = Number(car.price) || 0;
    const discount = Number(user?.discount) || 0;

    // Скидка только если она есть в профиле И машина в списке
    if (discount <= 0 || !hasPromoAccess(car)) {
      return { old: null, new: base };
    }

    const newPrice = Math.floor(base - (base * discount) / 100);

    return {
      old: base,
      new: newPrice,
    };
  };

  /* ================= FILTERING ================= */
  const filteredCars = (cars || [])
    .filter((car) => {
      const s = search.toLowerCase();
      return (
        car?.name?.toLowerCase().includes(s) ||
        car?.brand?.toLowerCase().includes(s)
      );
    })
    .filter((car) => (onlyPremium ? car?.premium : true));

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050608] text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase">
              AUTO <span className="text-yellow-400">MARKET</span>
            </h1>
            <p className="text-white/30 text-xs font-bold tracking-[0.3em] uppercase mt-2">Exclusive CPM Vehicles</p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Марка или модель..."
              className="flex-1 md:w-80 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-yellow-400 outline-none transition-all font-bold text-sm"
            />
            <button
              onClick={() => setOnlyPremium(!onlyPremium)}
              className={`px-8 py-4 rounded-2xl font-black transition-all text-sm ${
                onlyPremium ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              👑 PREMIUM
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCars.map((car) => {
            const price = getPrice(car);
            const isPromo = hasPromoAccess(car) && (user?.discount || 0) > 0;

            return (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="group bg-[#0a0b0d] p-6 rounded-[2.5rem] cursor-pointer border border-white/5 hover:border-yellow-400/40 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
              >
                <div className="relative rounded-[2rem] bg-[#111215] p-6 mb-6 overflow-hidden">
                  <img
                    src={car.image_url}
                    alt={car.name}
                    className="w-full h-40 object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                  {car.premium && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded-lg uppercase shadow-lg">
                      Premium
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-yellow-400 text-[10px] font-black tracking-widest uppercase opacity-80">{car.brand}</p>
                  <h2 className="text-2xl font-black uppercase tracking-tighter truncate">{car.name}</h2>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    {price.old && (
                      <span className="text-white/20 line-through text-[11px] font-black mb-1">
                        ${price.old.toLocaleString()}
                      </span>
                    )}
                    <span className={`text-3xl font-black tracking-tighter ${isPromo ? "text-green-400" : "text-white"}`}>
                      ${price.new.toLocaleString()}
                    </span>
                  </div>

                  {isPromo && (
                    <div className="flex flex-col items-end">
                       <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-lg shadow-red-500/20">
                        -{user?.discount}%
                      </span>
                    </div>
                  )}
                </div>

                {isPromo && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-[9px] text-yellow-400 font-black uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"></span>
                      Special Offer Active
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* NO RESULTS */}
        {filteredCars.length === 0 && (
          <div className="text-center py-40">
             <div className="text-white/10 text-8xl mb-4 font-black uppercase italic">Empty</div>
             <p className="text-white/30 font-bold uppercase tracking-widest">No matching vehicles found</p>
          </div>
        )}
      </div>
    </div>
  );
}