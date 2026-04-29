
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API = "https://cpmmarker.onrender.com";

// /* ================= TYPES ================= */
// type Car = {
//   id: number;
//   name: string;
//   brand: string;
//   price: number;
//   image_url: string;
//   type: "default" | "premium" | "coin";
// };

// type User = {
//   discount?: number;
//   promo_cars?: string | number[] | null;
// };

// /* ================= FETCH ================= */
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

//     return await res.json();
//   } catch {
//     return null;
//   }
// };

// /* ================= PARSER ================= */
// const parseDiscountCars = (input: any): number[] => {
//   if (!input) return [];

//   if (Array.isArray(input)) {
//     return input.map(Number).filter(Boolean);
//   }

//   if (typeof input === "string") {
//     return input.split(",").map(Number).filter(Boolean);
//   }

//   return [];
// };

// /* ================= NEW FIX FUNCTION ================= */
// const isAllowedFixed = (
//   carId: number,
//   discount: number,
//   discountCars: number[]
// ) => {
//   if (!discount) return false;

//   // если список пустой → скидка на ВСЕ машины
//   if (discountCars.length === 0) return true;

//   return discountCars.includes(Number(carId));
// };

// export default function MarketPage() {
//   const [cars, setCars] = useState<Car[]>([]);
//   const [user, setUser] = useState<User | null>(null);

//   const [search, setSearch] = useState("");
//   const [filterType, setFilterType] = useState<"all" | "premium" | "coin">("all");

//   const navigate = useNavigate();

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     const load = async () => {
//       const [carsData, userData] = await Promise.all([
//         safeFetch(`${API}/market/cars`),
//         safeFetch(`${API}/profile/me`),
//       ]);

//       setCars(Array.isArray(carsData) ? carsData : []);
//       setUser(userData || null);
//     };

//     load();
//   }, []);

//   /* ================= DISCOUNT ================= */
//   const discount = Number(user?.discount) || 0;
//   const discountCars = parseDiscountCars(user?.promo_cars);

//   /* 🔥 FIXED WRAPPER */
//   const isAllowed = (carId: number) =>
//     isAllowedFixed(carId, discount, discountCars);

//   const getPrice = (car: Car) => {
//     const base = Number(car.price);

//     if (!discount || !isAllowed(car.id)) {
//       return { old: null, new: base };
//     }

//     const newPrice = Math.floor(
//       base - (base * discount) / 100
//     );

//     return {
//       old: base,
//       new: newPrice,
//     };
//   };

//   /* ================= FILTER ================= */
//   const filteredCars = cars.filter((car) => {
//     const q = search.toLowerCase();

//     const matchesSearch =
//       car.name.toLowerCase().includes(q) ||
//       car.brand.toLowerCase().includes(q);

//     const matchesType =
//       filterType === "all" || car.type === filterType;

//     return matchesSearch && matchesType;
//   });

//   return (
//     <div className="min-h-screen bg-[#050608] text-white p-6">

//       {/* HEADER */}
//       <div className="flex flex-col gap-4 mb-10">
//         <h1 className="text-4xl font-bold">
//           AUTO <span className="text-yellow-400">MARKET</span>
//         </h1>

//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search car..."
//           className="px-3 py-2 bg-black/40 border rounded"
//         />

//         <div className="flex gap-2">
//           {["all", "premium", "coin"].map((t: any) => (
//             <button
//               key={t}
//               onClick={() => setFilterType(t)}
//               className={`px-3 py-2 rounded ${
//                 filterType === t
//                   ? "bg-yellow-400 text-black"
//                   : "bg-black/40"
//               }`}
//             >
//               {t.toUpperCase()}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* CARS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {filteredCars.map((car) => {
//           const price = getPrice(car);

//           return (
//             <div
//               key={car.id}
//               onClick={() => navigate(`/car/${car.id}`)}
//               className="bg-[#111] p-4 rounded cursor-pointer hover:scale-105 transition"
//             >
//               <img
//                 src={car.image_url}
//                 className="h-40 w-full object-contain"
//               />

//               <h2 className="mt-2 font-bold">
//                 {car.brand} {car.name}
//               </h2>

//               {car.type === "premium" && (
//                 <div className="text-yellow-400 text-xs mt-1">
//                   ⭐ PREMIUM
//                 </div>
//               )}

//               {car.type === "coin" && (
//                 <div className="text-blue-400 text-xs">
//                   🪙 COIN
//                 </div>
//               )}

//               <div className="mt-2">
//                 {price.old && (
//                   <span className="line-through text-gray-400">
//                     ${price.old}
//                   </span>
//                 )}

//                 <span className="text-green-400 ml-2">
//                   ${price.new}
//                 </span>
//               </div>

//               {discount > 0 && isAllowed(car.id) && (
//                 <div className="text-yellow-400 text-xs mt-1">
//                   🔥 -{discount}%
//                 </div>
//               )}
//             </div>
//           );
//         })}
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
  type: "default" | "premium" | "coin";
};

