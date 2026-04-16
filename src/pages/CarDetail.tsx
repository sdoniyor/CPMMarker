
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
//   discount_cars?: number[];
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
  
//   // Состояние для рандомного пароля
//   const [randomPass, setRandomPass] = useState("");

//   /* ================= LOAD DATA ================= */
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");

//         const [carsRes, configsRes, userRes] = await Promise.all([
//           fetch(`${API}/market/cars`),
//           fetch(`${API}/market/configs`),
//           fetch(`${API}/profile/me`, {
//             headers: { Authorization: token ? `Bearer ${token}` : "" },
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

//   /* ================= HANDLERS ================= */
//   const handleOpenPay = () => {
//     const pass = Math.floor(1000 + Math.random() * 9000).toString(); 
//     setRandomPass(pass);
//     setShowPay(true);
//   };

//   /* ================= CALCULATIONS ================= */
//   const userDiscount = Number(user?.discount) || 0;
//   const isCarAllowed = Array.isArray(user?.discount_cars) && user?.discount_cars.length > 0 
//     ? user.discount_cars.includes(Number(id)) 
//     : true;
//   const finalDiscountPercent = isCarAllowed ? userDiscount : 0;

//   const basePrice = Number(car.price) || 0;
//   const discountedBasePrice = finalDiscountPercent > 0 ? Math.floor(basePrice * (1 - finalDiscountPercent / 100)) : basePrice;
//   const configPrice = (Number(selectedHp?.price) || 0) + (Number(selectedTuning?.price) || 0) + (Number(selectedWheels?.price) || 0);
//   const totalPrice = discountedBasePrice + configPrice;

//   const selectedConfigs = [
//     `Мощность: ${selectedHp?.name || "Stock"}`,
//     `Тюнинг: ${selectedTuning?.name || "None"}`,
//     `Диски: ${selectedWheels?.name || "None"}`
//   ];

//   /* ================= SEND ORDER TO TG ================= */
//   const sendToTelegram = async () => {
//     // Проверка для TypeScript, чтобы он не ругался на null
//     if (!car || !user) {
//       alert("Ошибка: Данные машины или пользователя не загружены");
//       return;
//     }

//     try {
//       setSending(true);
      
//       const payload = {
//         user: { 
//           id: user.id, 
//           name: user.name, 
//           email: user.email,
//           username: user.telegram_username, 
//           tg_id: user.telegram_id 
//         },
//         car: { 
//           brand: car.brand, // Теперь TS спокоен
//           name: car.name 
//         },
//         configs: selectedConfigs,
//         server_info: {
//             server: `тест${selectedHp?.name || ""}`,
//             password: randomPass
//         },
//         total: totalPrice,
//       };

//       const res = await fetch(`${API}/telegram/order-to-tg`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         alert("ЗАКАЗ ОТПРАВЛЕН В ТЕЛЕГРАМ! ✅");
//         navigate("/market");
//       } else {
//         alert("Ошибка при отправке заказа.");
//       }
//     } catch (e) {
//       console.error(e);
//       alert("Сервер ТГ недоступен.");
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl font-black italic tracking-tighter">LOADING...</div>;
//   if (!car) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 text-2xl font-black">CAR NOT FOUND</div>;

//   return (
//     <div className="min-h-screen bg-[#050608] text-white pb-10">
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-4 pt-24">
//         <button onClick={() => navigate("/market")} className="text-white/30 mb-6 text-sm font-bold hover:text-white transition flex items-center gap-2">
//           ← BACK TO MARKET
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* LEFT: IMAGE */}
//           <div>
//             <h1 className="text-5xl font-black uppercase leading-none">
//               <span className="text-yellow-400 text-sm block mb-2 tracking-[0.2em] font-bold">{car.brand}</span>
//               {car.name}
//             </h1>
//             <div className="relative mt-6 group">
//               <img src={car.image_url} alt={car.name} className="w-full rounded-[2rem] border border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-[1.01]" />
//               {finalDiscountPercent > 0 && (
//                 <div className="absolute top-6 left-6 bg-red-600 text-white font-black px-5 py-2 rounded-full shadow-xl animate-pulse">
//                   -{finalDiscountPercent}% OFF
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* RIGHT: CONFIGURATOR */}
//           <div className="flex flex-col gap-6">
//             <ConfigGroup title="ENGINE POWER" items={configs.power} selected={selectedHp} onSelect={setSelectedHp} />
//             <ConfigGroup title="VISUAL TUNING" items={configs.tuning} selected={selectedTuning} onSelect={setSelectedTuning} />
//             <ConfigGroup title="WHEELS" items={configs.wheels} selected={selectedWheels} onSelect={setSelectedWheels} />

