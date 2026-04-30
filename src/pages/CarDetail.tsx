
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

// type Promo = {
//   discount: number;
//   car_ids: string | number[] | null;
// };

// type User = {
//   active_promo?: Promo | null;
// };

// /* ================= HELPERS ================= */
// const parseCarIds = (input: any): number[] => {
//   if (!input) return [];

//   if (Array.isArray(input)) {
//     return input.map(Number).filter(Boolean);
//   }

//   if (typeof input === "string") {
//     return input
//       .split(",")
//       .map((x) => Number(x.trim()))
//       .filter(Boolean);
//   }

//   return [];
// };

// /* ================= COMPONENT ================= */
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

//         const foundCar = carsData.find(
//           (c: Car) => String(c.id) === String(id)
//         );

//         setCar(foundCar || null);
//         setUser(userData);

//         // 🔥 FIX CONFIGS
//         setConfigs({
//           power: configsData?.power || [],
//           tuning: configsData?.tuning || [],
//           wheels: configsData?.wheels || [],
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

//   /* ================= PROMO ================= */
//   const promo = user?.active_promo ?? null;

//   const discount = promo?.discount ?? 0;
//   const promoCars = parseCarIds(promo?.car_ids);

//   const hasRestriction = promoCars.length > 0;

//   const canUsePromo =
//     !!promo &&
//     discount > 0 &&
//     (!hasRestriction || promoCars.includes(Number(id)));

//   const finalDiscount = canUsePromo ? discount : 0;

//   /* ================= PRICE ================= */
//   const basePrice = Number(car?.price) || 0;

//   const configPrice =
//     (selectedHp?.price || 0) +
//     (selectedTuning?.price || 0) +
//     (selectedWheels?.price || 0);

//   const discountedBase =
//     finalDiscount > 0
//       ? Math.floor(basePrice - (basePrice * finalDiscount) / 100)
//       : basePrice;

//   const totalPrice = discountedBase + configPrice;

//   /* ================= ORDER ================= */
//   const handleOpenPay = () => {
//     setRandomPass(
//       Math.floor(1000 + Math.random() * 9000).toString()
//     );
//     setShowPay(true);
//   };

//   const selectedConfigs = [
//     `Engine: ${selectedHp?.name || "Stock"}`,
//     `Tuning: ${selectedTuning?.name || "None"}`,
//     `Wheels: ${selectedWheels?.name || "None"}`,
//     `Password: ${randomPass}`,
//   ];

//   /* ================= BUY ================= */
//   const sendToTelegram = async () => {
//     try {
//       setSending(true);

//       const token = localStorage.getItem("token");

//       const buyRes = await fetch(`${API}/promo/buy`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({ carId: car?.id }),
//       });

//       const buyData = await buyRes.json();

//       if (!buyData.success) throw new Error();

//       // refresh user
//       const userRes = await fetch(`${API}/profile/me`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });

//       const updatedUser = await userRes.json();
//       setUser(updatedUser);

//       await fetch(`${API}/telegram/order-to-tg`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({
//           user: updatedUser,
//           car,
//           configs: selectedConfigs,
//           total: totalPrice,
//         }),
//       });

//       alert("ORDER SENT");
//       navigate("/market");

//     } catch (e) {
//       console.log(e);
//       alert("ERROR");
//     } finally {
//       setSending(false);
//     }
//   };

//   /* ================= UI ================= */
//   if (loading) return <div>LOADING...</div>;
//   if (!car) return <div>CAR NOT FOUND</div>;

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
//           {finalDiscount > 0 && (
//             <div className="line-through text-white/40">
//               ${basePrice}
//             </div>
//           )}

//           <div className="text-yellow-400">${totalPrice}</div>

//           {finalDiscount > 0 && (
//             <div className="text-green-400 text-sm">
//               🔥 -{finalDiscount}% PROMO
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleOpenPay}
//           className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black"
//         >
//           BUY
//         </button>

//         {/* CONFIGS FIX */}
//         <div className="grid grid-cols-3 gap-4 mt-10">
//           {configs.power.length > 0 &&
//             configs.power.map((i) => (
//               <button
//                 key={i.id}
//                 onClick={() => setSelectedHp(i)}
//                 className="bg-white/10 p-2 rounded"
//               >
//                 {i.name}
//               </button>
//             ))}
//         </div>
//       </div>

//       {/* MODAL */}
//       {showPay && (
//         <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
//           <div className="bg-[#111] p-6 rounded-2xl w-[400px]">
//             {selectedConfigs.map((c, i) => (
//               <div key={i}>{c}</div>
//             ))}

//             <div className="mt-4 text-green-400">
//               TOTAL: ${totalPrice}
//             </div>

