
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

//   const basePrice = Number(car?.price) || 0;
//   const discountedBasePrice = finalDiscountPercent > 0 ? Math.floor(basePrice * (1 - finalDiscountPercent / 100)) : basePrice;
//   const configPrice = (Number(selectedHp?.price) || 0) + (Number(selectedTuning?.price) || 0) + (Number(selectedWheels?.price) || 0);
//   const totalPrice = discountedBasePrice + configPrice;

//   // "Хитрый" способ: добавляем сервер и пароль в список конфигов
//   const selectedConfigs = [
//     `Мощность: ${selectedHp?.name || "Stock"}`,
//     `Тюнинг: ${selectedTuning?.name || "None"}`,
//     `Диски: ${selectedWheels?.name || "None"}`,
//     `🌐 Сервер: тест${selectedHp?.name || ""}`,
//     `🔑 Пароль: ${randomPass}`
//   ];

//   /* ================= SEND ORDER TO TG ================= */
//   const sendToTelegram = async () => {
//     if (!car || !user) {
//       alert("Ошибка данных");
//       return;
//     }

//     try {
//       setSending(true);
//       const token = localStorage.getItem("token");

//       const payload = {
//         user: { 
//           id: user.id, 
//           name: user.name, 
//           email: user.email || "No email",
//           username: user.telegram_username || "Unknown", 
//           tg_id: user.telegram_id || "None" 
//         },
//         car: { 
//           brand: car.brand, 
//           name: car.name 
//         },
//         configs: selectedConfigs, // Здесь уже сидят пароль и сервер
//         total: totalPrice,
//       };

//       const res = await fetch(`${API}/telegram/order-to-tg`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           "Authorization": token ? `Bearer ${token}` : "" 
//         },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         alert(`ЗАКАЗ ОТПРАВЛЕН! ✅\nВаш пароль для входа: ${randomPass}`);
//         navigate("/market");
//       } else {
//         alert("Ошибка сервера при отправке заказа.");
//       }
//     } catch (e) {
//       alert("Ошибка сети");
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl font-black italic">LOADING...</div>;
//   if (!car) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 text-2xl font-black">CAR NOT FOUND</div>;

//   return (
//     <div className="min-h-screen bg-[#050608] text-white pb-10">
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-4 pt-24">
//         <button onClick={() => navigate("/market")} className="text-white/30 mb-6 text-sm font-bold hover:text-white transition flex items-center gap-2">
//           ← BACK TO MARKET
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           <div>
//             <h1 className="text-5xl font-black uppercase leading-none">
//               <span className="text-yellow-400 text-sm block mb-2 tracking-[0.2em] font-bold">{car.brand}</span>
//               {car.name}
//             </h1>
//             <div className="relative mt-6 group">
//               <img src={car.image_url} alt={car.name} className="w-full rounded-[2rem] border border-white/5 shadow-2xl transition-all" />
//               {finalDiscountPercent > 0 && (
//                 <div className="absolute top-6 left-6 bg-red-600 text-white font-black px-5 py-2 rounded-full animate-pulse">
//                   -{finalDiscountPercent}% OFF
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-col gap-6">
//             <ConfigGroup title="ENGINE POWER" items={configs.power} selected={selectedHp} onSelect={setSelectedHp} />
//             <ConfigGroup title="VISUAL TUNING" items={configs.tuning} selected={selectedTuning} onSelect={setSelectedTuning} />
//             <ConfigGroup title="WHEELS" items={configs.wheels} selected={selectedWheels} onSelect={setSelectedWheels} />

