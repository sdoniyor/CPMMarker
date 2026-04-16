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
    // Проверка на пустой ответ или HTML (ошибку сервера)
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
  promo_car_ids?: string | number[] | null;
};

export default function Market() {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [onlyPremium, setOnlyPremium] = useState(false);

  const navigate = useNavigate();

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      const [carsData, userData] = await Promise.all([
        safeFetch(`${API}/market/cars`),
        safeFetch(`${API}/profile/me`),
      ]);
      
      console.log("Загруженные данные пользователя:", userData);
      setCars(Array.isArray(carsData) ? carsData : []);
      setUser(userData || null);
    };

    load();
  }, []);

  /* ================= PROMO CHECK ================= */
  const hasPromoAccess = (car: Car) => {
    // Если списка машин нет в профиле, доступа нет
    if (!user || !user.promo_car_ids) return false;

    let ids: number[] = [];

    try {
      // Парсим строку (например "1,2,3") или используем массив
      if (typeof user.promo_car_ids === "string") {
        ids = user.promo_car_ids.split(",").map(val => Number(val.trim()));
      } else if (Array.isArray(user.promo_car_ids)) {
        ids = user.promo_car_ids.map(Number);
      }
    } catch (e) {
      console.error("Ошибка парсинга промо-ID:", e);
      return false;
    }

    // Возвращаем true только если ID текущей машины есть в списке
    return ids.includes(Number(car.id));
  };

  /* ================= PRICE CALCULATION ================= */
  const getPrice = (car: Car) => {
    const base = Number(car.price) || 0;
    const discount = Number(user?.discount) || 0;

    // Скидка работает ТОЛЬКО если она > 0 И машина в белом списке
    if (discount <= 0 || !hasPromoAccess(car)) {
      return { old: null, new: base };
    }

    const newPrice = Math.floor(base - (base * discount) / 100);

    return {
      old: base,
      new: newPrice,
    };
  };

  /* ================= FILTER ================= */
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              AUTO <span className="text-yellow-400">MARKET</span>
            </h1>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Car Parking Multiplayer</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brand or model..."
              className="flex-1 md:w-64 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-yellow-400 outline-none transition font-bold"
            />

            <button
              onClick={() => setOnlyPremium(!onlyPremium)}
              className={`px-6 py-3 rounded-2xl font-black transition-all ${
                onlyPremium 
                ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]" 
                : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              👑 PREMIUM
            </button>
          </div>
        </div>

        {/* CARS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCars.map((car) => {
            const price = getPrice(car);
            const isPromoActive = hasPromoAccess(car) && (user?.discount || 0) > 0;

            return (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="group bg-[#0c0c0c] p-5 rounded-[2.5rem] cursor-pointer border border-white/5 hover:border-yellow-400/50 transition-all duration-500 hover:translate-y-[-8px]"
              >
                <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-white/5 to-transparent p-6">
                  <img
                    src={car.image_url}
                    alt={car.name}
                    className="w-full h-40 object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  {car.premium && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded">PREMIUM</span>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-yellow-400 text-[10px] font-black tracking-[0.2em] uppercase">{car.brand}</p>
                  <h2 className="text-2xl font-black uppercase truncate leading-none">{car.name}</h2>
                </div>

                {/* PRICE AREA */}
                <div className="mt-5 flex items-end justify-between">
                  <div className="flex flex-col">
                    {price.old && (
                      <span className="text-white/20 line-through text-xs font-bold mb-1">
                        ${price.old.toLocaleString()}
                      </span>
                    )}
                    <span className="text-3xl font-black tracking-tighter text-white">
                      ${price.new.toLocaleString()}
                    </span>
                  </div>
                  
                  {isPromoActive && (
                    <div className="bg-red-500/10 text-red-500 text-[11px] font-black px-3 py-1.5 rounded-full border border-red-500/20">
                      -{user?.discount}%
                    </div>
                  )}
                </div>

                {/* PROMO BADGE */}
                {isPromoActive && (
                  <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-yellow-400 font-black uppercase tracking-tighter animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    Promo price active
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {filteredCars.length === 0 && (
          <div className="text-center mt-32">
            <div className="text-6xl mb-6 opacity-20">🏎️💨</div>
            <div className="text-white/20 font-black uppercase tracking-[0.3em] text-sm">No vehicles found</div>
          </div>
        )}
      </div>
    </div>
  );
}