//             <button
//               onClick={sendToTelegram}
//               disabled={sending}
//               className="mt-6 w-full bg-yellow-400 text-black py-2 rounded-xl"
//             >
//               {sending ? "SENDING..." : "CONFIRM"}
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

type Promo = {
  discount: number;
  car_ids: string | number[] | null;
};

type User = {
  active_promo?: Promo | null;
};

/* ================= HELPERS ================= */
const parseCarIds = (input: any): number[] => {
  if (!input) return [];

  if (Array.isArray(input)) return input.map(Number).filter(Boolean);

  if (typeof input === "string") {
    return input.split(",").map(Number).filter(Boolean);
  }

  return [];
};

/* ================= COMPONENT ================= */
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

        const foundCar = carsData.find(
          (c: Car) => String(c.id) === String(id)
        );

        setCar(foundCar || null);
        setUser(userData || null);

        // 🔥 SAFE CONFIGS FIX
        const safeConfigs = {
          power: Array.isArray(configsData?.power)
            ? configsData.power
            : [],
          tuning: Array.isArray(configsData?.tuning)
            ? configsData.tuning
            : [],
          wheels: Array.isArray(configsData?.wheels)
            ? configsData.wheels
            : [],
        };

        setConfigs(safeConfigs);

        setSelectedHp(safeConfigs.power[0] || null);
        setSelectedTuning(safeConfigs.tuning[0] || null);
        setSelectedWheels(safeConfigs.wheels[0] || null);

      } catch (e) {
        console.log("LOAD ERROR:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= PROMO ================= */
  const promo = user?.active_promo ?? null;

  const discount = promo?.discount ?? 0;
  const promoCars = parseCarIds(promo?.car_ids);

  const hasRestriction = promoCars.length > 0;

  const canUsePromo =
    !!promo &&
    discount > 0 &&
    (!hasRestriction || promoCars.includes(Number(id)));

  const finalDiscount = canUsePromo ? discount : 0;

  /* ================= PRICE ================= */
  const basePrice = Number(car?.price) || 0;

  const configPrice =
    (selectedHp?.price || 0) +
    (selectedTuning?.price || 0) +
    (selectedWheels?.price || 0);

  const discountedBase =
    finalDiscount > 0
      ? Math.floor(basePrice - (basePrice * finalDiscount) / 100)
      : basePrice;

  const totalPrice = discountedBase + configPrice;

  /* ================= ORDER ================= */
  const handleOpenPay = () => {
    setRandomPass(
      Math.floor(1000 + Math.random() * 9000).toString()
    );
    setShowPay(true);
  };

  const selectedConfigs = [
    `Engine: ${selectedHp?.name || "Stock"}`,
    `Tuning: ${selectedTuning?.name || "None"}`,
    `Wheels: ${selectedWheels?.name || "None"}`,
    `Password: ${randomPass}`,
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-black">
          {car?.brand} {car?.name}
        </h1>

        <img src={car?.image_url} className="w-full mt-4 rounded-2xl" />

        {/* PRICE */}
        <div className="mt-6 text-2xl font-bold">
          {finalDiscount > 0 && (
            <div className="line-through text-white/40">
              ${basePrice}
            </div>
          )}

          <div className="text-yellow-400">${totalPrice}</div>

          {finalDiscount > 0 && (
            <div className="text-green-400 text-sm">
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

        {/* ================= CONFIGS FIX ================= */}
        <div className="mt-10 space-y-6">

          {/* POWER */}
          <div>
            <h2 className="text-yellow-400 mb-2">POWER</h2>
            <div className="grid grid-cols-3 gap-3">
              {configs.power.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setSelectedHp(i)}
                  className="bg-white/10 p-2 rounded"
                >
                  {i.name}
                </button>
              ))}
            </div>
          </div>

          {/* TUNING */}
          <div>
            <h2 className="text-yellow-400 mb-2">TUNING</h2>
            <div className="grid grid-cols-3 gap-3">
              {configs.tuning.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setSelectedTuning(i)}
                  className="bg-white/10 p-2 rounded"
                >
                  {i.name}
                </button>
              ))}
            </div>
          </div>

          {/* WHEELS */}
          <div>
            <h2 className="text-yellow-400 mb-2">WHEELS</h2>
            <div className="grid grid-cols-3 gap-3">
              {configs.wheels.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setSelectedWheels(i)}
                  className="bg-white/10 p-2 rounded"
                >
                  {i.name}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MODAL */}
      {showPay && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <div className="bg-[#111] p-6 rounded-2xl w-[400px]">
            {selectedConfigs.map((c, i) => (
              <div key={i}>{c}</div>
            ))}

            <div className="mt-4 text-green-400">
              TOTAL: ${totalPrice}
            </div>

            <button
              className="mt-6 w-full bg-yellow-400 text-black py-2 rounded-xl"
            >
              CONFIRM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}