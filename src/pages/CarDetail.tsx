
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// /* ================= SAFE USER ================= */
// const getUser = () => {
//   try {
//     const raw = localStorage.getItem("user");
//     if (!raw || raw === "undefined" || raw === "null") return null;

//     const parsed = JSON.parse(raw);

//     // 🔥 ВАЖНО: фикс структуры
//     return parsed.user || parsed;
//   } catch {
//     return null;
//   }
// };

// /* ================= SAFE FETCH ================= */
// const safeFetch = async (url: string) => {
//   try {
//     const res = await fetch(url);
//     const text = await res.text();

//     if (!text || text.startsWith("<!DOCTYPE")) return null;

//     return JSON.parse(text);
//   } catch {
//     return null;
//   }
// };

// export default function CarDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [car, setCar] = useState<any>(null);
//   const [configs, setConfigs] = useState<any>({
//     power: [],
//     tuning: [],
//     wheels: [],
//   });

//   const [user, setUser] = useState<any>(null);

//   const [selectedHp, setSelectedHp] = useState<any>(null);
//   const [selectedTuning, setSelectedTuning] = useState<any>(null);
//   const [selectedWheels, setSelectedWheels] = useState<any>(null);

//   const [showPay, setShowPay] = useState(false);
//   const [sending, setSending] = useState(false);

//   /* ================= LOAD ================= */
//   const load = async () => {
//     const [carsData, configsData] = await Promise.all([
//       safeFetch(`${API}/market/cars`),
//       safeFetch(`${API}/market/configs`),
//     ]);

//     const cars = Array.isArray(carsData) ? carsData : [];
//     const foundCar = cars.find((c: any) => c.id == id);

//     setCar(foundCar);
//     setConfigs(configsData || { power: [], tuning: [], wheels: [] });

//     const cfg = configsData || { power: [], tuning: [], wheels: [] };

//     setSelectedHp(cfg.power?.find((i: any) => Number(i.price) === 0));
//     setSelectedTuning(cfg.tuning?.find((i: any) => Number(i.price) === 0));
//     setSelectedWheels(cfg.wheels?.find((i: any) => Number(i.price) === 0));

//     // 🔥 FIX USER
//     const local = getUser();

//     if (local?.id) {
//       const userData = await safeFetch(`${API}/profile/${local.id}`);
//       if (userData) setUser(userData);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [id]);

//   if (!car) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-white font-black text-3xl">
//         LOADING...
//       </div>
//     );
//   }

//   /* ================= SAFE PARSE ================= */
//   const parseSafe = (val: any) => {
//     try {
//       if (!val || val === "undefined") return [];
//       return typeof val === "string" ? JSON.parse(val) : val;
//     } catch {
//       return [];
//     }
//   };

//   /* ================= DISCOUNT ================= */
//   const discount = Number(user?.discount) || 0;
//   const allowedCars: number[] = parseSafe(user?.discount_cars);

//   const hasDiscount = allowedCars.includes(Number(id));
//   const finalDiscount = hasDiscount ? discount : 0;

//   /* ================= PRICE ================= */
//   const basePrice = Number(car.price) || 0;

//   const discountedPrice =
//     finalDiscount > 0
//       ? Math.floor(basePrice * (1 - finalDiscount / 100))
//       : basePrice;

//   const configPrice =
//     (Number(selectedHp?.price) || 0) +
//     (Number(selectedTuning?.price) || 0) +
//     (Number(selectedWheels?.price) || 0);

//   const totalPrice = discountedPrice + configPrice;

//   /* ================= CONFIGS ================= */
//   const selectedConfigs = [
//     selectedHp?.name,
//     selectedTuning?.name,
//     selectedWheels?.name,
//   ].filter(Boolean);

//   /* ================= SEND ================= */
//   const sendToTelegram = async () => {
//     try {
//       setSending(true);

//       const payload = {
//         user: {
//           id: user?.id,
//           name: user?.name,
//           email: user?.email,

//           // 🔥 ВАЖНО
//           username: user?.telegram_username,
//           tg_id: user?.telegram_id,
//         },
//         car: {
//           brand: car?.brand,
//           name: car?.name,
//         },
//         configs: selectedConfigs,
//         total: totalPrice,
//       };

//     await fetch(`${API}/telegram/order-to-tg`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//       alert("ORDER SENT 🚀");
//       navigate("/market");
//     } catch {
//       alert("ERROR");
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050608] text-white pb-10">
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-4 pt-4">
//         <button
//           onClick={() => navigate("/market")}
//           className="text-white/30 mb-4 text-sm font-bold"
//         >
//           ← BACK
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

