
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
// };

// type Promo = {
//   discount: number;
//   car_ids: string | number[] | null;
// };

// type User = {
//   active_promo?: Promo | null;
// };

// /* ================= PARSER ================= */
// const parseCarIds = (input: any): number[] => {
//   if (!input) return [];
//   if (Array.isArray(input)) return input.map(Number);

//   return String(input)
//     .split(",")
//     .map(Number)
//     .filter(Boolean);
// };

// /* ================= CHECK ================= */
// const canUsePromo = (carId: number, promo?: Promo | null) => {
//   if (!promo) return false;

//   const discount = Number(promo.discount);
//   if (!discount) return false;

//   const cars = parseCarIds(promo.car_ids);

//   if (cars.length === 0) return true;

//   return cars.includes(carId);
// };

// export default function Market() {
//   const [cars, setCars] = useState<Car[]>([]);
//   const [user, setUser] = useState<User | null>(null);

//   const nav = useNavigate();

//   useEffect(() => {
//     const load = async () => {
//       const carsRes = await fetch(`${API}/market/cars`);
//       const userRes = await fetch(`${API}/profile/me`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       setCars(await carsRes.json());
//       setUser(await userRes.json());
//     };

//     load();
//   }, []);

//   const promo = user?.active_promo;

//   return (
//     <div className="p-6 text-white bg-black min-h-screen">
//       <div className="grid grid-cols-3 gap-4">
//         {cars.map((car) => {
//           const base = car.price;
//           const active = canUsePromo(car.id, promo);

//           const discount = Number(promo?.discount || 0);

//           const price = active
//             ? Math.floor(base - (base * discount) / 100)
//             : base;

//           return (
//             <div
//               key={car.id}
//               onClick={() => nav(`/car/${car.id}`)}
//               className="bg-[#111] p-4 rounded cursor-pointer"
//             >
//               <img src={car.image_url} />

//               <div>{car.brand} {car.name}</div>

//               <div>
//                 {active && (
//                   <span className="line-through text-gray-400 mr-2">
//                     ${base}
//                   </span>
//                 )}

//                 <span className="text-green-400">${price}</span>
//               </div>

//               {active && (
//                 <div className="text-yellow-400 text-sm">
//                   🔥 PROMO ACTIVE
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
  type: "premium" | "coin" | "default";
};

type Promo = {
  discount: number;
  rules?: {
    discount?: number;
    allowed_types?: string[];
  };
};

type User = {
  active_promo?: Promo | null;
};

/* ================= PARSER ================= */
const canUsePromo = (car: Car, promo?: Promo | null) => {
  if (!promo) return false;

  const rules = promo.rules;
  if (!rules?.discount) return false;

  if (!rules.allowed_types || rules.allowed_types.length === 0) {
    return true;
  }

  return rules.allowed_types.includes(car.type);
};

export default function Market() {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const nav = useNavigate();

  useEffect(() => {
    const load = async () => {
      const carsRes = await fetch(`${API}/market/cars`);
      const userRes = await fetch(`${API}/profile/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCars(await carsRes.json());
      setUser(await userRes.json());
    };

    load();
  }, []);

  const promo = user?.active_promo;

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <div className="grid grid-cols-3 gap-4">

        {cars.map((car) => {
          const active = canUsePromo(car, promo);

          const discount = promo?.rules?.discount || 0;

          const price = active
            ? Math.floor(car.price - (car.price * discount) / 100)
            : car.price;

          return (
            <div
              key={car.id}
              onClick={() => nav(`/car/${car.id}`)}
              className="bg-[#111] p-4 rounded cursor-pointer"
            >
              <img src={car.image_url} />

              <div>{car.brand} {car.name}</div>

              <div>
                {active && (
                  <span className="line-through text-gray-400 mr-2">
                    ${car.price}
                  </span>
                )}

                <span className="text-green-400">${price}</span>
              </div>

              <div className="text-xs text-gray-400">
                Type: {car.type}
              </div>

              {active && (
                <div className="text-yellow-400 text-sm">
                  🔥 PROMO ACTIVE
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}