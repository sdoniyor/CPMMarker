
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// /* ================= TYPES ================= */
// type ConfigItem = {
//   id: number;
//   name: string;
//   price: number;
// };

// type Car = {
//   id: number;
//   brand: string;
//   name: string;
//   price: number;
//   image_url: string;
// };

// type User = {
//   id: number;
//   name: string;
//   email?: string;
//   discount?: number;
//   discount_cars?: string | number[] | null;
//    promo_cars?: string | number[] | null;
//   telegram_username?: string;
//   telegram_id?: string;
// };

// export default function CarDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [car, setCar] = useState<Car | null>(null);
//   const [user, setUser] = useState<User | null>(null);

//   const [configs, setConfigs] = useState<{
//     power: ConfigItem[];
//     tuning: ConfigItem[];
//     wheels: ConfigItem[];
//   }>({
//     power: [],
//     tuning: [],
//     wheels: [],
//   });

//   const [selectedHp, setSelectedHp] = useState<ConfigItem | null>(null);
//   const [selectedTuning, setSelectedTuning] = useState<ConfigItem | null>(null);
//   const [selectedWheels, setSelectedWheels] = useState<ConfigItem | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [showPay, setShowPay] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [randomPass, setRandomPass] = useState("");

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);

//         const token = localStorage.getItem("token");

//         const [carsRes, configsRes, userRes] = await Promise.all([
//           fetch(`${API}/market/cars`),
//           fetch(`${API}/market/configs`),
//           fetch(`${API}/profile/me`, {
//             headers: {
//               Authorization: token ? `Bearer ${token}` : "",
//             },
//           }),
//         ]);

//         const carsData = await carsRes.json();
//         const configsData = await configsRes.json();
//         const userData = await userRes.json();

//         const cars: Car[] = Array.isArray(carsData) ? carsData : [];
//         const foundCar = cars.find((c) => String(c.id) === String(id));

//         setCar(foundCar || null);
//         setUser(userData || null);

//         setConfigs({
//           power: Array.isArray(configsData?.power) ? configsData.power : [],
//           tuning: Array.isArray(configsData?.tuning) ? configsData.tuning : [],
//           wheels: Array.isArray(configsData?.wheels) ? configsData.wheels : [],
//         });

//         setSelectedHp(configsData?.power?.[0] || null);
//         setSelectedTuning(configsData?.tuning?.[0] || null);
//         setSelectedWheels(configsData?.wheels?.[0] || null);
//       } catch (e) {
//         console.log("LOAD ERROR:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [id]);

//   /* ================= PARSE DISCOUNT CARS ================= */
//   const parseDiscountCars = (input: any): number[] => {
//     if (!input) return [];

//     if (typeof input === "string") {
//       return input
//         .split(",")
//         .map(Number)
//         .filter(Boolean);
//     }

//     if (Array.isArray(input)) {
//       return input.map(Number).filter(Boolean);
//     }

//     return [];
//   };

//   /* 🔥 FIXED */
//   const discountCars = parseDiscountCars(
//   user?.discount_cars || user?.promo_cars
// );
//   const userDiscount = Number(user?.discount) || 0;

// const isCarAllowed =
//   discountCars.length > 0 &&
//   discountCars.includes(Number(id));

//   const finalDiscountPercent = isCarAllowed ? userDiscount : 0;

//   /* ================= PRICE ================= */
//   const basePrice = Number(car?.price) || 0;

//   const configPrice =
//     (Number(selectedHp?.price) || 0) +
//     (Number(selectedTuning?.price) || 0) +
//     (Number(selectedWheels?.price) || 0);

//   const discountedBasePrice =
//     finalDiscountPercent > 0
//       ? Math.floor(basePrice - (basePrice * finalDiscountPercent) / 100)
//       : basePrice;

//   const totalPrice = discountedBasePrice + configPrice;

//   /* ================= ORDER ================= */
//   const handleOpenPay = () => {
//     setRandomPass(Math.floor(1000 + Math.random() * 9000).toString());
//     setShowPay(true);
//   };

//   const selectedConfigs = [
//     `Engine: ${selectedHp?.name || "Stock"}`,
//     `Tuning: ${selectedTuning?.name || "None"}`,
//     `Wheels: ${selectedWheels?.name || "None"}`,
//     `Password: ${randomPass}`,
//   ];

//   const sendToTelegram = async () => {
//     if (!car || !user) return;

//     try {
//       setSending(true);

//       const token = localStorage.getItem("token");

//       /* 1) отправка заказа */
//       await fetch(`${API}/telegram/order-to-tg`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({
//           user,
//           car,
//           configs: selectedConfigs,
//           total: totalPrice,
//         }),
//       });