//           {/* LEFT */}
//           <div>
//             <h1 className="text-4xl font-black">
//               <span className="text-yellow-400 text-sm">
//                 {car.brand}
//               </span>
//               {car.name}
//             </h1>

//             <img src={car.image_url} className="rounded-3xl mt-4" />

//             {finalDiscount > 0 && (
//               <div className="bg-red-600 text-xs px-3 py-1 mt-2 inline-block rounded">
//                 -{finalDiscount}% SALE
//               </div>
//             )}
//           </div>

//           {/* RIGHT */}
//           <div className="flex flex-col gap-6">

//             <ConfigGroup title="POWER" items={configs.power} selected={selectedHp} onSelect={setSelectedHp} />
//             <ConfigGroup title="TUNING" items={configs.tuning} selected={selectedTuning} onSelect={setSelectedTuning} />
//             <ConfigGroup title="WHEELS" items={configs.wheels} selected={selectedWheels} onSelect={setSelectedWheels} />

//             <div className="bg-yellow-500 text-black p-6 rounded-3xl">
//               <div className="flex justify-between">
//                 <span className="font-black">TOTAL</span>

//                 <div>
//                   {finalDiscount > 0 && (
//                     <div className="line-through">
//                       {basePrice} $
//                     </div>
//                   )}
//                   <div className="text-3xl font-black">
//                     {totalPrice} $
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setShowPay(true)}
//                 className="w-full mt-4 bg-black text-white py-4 rounded-xl"
//               >
//                 BUY
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MODAL */}
//       {showPay && (
//         <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
//           <div className="bg-[#0c0c0c] p-6 rounded-3xl w-full max-w-sm">

//             <h2 className="text-yellow-400 text-center font-black mb-4">
//               ORDER SUMMARY
//             </h2>

//             <div className="text-center font-mono mb-2">
//               9860 3501 4889 2556
//             </div>

//             <div className="text-center text-xs text-white/30 mb-4">
//               TEST CARD
//             </div>

//             <div className="text-xs mb-3">
//               <div>Name: {user?.name}</div>
//               <div>Username: @{user?.telegram_username || "none"}</div>
//               <div>ID: {user?.telegram_id || "-"}</div>
//             </div>

//             <div className="text-xs mb-3">
//               {selectedConfigs.map((c, i) => (
//                 <div key={i}>• {c}</div>
//               ))}
//             </div>

//             <div className="flex justify-between mb-4">
//               <span>TOTAL</span>
//               <span>{totalPrice} $</span>
//             </div>

//             <div className="text-xs text-center mb-4">
//               Server: CPM MARKET <br />
//               Pass: 1234
//             </div>

//             <button
//               onClick={sendToTelegram}
//               disabled={sending}
//               className="w-full bg-yellow-500 py-3 text-black font-black rounded-xl"
//             >
//               {sending ? "SENDING..." : "ОПЛАТИЛ"}
//             </button>

//             <button
//               onClick={() => setShowPay(false)}
//               className="w-full mt-2 text-white/30 text-xs"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= CONFIG ================= */
// function ConfigGroup({ title, items, selected, onSelect }: any) {
//   if (!items?.length) return null;

//   return (
//     <div>
//       <div className="text-yellow-400 text-xs mb-2">{title}</div>

//       <div className="grid grid-cols-2 gap-2">
//         {items.map((item: any) => (
//           <button
//             key={item.id}
//             onClick={() => onSelect(item)}
//             className={`p-3 rounded-xl ${
//               selected?.id === item.id
//                 ? "bg-yellow-500 text-black"
//                 : "bg-white/5"
//             }`}
//           >
//             {item.name}
//           </button>
//         ))}
//       </div>
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
  discount_cars?: string | number[];
  telegram_username?: string;
  telegram_id?: string;
};