type User = {
  discount?: number;
  discount_cars?: string | number[] | null;
};

/* ================= FETCH ================= */
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

    return await res.json();
  } catch (e) {
    console.log("FETCH ERROR:", e);
    return null;
  }
};

/* ================= PARSER ================= */
const parseDiscountCars = (input: any): number[] => {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map(Number).filter(Boolean);
  }

  if (typeof input === "string") {
    return input
      .split(",")
      .map(Number)
      .filter(Boolean);
  }

  return [];
};

/* ================= CHECK ALLOWED ================= */
const isAllowedFixed = (
  carId: number,
  discount: number,
  discountCars: number[]
) => {
  if (!discount) return false;

  // пустой список = скидка на все машины
  if (discountCars.length === 0) return true;

  return discountCars.includes(Number(carId));
};

export default function MarketPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "premium" | "coin">(
    "all"
  );

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

  /* ================= DISCOUNT ================= */
  const discount = Number(user?.discount) || 0;

  // 🔥 FIXED FIELD
  const discountCars = parseDiscountCars(user?.discount_cars);

  const isAllowed = (carId: number) =>
    isAllowedFixed(carId, discount, discountCars);

  const getPrice = (car: Car) => {
    const base = Number(car.price);

    if (!discount || !isAllowed(car.id)) {
      return {
        old: null,
        new: base,
      };
    }

    const newPrice = Math.floor(base - (base * discount) / 100);

    return {
      old: base,
      new: newPrice,
    };
  };

  /* ================= FILTER ================= */
  const filteredCars = cars.filter((car) => {
    const q = search.toLowerCase();

    const matchesSearch =
      car.name.toLowerCase().includes(q) ||
      car.brand.toLowerCase().includes(q);

    const matchesType =
      filterType === "all" || car.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#050608] text-white p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-10">
        <h1 className="text-4xl font-bold">
          AUTO <span className="text-yellow-400">MARKET</span>
        </h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search car..."
          className="px-3 py-2 bg-black/40 border border-white/10 rounded outline-none"
        />

        <div className="flex gap-2">
          {["all", "premium", "coin"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t as "all" | "premium" | "coin")}
              className={`px-3 py-2 rounded transition ${
                filterType === t
                  ? "bg-yellow-400 text-black"
                  : "bg-black/40 hover:bg-black/60"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCars.map((car) => {
          const price = getPrice(car);
          const hasPromo = discount > 0 && isAllowed(car.id);

          return (
            <div
              key={car.id}
              onClick={() => navigate(`/car/${car.id}`)}
              className="bg-[#111] p-4 rounded cursor-pointer hover:scale-105 transition"
            >
              <img
                src={car.image_url}
                alt={`${car.brand} ${car.name}`}
                className="h-40 w-full object-contain"
              />

              <h2 className="mt-2 font-bold text-lg">
                {car.brand} {car.name}
              </h2>

              {car.type === "premium" && (
                <div className="text-yellow-400 text-xs mt-1">
                  ⭐ PREMIUM
                </div>
              )}

              {car.type === "coin" && (
                <div className="text-blue-400 text-xs mt-1">
                  🪙 COIN
                </div>
              )}

              <div className="mt-3">
                {price.old && (
                  <span className="line-through text-gray-400 mr-2">
                    ${price.old}
                  </span>
                )}

                <span className="text-green-400 font-bold">
                  ${price.new}
                </span>
              </div>

              {hasPromo && (
                <div className="text-yellow-400 text-xs mt-2">
                  🔥 -{discount}% PROMO
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}