//       /* 2) покупка + consume promo */
//       await fetch(`${API}/promo/buy`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({
//           carId: car.id,
//         }),
//       });

//       alert("ORDER SENT");
//       navigate("/market");
//     } catch (e) {
//       console.log("ORDER ERROR:", e);
//       alert("ERROR");
//     } finally {
//       setSending(false);
//     }
//   };

//   /* ================= UI ================= */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         LOADING...
//       </div>
//     );
//   }

//   if (!car) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         CAR NOT FOUND
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Navbar />

//       <div className="max-w-6xl mx-auto p-6">
//         <h1 className="text-4xl font-black">
//           {car.brand} {car.name}
//         </h1>

//         <img
//           src={car.image_url}
//           alt={car.name}
//           className="w-full mt-4 rounded-2xl"
//         />

//         <div className="mt-6 text-2xl font-bold">
//           {finalDiscountPercent > 0 && (
//             <div className="line-through text-white/40">${basePrice}</div>
//           )}

//           <div className="text-yellow-400">${totalPrice}</div>

//           {finalDiscountPercent > 0 && (
//             <div className="text-green-400 text-sm mt-2">
//               🔥 Promo applied: -{finalDiscountPercent}%
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleOpenPay}
//           className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black"
//         >
//           BUY
//         </button>

//         {/* CONFIGS */}
//         <div className="grid grid-cols-3 gap-4 mt-10">
//           {configs.power.map((i) => (
//             <button
//               key={i.id}
//               onClick={() => setSelectedHp(i)}
//               className={`p-3 rounded-xl ${
//                 selectedHp?.id === i.id
//                   ? "bg-yellow-400 text-black"
//                   : "bg-white/10"
//               }`}
//             >
//               {i.name}
//             </button>
//           ))}

//           {configs.tuning.map((i) => (
//             <button
//               key={i.id}
//               onClick={() => setSelectedTuning(i)}
//               className={`p-3 rounded-xl ${
//                 selectedTuning?.id === i.id
//                   ? "bg-yellow-400 text-black"
//                   : "bg-white/10"
//               }`}
//             >
//               {i.name}
//             </button>
//           ))}

//           {configs.wheels.map((i) => (
//             <button
//               key={i.id}
//               onClick={() => setSelectedWheels(i)}
//               className={`p-3 rounded-xl ${
//                 selectedWheels?.id === i.id
//                   ? "bg-yellow-400 text-black"
//                   : "bg-white/10"
//               }`}
//             >
//               {i.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* MODAL */}
//       {showPay && (
//         <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
//           <div className="bg-[#111] p-6 rounded-2xl w-[400px]">
//             <h2 className="text-yellow-400 mb-4 text-xl font-bold">ORDER</h2>

//             {selectedConfigs.map((c, i) => (
//               <div key={i} className="mb-2">
//                 {c}
//               </div>
//             ))}

//             <div className="mt-4 font-bold text-green-400">
//               TOTAL: ${totalPrice}
//             </div>

//             <button
//               onClick={sendToTelegram}
//               disabled={sending}
//               className="mt-6 w-full bg-yellow-400 text-black py-2 rounded-xl font-black disabled:opacity-50"
//             >
//               {sending ? "SENDING..." : "CONFIRM"}
//             </button>

//             <button
//               onClick={() => setShowPay(false)}
//               className="mt-2 w-full text-white/40"
//             >
//               CLOSE
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

/* ================= TYPES ================= */
type ConfigItem = {
  id: number;
  name: string;
  price: number;
};

type Car = {
  id: number;
  brand: string;
  name: string;
  price: number;
  image_url: string;
};

type User = {
  id: number;
  name: string;
  email?: string;
  discount?: number;
  discount_cars?: string | number[] | null;
  promo_cars?: string | number[] | null;
};