/* ================= USER FROM LOCALSTORAGE ================= */
const getUser = (): User | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed.user || parsed;
  } catch {
    return null;
  }
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

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [carsRes, configsRes] = await Promise.all([
          fetch(`${API}/market/cars`),
          fetch(`${API}/market/configs`),
        ]);

        const carsData = await carsRes.json();
        const configsData = await configsRes.json();

        const cars: Car[] = Array.isArray(carsData) ? carsData : [];

        const foundCar = cars.find((c) => String(c.id) === String(id));

        setCar(foundCar || null);
        setConfigs(configsData || { power: [], tuning: [], wheels: [] });

        const cfg = configsData || { power: [], tuning: [], wheels: [] };

        setSelectedHp(
          cfg.power?.find((i: ConfigItem) => Number(i.price) === 0) || null
        );
        setSelectedTuning(
          cfg.tuning?.find((i: ConfigItem) => Number(i.price) === 0) || null
        );
        setSelectedWheels(
          cfg.wheels?.find((i: ConfigItem) => Number(i.price) === 0) || null
        );

        const localUser = getUser();

        if (localUser?.id) {
          const userRes = await fetch(`${API}/profile/${localUser.id}`);
          const userData = await userRes.json();
          setUser(userData || null);
        }
      } catch (err) {
        console.log("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl font-black">
        LOADING...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500 text-2xl font-black">
        CAR NOT FOUND
      </div>
    );
  }

  /* ================= DISCOUNT ================= */
  const discount = Number(user?.discount) || 0;

  const allowedCars: number[] = Array.isArray(user?.discount_cars)
    ? (user.discount_cars as number[])
    : [];

  const hasDiscount = allowedCars.includes(Number(id));
  const finalDiscount = hasDiscount ? discount : 0;

  /* ================= PRICE ================= */
  const basePrice = Number(car.price) || 0;

  const discountedPrice =
    finalDiscount > 0
      ? Math.floor(basePrice * (1 - finalDiscount / 100))
      : basePrice;

  const configPrice =
    (Number(selectedHp?.price) || 0) +
    (Number(selectedTuning?.price) || 0) +
    (Number(selectedWheels?.price) || 0);

  const totalPrice = discountedPrice + configPrice;

  const selectedConfigs = [
    selectedHp?.name,
    selectedTuning?.name,
    selectedWheels?.name,
  ].filter(Boolean);

  /* ================= SEND ================= */
  const sendToTelegram = async () => {
    try {
      setSending(true);

      const payload = {
        user: {
          id: user?.id,
          name: user?.name,
          username: user?.telegram_username,
          tg_id: user?.telegram_id,
        },
        car: {
          brand: car.brand,
          name: car.name,
        },
        configs: selectedConfigs,
        total: totalPrice,
      };

      await fetch(`${API}/telegram/order-to-tg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      alert("ORDER SENT 🚀");
      navigate("/market");
    } catch {
      alert("ERROR");
    } finally {
      setSending(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050608] text-white pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/market")}
          className="text-white/30 mb-4 text-sm font-bold"
        >
          ← BACK
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-black">
              <span className="text-yellow-400 text-sm">{car.brand}</span>{" "}
              {car.name}
            </h1>

            <img src={car.image_url} className="rounded-3xl mt-4" />

            {finalDiscount > 0 && (
              <div className="bg-red-600 text-xs px-3 py-1 mt-2 inline-block rounded">
                -{finalDiscount}% SALE
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">
            <ConfigGroup
              title="POWER"
              items={configs.power}
              selected={selectedHp}
              onSelect={setSelectedHp}
            />
            <ConfigGroup
              title="TUNING"
              items={configs.tuning}
              selected={selectedTuning}
              onSelect={setSelectedTuning}
            />
            <ConfigGroup
              title="WHEELS"
              items={configs.wheels}
              selected={selectedWheels}
              onSelect={setSelectedWheels}
            />

            <div className="bg-yellow-500 text-black p-6 rounded-3xl">
              <div className="flex justify-between">
                <span className="font-black">TOTAL</span>

                <div>
                  {finalDiscount > 0 && (
                    <div className="line-through">{basePrice} $</div>
                  )}
                  <div className="text-3xl font-black">{totalPrice} $</div>
                </div>
              </div>

              <button
                onClick={() => setShowPay(true)}
                className="w-full mt-4 bg-black text-white py-4 rounded-xl"
              >
                BUY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showPay && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] p-6 rounded-3xl w-full max-w-sm">
            <h2 className="text-yellow-400 text-center font-black mb-4">
              ORDER SUMMARY
            </h2>

            <div className="text-center text-xs mb-4">
              {selectedConfigs.map((c, i: number) => (
                <div key={i}>• {c}</div>
              ))}
            </div>

            <div className="flex justify-between mb-4">
              <span>TOTAL</span>
              <span>{totalPrice} $</span>
            </div>

            <button
              onClick={sendToTelegram}
              disabled={sending}
              className="w-full bg-yellow-500 py-3 text-black font-black rounded-xl"
            >
              {sending ? "SENDING..." : "PAY"}
            </button>

            <button
              onClick={() => setShowPay(false)}
              className="w-full mt-2 text-white/30 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= CONFIG GROUP ================= */
function ConfigGroup({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: ConfigItem[];
  selected: ConfigItem | null;
  onSelect: (item: ConfigItem) => void;
}) {
  if (!items?.length) return null;

  return (
    <div>
      <div className="text-yellow-400 text-xs mb-2">{title}</div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-xl ${
              selected?.id === item.id
                ? "bg-yellow-500 text-black"
                : "bg-white/5"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}