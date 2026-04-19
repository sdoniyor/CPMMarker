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
};

type Promo = {
  discount: number;
  car_ids: number[]; // ВСЕГДА массив
};

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
  } catch (e) {
    console.log("FETCH ERROR:", e);
    return null;
  }
};

export default function MarketPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [promo, setPromo] = useState<Promo | null>(null);

  const [promoCode, setPromoCode] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      const [carsData, userData] = await Promise.all([
        safeFetch(`${API}/market/cars`),
        safeFetch(`${API}/profile/me`),
      ]);

      setCars(Array.isArray(carsData) ? carsData : []);
      setUser(userData || null);
    };

    load();
  }, []);

  /* ================= APPLY PROMO ================= */
  const applyPromo = async () => {
    console.log("🔥 APPLY PROMO CLICKED");

    const data = await safeFetch(`${API}/promo/redeem`, {
      method: "POST",
      body: JSON.stringify({ code: promoCode }),
    });

    console.log("🔥 PROMO RESPONSE:", data);

    if (!data?.success) {
      alert(data?.error || "Promo error");
      return;
    }

    // 🔥 FIX: всегда нормализуем car_ids в массив
    const ids: number[] = Array.isArray(data.car_ids)
      ? data.car_ids.map(Number)
      : typeof data.car_ids === "string"
      ? data.car_ids.split(",").map((x: string) => Number(x.trim()))
      : [];

    setPromo({
      discount: Number(data.discount) || 0,
      car_ids: ids,
    });

    setPromoCode("");
  };

  /* ================= CHECK PROMO ================= */
  const hasPromoAccess = (car: Car) => {
    if (!promo) return false;
    return promo.car_ids.includes(car.id);
  };

  /* ================= PRICE ================= */
  const getPrice = (car: Car) => {
    const base = Number(car.price) || 0;

    if (!promo) return { old: null, new: base };

    if (!hasPromoAccess(car)) return { old: null, new: base };

    const discount = Number(promo.discount) || 0;

    const newPrice = Math.floor(base - (base * discount) / 100);

    return {
      old: base,
      new: newPrice,
    };
  };

  /* ================= FILTER ================= */
  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase()) ||
    car.brand.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050608] text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex justify-between mb-10">
          <h1 className="text-4xl font-black">
            AUTO <span className="text-yellow-400">MARKET</span>
          </h1>

          <div className="flex gap-2">
            <input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo code"
              className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
            />

            <button
              onClick={applyPromo}
              className="bg-yellow-400 text-black px-4 rounded-xl font-bold"
            >
              Apply
            </button>
          </div>
        </div>

        {/* CARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCars.map((car) => {
            const price = getPrice(car);

            return (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="bg-[#0c0c0c] p-4 rounded-2xl cursor-pointer border hover:border-yellow-400"
              >
                <img
                  src={car.image_url}
                  className="h-40 w-full object-contain"
                />

                <h2 className="text-xl font-bold mt-2">
                  {car.brand} {car.name}
                </h2>

                <div className="mt-2 flex gap-2">
                  {price.old && (
                    <span className="line-through text-white/40">
                      ${price.old}
                    </span>
                  )}

                  <span className="text-green-400 font-bold">
                    ${price.new}
                  </span>
                </div>

                {promo && hasPromoAccess(car) && (
                  <div className="text-yellow-400 text-xs mt-1">
                    🔥 Promo -{promo.discount}%
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}