/* ================= HELPERS ================= */
const parseCarIds = (input: any): number[] => {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map(Number).filter(Boolean);
  }

  if (typeof input === "string") {
    return input.split(",").map(Number).filter(Boolean);
  }

  return [];
};

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState<Car | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [configs, setConfigs] = useState<{
    power: ConfigItem[];
    tuning: ConfigItem[];
    wheels: ConfigItem[];
  }>({
    power: [],
    tuning: [],
    wheels: [],
  });

  const [selectedHp, setSelectedHp] = useState<ConfigItem | null>(null);
  const [selectedTuning, setSelectedTuning] = useState<ConfigItem | null>(null);
  const [selectedWheels, setSelectedWheels] = useState<ConfigItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [showPay, setShowPay] = useState(false);
  const [sending, setSending] = useState(false);
  const [randomPass, setRandomPass] = useState("");

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const [carsRes, configsRes, userRes] = await Promise.all([
          fetch(`${API}/market/cars`),
          fetch(`${API}/market/configs`),
          fetch(`${API}/profile/me`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }),
        ]);

        const carsData = await carsRes.json();
        const configsData = await configsRes.json();
        const userData = await userRes.json();

        const cars: Car[] = Array.isArray(carsData) ? carsData : [];
        const foundCar = cars.find((c) => String(c.id) === String(id));

        setCar(foundCar || null);
        setUser(userData || null);

        setConfigs({
          power: configsData?.power || [],
          tuning: configsData?.tuning || [],
          wheels: configsData?.wheels || [],
        });

        setSelectedHp(configsData?.power?.[0] || null);
        setSelectedTuning(configsData?.tuning?.[0] || null);
        setSelectedWheels(configsData?.wheels?.[0] || null);
      } catch (e) {
        console.log("LOAD ERROR:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= DISCOUNT LOGIC ================= */
  const discount = Number(user?.discount) || 0;

  const discountCars = parseCarIds(
    user?.discount_cars || user?.promo_cars
  );

  // 🔥 FIX: правильная логика
  const hasRestriction = discountCars.length > 0;

  const isCarAllowed = !hasRestriction
    ? true
    : discountCars.includes(Number(id));

  const finalDiscount = isCarAllowed ? discount : 0;

  /* ================= PRICE ================= */
  const basePrice = Number(car?.price) || 0;

  const configPrice =
    (selectedHp?.price || 0) +
    (selectedTuning?.price || 0) +
    (selectedWheels?.price || 0);

  const finalBasePrice =
    finalDiscount > 0
      ? Math.floor(basePrice - (basePrice * finalDiscount) / 100)
      : basePrice;

  const totalPrice = finalBasePrice + configPrice;

  /* ================= ORDER ================= */
  const handleOpenPay = () => {
    setRandomPass(Math.floor(1000 + Math.random() * 9000).toString());
    setShowPay(true);
  };

  const selectedConfigs = [
    `Engine: ${selectedHp?.name || "Stock"}`,
    `Tuning: ${selectedTuning?.name || "None"}`,
    `Wheels: ${selectedWheels?.name || "None"}`,
    `Password: ${randomPass}`,
  ];

  const sendToTelegram = async () => {
    if (!car || !user) return;

    try {
      setSending(true);

      const token = localStorage.getItem("token");

      const buyRes = await fetch(`${API}/promo/buy`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
  body: JSON.stringify({
    carId: car.id,
  }),
});

const data = await buyRes.json();

if (!data.success) {
  throw new Error("BUY FAILED");
}

// 🔥 ОБНОВЛЯЕМ USER СРАЗУ
if (data.user) {
  setUser(data.user);
}
      const buyData = await buyRes.json();

      if (!buyData.success) {
        throw new Error("BUY FAILED");
      }

      await fetch(`${API}/telegram/order-to-tg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          user,
          car,
          configs: selectedConfigs,
          total: totalPrice,
        }),
      });

      alert("ORDER SENT");
      navigate("/market");
    } catch (e) {
      console.log("ORDER ERROR:", e);
      alert("ERROR");
    } finally {
      setSending(false);
    }
  };

  /* ================= UI ================= */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        LOADING...
      </div>
    );

  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        CAR NOT FOUND
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-black">
          {car.brand} {car.name}
        </h1>

        <img src={car.image_url} className="w-full mt-4 rounded-2xl" />

        <div className="mt-6 text-2xl font-bold">
          {finalDiscount > 0 && (
            <div className="line-through text-white/40">${basePrice}</div>
          )}

          <div className="text-yellow-400">${totalPrice}</div>

          {finalDiscount > 0 && (
            <div className="text-green-400 text-sm mt-2">
              🔥 -{finalDiscount}%
            </div>
          )}
        </div>

        <button
          onClick={handleOpenPay}
          className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black"
        >
          BUY
        </button>

        {/* CONFIGS */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {configs.power.map((i) => (
            <button key={i.id} onClick={() => setSelectedHp(i)}>
              {i.name}
            </button>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showPay && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <div className="bg-[#111] p-6 rounded-2xl w-[400px]">
            <h2 className="text-yellow-400 mb-4">ORDER</h2>

            {selectedConfigs.map((c, i) => (
              <div key={i}>{c}</div>
            ))}

            <div className="mt-4 font-bold text-green-400">
              TOTAL: ${totalPrice}
            </div>

            <button
              onClick={sendToTelegram}
              disabled={sending}
              className="mt-6 w-full bg-yellow-400 text-black py-2 rounded-xl font-black"
            >
              {sending ? "SENDING..." : "CONFIRM"}
            </button>

            <button
              onClick={() => setShowPay(false)}
              className="mt-2 w-full text-white/40"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}