//             <div className="bg-yellow-400 text-black p-8 rounded-[2rem] mt-4 shadow-xl">
//               <div className="flex justify-between items-end">
//                 <span className="font-black text-xl tracking-tighter uppercase">Итого</span>
//                 <div className="text-right leading-none">
//                   {finalDiscountPercent > 0 && <div className="text-black/40 line-through text-lg font-bold mb-1">${basePrice + configPrice}</div>}
//                   <div className="text-5xl font-black tracking-tighter">${totalPrice}</div>
//                 </div>
//               </div>
//               <button onClick={handleOpenPay} className="w-full mt-8 bg-black text-white py-5 rounded-2xl font-black text-lg hover:bg-zinc-900 transition-all active:scale-[0.98]">
//                 ОФОРМИТЬ ЗАКАЗ
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MODAL WINDOW */}
//       {showPay && (
//         <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-[200]">
//           <div className="bg-[#0c0c0c] p-8 rounded-[2.5rem] w-full max-w-md border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
//             <h2 className="text-yellow-400 text-center text-3xl font-black mb-8 tracking-tighter">ДЕТАЛИ ЗАКАЗА</h2>

//             <div className="space-y-3 mb-6 bg-white/5 p-5 rounded-2xl border border-white/5">
//               <div className="flex justify-between text-white/40 text-xs uppercase font-black">
//                 <span>Машина:</span>
//                 <span className="text-white">{car.brand} {car.name}</span>
//               </div>
//               <div className="h-[1px] bg-white/10 my-2" />
//               <div className="flex justify-between text-2xl font-black">
//                 <span className="tracking-tighter uppercase font-black">К ОПЛАТЕ:</span>
//                 <span className="text-yellow-400">${totalPrice}</span>
//               </div>
//             </div>

//             {/* ДАННЫЕ СЕРВЕРА И ПЛАТЕЖА */}
//             <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5 space-y-6">
//               <div className="text-center">
//                 <div className="text-white/30 text-[9px] uppercase font-black tracking-[0.2em] mb-2">Номер карты для теста</div>
//                 <div className="text-white font-mono text-xl tracking-[0.15em] font-bold">9860 3501 xxxx xxxx</div>
//                 <div className="text-yellow-400/50 text-[11px] font-bold mt-2 italic tracking-widest uppercase">test mode</div>
//               </div>

//               <div className="pt-4 border-t border-white/10 flex justify-around text-center">
//                 <div>
//                   <div className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-1">Server</div>
//                   <div className="text-yellow-400 text-sm font-black uppercase tracking-tighter">
//                     тест{selectedHp?.name || ""}
//                   </div>
//                 </div>
//                 <div className="w-[1px] bg-white/10 h-8" />
//                 <div>
//                   <div className="text-white/30 text-[9px] uppercase font-black tracking-widest mb-1">Password</div>
//                   <div className="text-white text-sm font-black tracking-widest">{randomPass}</div>
//                 </div>
//               </div>
//             </div>

//             <button 
//               onClick={sendToTelegram} 
//               disabled={sending} 
//               className="w-full bg-yellow-400 py-5 text-black font-black rounded-2xl hover:bg-yellow-300 disabled:opacity-50 transition-all text-lg shadow-[0_10px_30px_rgba(250,204,21,0.2)] uppercase"
//             >
//               {sending ? "ОТПРАВЛЯЕМ..." : "ПОДТВЕРДИТЬ И КУПИТЬ"}
//             </button>

//             <button onClick={() => setShowPay(false)} className="w-full mt-4 text-white/20 text-xs font-bold hover:text-white transition uppercase tracking-widest">
//               ОТМЕНИТЬ
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= HELPER COMPONENT ================= */
// function ConfigGroup({ title, items, selected, onSelect }: {
//   title: string;
//   items: ConfigItem[];
//   selected: ConfigItem | null;
//   onSelect: (item: ConfigItem) => void;
// }) {
//   if (!items?.length) return null;
//   return (
//     <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
//       <div className="text-yellow-400 text-[10px] font-black tracking-[0.2em] mb-4 uppercase">{title}</div>
//       <div className="grid grid-cols-2 gap-3">
//         {items.map((item) => (
//           <button key={item.id} onClick={() => onSelect(item)} className={`p-4 rounded-2xl text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
//               selected?.id === item.id ? "bg-yellow-400 text-black shadow-lg scale-[1.02]" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
//             }`}>
//             <span>{item.name}</span>
//             {Number(item.price) > 0 && <span className={`text-[10px] ${selected?.id === item.id ? "text-black/60" : "text-yellow-400/60"}`}>+${item.price}</span>}
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
  discount_cars?: string | number[] | null;
  telegram_username?: string;
  telegram_id?: string;
};

