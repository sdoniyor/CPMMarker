
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
//         setConfigs(configsData || { power: [], tuning: [], wheels: [] });

//         if (configsData) {
//           setSelectedHp(configsData.power?.find((i: ConfigItem) => Number(i.price) === 0) || null);
//           setSelectedTuning(configsData.tuning?.find((i: ConfigItem) => Number(i.price) === 0) || null);
//           setSelectedWheels(configsData.wheels?.find((i: ConfigItem) => Number(i.price) === 0) || null);
//         }
//       } catch (err) {
//         console.error("LOAD ERROR:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [id]);

//   /* ================= FIX: discount cars parser ================= */
//   const parseDiscountCars = (input: any): number[] => {
//     if (!input) return [];

//     if (typeof input === "string") {
//       return input.split(",").map(Number).filter(Boolean);
//     }

//     if (Array.isArray(input)) {
//       return input.map(Number).filter(Boolean);
//     }

//     return [];
//   };

//   const discountCars = parseDiscountCars(user?.discount_cars);

//   /* ================= DISCOUNT LOGIC FIX ================= */
//   const userDiscount = Number(user?.discount) || 0;

//   const isCarAllowed =
//     discountCars.length === 0 || discountCars.includes(Number(id));

//   const finalDiscountPercent = isCarAllowed ? userDiscount : 0;

//   /* ================= PRICE FIX ================= */
//   const basePrice = Number(car?.price) || 0;

//   const hpPrice = Number(selectedHp?.price) || 0;
//   const tuningPrice = Number(selectedTuning?.price) || 0;
//   const wheelsPrice = Number(selectedWheels?.price) || 0;

//   const configPrice = hpPrice + tuningPrice + wheelsPrice;

//   const discountedBasePrice =
//     finalDiscountPercent > 0
//       ? Math.floor(basePrice - (basePrice * finalDiscountPercent) / 100)
//       : basePrice;

//   const totalPrice = discountedBasePrice + configPrice;

//   /* ================= PAY ================= */
//   const handleOpenPay = () => {
//     const pass = Math.floor(1000 + Math.random() * 9000).toString();
//     setRandomPass(pass);
//     setShowPay(true);
//   };

//   const selectedConfigs = [
//     `Мощность: ${selectedHp?.name || "Stock"}`,
//     `Тюнинг: ${selectedTuning?.name || "None"}`,
//     `Диски: ${selectedWheels?.name || "None"}`,
//     `🌐 Сервер: тест${selectedHp?.name || ""}`,
//     `🔑 Пароль: ${randomPass}`,
//   ];

//   const sendToTelegram = async () => {
//     if (!car || !user) return;

//     try {
//       setSending(true);
//       const token = localStorage.getItem("token");

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

//       alert("ORDER SENT");
//       navigate("/market");
//     } catch (e) {
//       alert("ERROR");
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         LOADING...
//       </div>
//     );

//   if (!car)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         CAR NOT FOUND
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Navbar />

//       <div className="max-w-6xl mx-auto p-6">
//         <h1 className="text-4xl font-black">
//           {car.brand} {car.name}
//         </h1>

//         <img src={car.image_url} className="w-full mt-4 rounded-2xl" />

//         {/* PRICE */}
//         <div className="mt-6 text-2xl font-bold">
//           {finalDiscountPercent > 0 && (
//             <div className="line-through text-white/40">${basePrice}</div>
//           )}
//           <div className="text-yellow-400">${totalPrice}</div>
//         </div>

//         {/* BUTTON */}
//         <button
//           onClick={handleOpenPay}
//           className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black"
//         >
//           BUY
//         </button>
//       </div>

//       {/* MODAL */}
//       {showPay && (
//         <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
//           <div className="bg-[#111] p-6 rounded-2xl w-[400px]">
//             <h2 className="text-yellow-400 text-xl mb-4">ORDER</h2>

//             <div className="text-sm space-y-2">
//               {selectedConfigs.map((c, i) => (
//                 <div key={i}>{c}</div>
//               ))}
//             </div>

//             <button
//               onClick={sendToTelegram}
//               disabled={sending}
//               className="mt-6 w-full bg-yellow-400 text-black py-2 rounded-xl font-black"
//             >
//               CONFIRM
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
  telegram_username?: string;
  telegram_id?: string;
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

        /* ✅ FIX CONFIGS */
        setConfigs({
          power: Array.isArray(configsData?.power) ? configsData.power : [],
          tuning: Array.isArray(configsData?.tuning) ? configsData.tuning : [],
          wheels: Array.isArray(configsData?.wheels) ? configsData.wheels : [],
        });

        /* ✅ DEFAULT SELECTION */
        setSelectedHp(configsData?.power?.[0] || null);
        setSelectedTuning(configsData?.tuning?.[0] || null);
        setSelectedWheels(configsData?.wheels?.[0] || null);
      } catch (e) {
        console.log("LOAD ERROR", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= DISCOUNT FIX ================= */
  const parseDiscountCars = (input: any): number[] => {
    if (!input) return [];

    if (typeof input === "string") {
      return input.split(",").map(Number).filter(Boolean);
    }

    if (Array.isArray(input)) {
      return input.map(Number).filter(Boolean);
    }

    return [];
  };

  const discountCars = parseDiscountCars(user?.discount_cars);

  const userDiscount = Number(user?.discount) || 0;

  const isCarAllowed =
    discountCars.length === 0 || discountCars.includes(Number(id));

  const finalDiscountPercent = isCarAllowed ? userDiscount : 0;

  /* ================= PRICE ================= */
  const basePrice = Number(car?.price) || 0;

  const configPrice =
    (Number(selectedHp?.price) || 0) +
    (Number(selectedTuning?.price) || 0) +
    (Number(selectedWheels?.price) || 0);

  const discountedBasePrice =
    finalDiscountPercent > 0
      ? Math.floor(basePrice - (basePrice * finalDiscountPercent) / 100)
      : basePrice;

  const totalPrice = discountedBasePrice + configPrice;

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
    } catch {
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
          {finalDiscountPercent > 0 && (
            <div className="line-through text-white/40">${basePrice}</div>
          )}
          <div className="text-yellow-400">${totalPrice}</div>
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
            <button
              key={i.id}
              onClick={() => setSelectedHp(i)}
              className="p-3 bg-white/10 rounded-xl"
            >
              {i.name}
            </button>
          ))}

          {configs.tuning.map((i) => (
            <button
              key={i.id}
              onClick={() => setSelectedTuning(i)}
              className="p-3 bg-white/10 rounded-xl"
            >
              {i.name}
            </button>
          ))}

          {configs.wheels.map((i) => (
            <button
              key={i.id}
              onClick={() => setSelectedWheels(i)}
              className="p-3 bg-white/10 rounded-xl"
            >
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

            <button
              onClick={sendToTelegram}
              disabled={sending}
              className="mt-6 w-full bg-yellow-400 text-black py-2 rounded-xl font-black"
            >
              CONFIRM
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