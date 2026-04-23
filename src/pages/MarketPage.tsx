
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
//   premium?: boolean;
//   coin?: boolean; // 👈 добавь в БД
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

// export default function MarketPage() {
//   const [cars, setCars] = useState<Car[]>([]);
//   const [user, setUser] = useState<User | null>(null);
//   const [promoCode, setPromoCode] = useState("");

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

//   /* ================= APPLY PROMO ================= */
//   const applyPromo = async () => {
//     const res = await fetch(`${API}/promo/redeem`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: localStorage.getItem("token") || "",
//       },
//       body: JSON.stringify({ code: promoCode }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       alert(data.error);
//       return;
//     }

//     alert("Promo activated!");

//     // 🔥 ОБНОВЛЯЕМ USER С БЭКА (ВАЖНО)
//     const updated = await safeFetch(`${API}/profile/me`);
//     setUser(updated);
//   };

//   /* ================= DISCOUNT LOGIC ================= */
//   const discountCars = parseDiscountCars(user?.promo_cars);
//   const discount = Number(user?.discount) || 0;

//   const isAllowed = (carId: number) =>
//     discountCars.length === 0 || discountCars.includes(carId);

//   /* ================= PRICE ================= */
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
//   const filteredCars = cars;

//   return (
//     <div className="min-h-screen bg-[#050608] text-white p-6">

//       {/* HEADER */}
//       <div className="flex justify-between mb-10">
//         <h1 className="text-4xl font-bold">
//           AUTO <span className="text-yellow-400">MARKET</span>
//         </h1>

//         <div className="flex gap-2">
//           <input
//             value={promoCode}
//             onChange={(e) => setPromoCode(e.target.value)}
//             placeholder="Promo code"
//             className="px-3 py-2 bg-black/40 border rounded"
//           />

//           <button
//             onClick={applyPromo}
//             className="bg-yellow-400 text-black px-4 rounded font-bold"
//           >
//             Apply
//           </button>
//         </div>
//       </div>

//       {/* CARS */}
//       <div className="grid grid-cols-3 gap-6">
//         {filteredCars.map((car) => {
//           const price = getPrice(car);

//           return (
//             <div
//               key={car.id}
//               onClick={() => navigate(`/car/${car.id}`)}
//               className="bg-[#111] p-4 rounded cursor-pointer"
//             >
//               <img
//                 src={car.image_url}
//                 className="h-40 w-full object-contain"
//               />

//               <h2 className="mt-2 font-bold">
//                 {car.brand} {car.name}
//               </h2>

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
  promo_cars?: string | number[] | null;
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
  } catch {
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
    return input.split(",").map(Number).filter(Boolean);
  }

  return [];
};

export default function MarketPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [promoCode, setPromoCode] = useState("");

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "premium" | "coin">("all");

  const navigate = useNavigate();

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      const [carsData, userData] = await Promise.all([
        safeFetch(`${API}/market/cars`),
        safeFetch(`${API}/profile/me`),
      ]);

      // ✅ FIX: гарантируем type
      const fixedCars: Car[] = Array.isArray(carsData)
        ? carsData.map((c) => ({
            ...c,
            type: c.type || "default",
          }))
        : [];

      setCars(fixedCars);
      setUser(userData || null);
    };

    load();
  }, []);

  /* ================= APPLY PROMO ================= */
  const applyPromo = async () => {
    const res = await fetch(`${API}/promo/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
      },
      body: JSON.stringify({ code: promoCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Promo activated!");

    const updated = await safeFetch(`${API}/profile/me`);
    setUser(updated);
  };

  /* ================= DISCOUNT ================= */
  const discountCars = parseDiscountCars(user?.promo_cars);
  const discount = Number(user?.discount) || 0;

  const isAllowed = (carId: number) =>
    discountCars.length === 0 || discountCars.includes(carId);

  const getPrice = (car: Car) => {
    const base = Number(car.price);

    if (!discount || !isAllowed(car.id)) {
      return { old: null, new: base };
    }

    const newPrice = Math.floor(base - (base * discount) / 100);

    return {
      old: base,
      new: newPrice,
    };
  };

  /* ================= FILTER ================= */
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(search.toLowerCase()) ||
      car.brand.toLowerCase().includes(search.toLowerCase());

    let matchesType = true;

    if (filterType !== "all") {
      matchesType = car.type === filterType;
    }

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#050608] text-white p-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-10">

        <h1 className="text-4xl font-bold">
          AUTO <span className="text-yellow-400">MARKET</span>
        </h1>

        <div className="flex flex-wrap gap-2">

          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search car..."
            className="px-3 py-2 bg-black/40 border rounded"
          />

          {/* FILTER */}
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-2 rounded ${
              filterType === "all"
                ? "bg-yellow-400 text-black"
                : "bg-black/40"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilterType("premium")}
            className={`px-3 py-2 rounded ${
              filterType === "premium"
                ? "bg-yellow-400 text-black"
                : "bg-black/40"
            }`}
          >
            Premium
          </button>

          <button
            onClick={() => setFilterType("coin")}
            className={`px-3 py-2 rounded ${
              filterType === "coin"
                ? "bg-yellow-400 text-black"
                : "bg-black/40"
            }`}
          >
            Coins
          </button>

          {/* PROMO */}
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo code"
            className="px-3 py-2 bg-black/40 border rounded"
          />

          <button
            onClick={applyPromo}
            className="bg-yellow-400 text-black px-4 rounded font-bold"
          >
            Apply
          </button>

        </div>
      </div>

      {/* CARS */}
      <div className="grid grid-cols-3 gap-6">
        {filteredCars.map((car) => {
          const price = getPrice(car);

          return (
            <div
              key={car.id}
              onClick={() => navigate(`/car/${car.id}`)}
              className="bg-[#111] p-4 rounded cursor-pointer hover:scale-105 transition"
            >
              <img
                src={car.image_url}
                className="h-40 w-full object-contain"
              />

              <h2 className="mt-2 font-bold">
                {car.brand} {car.name}
              </h2>

              {/* TAGS */}
              {car.type === "premium" && (
                <div className="text-yellow-400 text-xs mt-1">
                  ⭐ PREMIUM
                </div>
              )}

              {car.type === "coin" && (
                <div className="text-blue-400 text-xs">
                  🪙 COIN
                </div>
              )}

              {/* PRICE */}
              <div className="mt-2">
                {price.old && (
                  <span className="line-through text-gray-400">
                    ${price.old}
                  </span>
                )}

                <span className="text-green-400 ml-2">
                  ${price.new}
                </span>
              </div>

              {/* DISCOUNT */}
              {discount > 0 && isAllowed(car.id) && (
                <div className="text-yellow-400 text-xs mt-1">
                  🔥 -{discount}%
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}