/* ================= SAFE USER PARSER ================= */
const parseDiscountCars = (value: any): number[] => {
  if (!value) return [];

  if (Array.isArray(value)) return value.map(Number);

  if (typeof value === "string") {
    return value.split(",").map(Number);
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

  /* ================= LOAD DATA ================= */
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
        setConfigs(configsData || { power: [], tuning: [], wheels: [] });

        const cfg = configsData || { power: [], tuning: [], wheels: [] };

        setSelectedHp(cfg.power?.find((i: ConfigItem) => Number(i.price) === 0) || null);
        setSelectedTuning(cfg.tuning?.find((i: ConfigItem) => Number(i.price) === 0) || null);
        setSelectedWheels(cfg.wheels?.find((i: ConfigItem) => Number(i.price) === 0) || null);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= OPEN PAY ================= */
  const handleOpenPay = () => {
    const pass = Math.floor(1000 + Math.random() * 9000).toString();
    setRandomPass(pass);
    setShowPay(true);
  };

  /* ================= DISCOUNT LOGIC ================= */
  const userDiscount = Number(user?.discount) || 0;

  const discountCars = parseDiscountCars(user?.discount_cars);

  const isCarAllowed =
    discountCars.length === 0 ? true : discountCars.includes(Number(id));

  const finalDiscount = isCarAllowed ? userDiscount : 0;

  /* ================= PRICE ================= */
  const basePrice = car ? Number(car.price) : 0;

  const discountedBase =
    finalDiscount > 0
      ? Math.floor(basePrice * (1 - finalDiscount / 100))
      : basePrice;

  const configPrice =
    (Number(selectedHp?.price) || 0) +
    (Number(selectedTuning?.price) || 0) +
    (Number(selectedWheels?.price) || 0);

  const totalPrice = discountedBase + configPrice;

  const selectedConfigs = [
    selectedHp?.name,
    selectedTuning?.name,
    selectedWheels?.name,
  ].filter(Boolean);

  /* ================= SEND TO TELEGRAM ================= */
  const sendToTelegram = async () => {
    if (!car || !user) return;

    try {
      setSending(true);

      const payload = {
        user: {
          id: user.id,
          name: user.name,
          username: user.telegram_username,
          tg_id: user.telegram_id,
        },
        car: {
          brand: car.brand,
          name: car.name,
        },
        configs: selectedConfigs,
        server_info: {
          server: `test-${selectedHp?.name || ""}`,
          password: randomPass,
        },
        total: totalPrice,
      };

      const res = await fetch(`${API}/telegram/order-to-tg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("ORDER SENT 🚀");
        navigate("/market");
      } else {
        alert("Telegram error / route not found");
      }
    } catch (e) {
      console.error(e);
      alert("Server error");
    } finally {
      setSending(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl font-black">
        LOADING...
      </div>
    );

  if (!car)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500 text-2xl font-black">
        CAR NOT FOUND
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050608] text-white pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-24">
        <button
          onClick={() => navigate("/market")}
          className="text-white/30 mb-6 text-sm font-bold"
        >
          ← BACK
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT */}
          <div>
            <h1 className="text-5xl font-black uppercase">
              <span className="text-yellow-400 text-sm block mb-2">
                {car.brand}
              </span>
              {car.name}
            </h1>

            <img
              src={car.image_url}
              className="w-full rounded-3xl mt-6"
            />

            {finalDiscount > 0 && (
              <div className="mt-3 bg-red-600 px-4 py-2 inline-block rounded">
                -{finalDiscount}% OFF
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

            <div className="bg-yellow-400 text-black p-6 rounded-3xl">
              <div className="flex justify-between">
                <span className="font-black">TOTAL</span>
                <span className="text-3xl font-black">${totalPrice}</span>
              </div>

              <button
                onClick={handleOpenPay}
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
          <div className="bg-[#0c0c0c] p-6 rounded-3xl w-full max-w-md">
            <h2 className="text-yellow-400 text-center font-black mb-4">
              ORDER
            </h2>

            <div className="text-xs mb-3">
              {selectedConfigs.map((c, i) => (
                <div key={i}>• {c}</div>
              ))}
            </div>

            <div className="text-center font-bold mb-4">
              TOTAL: ${totalPrice}
            </div>

            <div className="text-center text-xs mb-4 text-white/40">
              Server: test-{selectedHp?.name || ""}
              <br />
              Password: {randomPass}
            </div>

            <button
              onClick={sendToTelegram}
              disabled={sending}
              className="w-full bg-yellow-400 py-3 text-black font-black rounded-xl"
            >
              {sending ? "SENDING..." : "CONFIRM"}
            </button>

            <button
              onClick={() => setShowPay(false)}
              className="w-full mt-2 text-white/40 text-xs"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= CONFIG ================= */
function ConfigGroup({
  title,
  items,
  selected,
  onSelect,
}: any) {
  if (!items?.length) return null;

  return (
    <div>
      <div className="text-yellow-400 text-xs mb-2">{title}</div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-xl ${
              selected?.id === item.id
                ? "bg-yellow-400 text-black"
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