//             <div className="bg-yellow-400 text-black p-8 rounded-[2rem] mt-4 shadow-xl">
//               <div className="flex justify-between items-end font-black">
//                 <span className="text-xl tracking-tighter uppercase">Итого</span>
//                 <div className="text-right leading-none">
//                   {finalDiscountPercent > 0 && <div className="text-black/40 line-through text-lg mb-1">${basePrice + configPrice}</div>}
//                   <div className="text-5xl tracking-tighter">${totalPrice}</div>
//                 </div>
//               </div>
//               <button onClick={handleOpenPay} className="w-full mt-8 bg-black text-white py-5 rounded-2xl font-black text-lg hover:bg-zinc-900 transition-all uppercase">
//                 Оформить заказ
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showPay && (
//         <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-[200]">
//           <div className="bg-[#0c0c0c] p-8 rounded-[2.5rem] w-full max-w-md border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
//             <h2 className="text-yellow-400 text-center text-3xl font-black mb-8 tracking-tighter uppercase">Детали заказа</h2>

//             <div className="space-y-3 mb-6 bg-white/5 p-5 rounded-2xl border border-white/5 font-black">
//               <div className="flex justify-between text-white/40 text-xs uppercase">
//                 <span>Машина:</span>
//                 <span className="text-white">{car.brand} {car.name}</span>
//               </div>
//               <div className="h-[1px] bg-white/10 my-2" />
//               <div className="flex justify-between text-2xl">
//                 <span className="tracking-tighter uppercase">К оплате:</span>
//                 <span className="text-yellow-400">${totalPrice}</span>
//               </div>
//             </div>

//             <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5 space-y-6">
//               <div className="text-center font-black">
//                 <div className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-2">Карта для оплаты</div>
//                 <div className="text-white font-mono text-xl tracking-[0.15em]">9860 3501 xxxx xxxx</div>
//                 <div className="text-yellow-400/50 text-[11px] mt-2 italic tracking-widest uppercase">test mode</div>
//               </div>

//               <div className="pt-4 border-t border-white/10 flex justify-around text-center font-black">
//                 <div>
//                   <div className="text-white/30 text-[9px] uppercase tracking-widest mb-1">Server</div>
//                   <div className="text-yellow-400 text-sm uppercase tracking-tighter">
//                     тест{selectedHp?.name || ""}
//                   </div>
//                 </div>
//                 <div className="w-[1px] bg-white/10 h-8" />
//                 <div>
//                   <div className="text-white/30 text-[9px] uppercase tracking-widest mb-1">Password</div>
//                   <div className="text-white text-sm tracking-widest">{randomPass}</div>
//                 </div>
//               </div>
//             </div>

//             <button 
//               onClick={sendToTelegram} 
//               disabled={sending} 
//               className="w-full bg-yellow-400 py-5 text-black font-black rounded-2xl hover:bg-yellow-300 disabled:opacity-50 transition-all text-lg shadow-lg uppercase"
//             >
//               {sending ? "Отправка..." : "Подтвердить покупку"}
//             </button>

//             <button onClick={() => setShowPay(false)} className="w-full mt-4 text-white/20 text-xs font-bold hover:text-white transition uppercase tracking-widest">
//               Отмена
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
        setConfigs(configsData || { power: [], tuning: [], wheels: [] });

        if (configsData) {
          setSelectedHp(configsData.power?.find((i: ConfigItem) => Number(i.price) === 0) || null);
          setSelectedTuning(configsData.tuning?.find((i: ConfigItem) => Number(i.price) === 0) || null);
          setSelectedWheels(configsData.wheels?.find((i: ConfigItem) => Number(i.price) === 0) || null);
        }
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= FIX: discount cars parser ================= */
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

  /* ================= DISCOUNT LOGIC FIX ================= */
  const userDiscount = Number(user?.discount) || 0;

  const isCarAllowed =
    discountCars.length === 0 || discountCars.includes(Number(id));

  const finalDiscountPercent = isCarAllowed ? userDiscount : 0;

  /* ================= PRICE FIX ================= */
  const basePrice = Number(car?.price) || 0;

  const hpPrice = Number(selectedHp?.price) || 0;
  const tuningPrice = Number(selectedTuning?.price) || 0;
  const wheelsPrice = Number(selectedWheels?.price) || 0;

  const configPrice = hpPrice + tuningPrice + wheelsPrice;

  const discountedBasePrice =
    finalDiscountPercent > 0
      ? Math.floor(basePrice - (basePrice * finalDiscountPercent) / 100)
      : basePrice;

  const totalPrice = discountedBasePrice + configPrice;

  /* ================= PAY ================= */
  const handleOpenPay = () => {
    const pass = Math.floor(1000 + Math.random() * 9000).toString();
    setRandomPass(pass);
    setShowPay(true);
  };

  const selectedConfigs = [
    `Мощность: ${selectedHp?.name || "Stock"}`,
    `Тюнинг: ${selectedTuning?.name || "None"}`,
    `Диски: ${selectedWheels?.name || "None"}`,
    `🌐 Сервер: тест${selectedHp?.name || ""}`,
    `🔑 Пароль: ${randomPass}`,
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
    } catch (e) {
      alert("ERROR");
    } finally {
      setSending(false);
    }
  };

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

        {/* PRICE */}
        <div className="mt-6 text-2xl font-bold">
          {finalDiscountPercent > 0 && (
            <div className="line-through text-white/40">${basePrice}</div>
          )}
          <div className="text-yellow-400">${totalPrice}</div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleOpenPay}
          className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black"
        >
          BUY
        </button>
      </div>

      {/* MODAL */}
      {showPay && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <div className="bg-[#111] p-6 rounded-2xl w-[400px]">
            <h2 className="text-yellow-400 text-xl mb-4">ORDER</h2>

            <div className="text-sm space-y-2">
              {selectedConfigs.map((c, i) => (
                <div key={i}>{c}</div>
              ))}
            </div>

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