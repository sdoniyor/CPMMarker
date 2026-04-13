
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function CarDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [car, setCar] = useState<any>(null);
//   const [configs, setConfigs] = useState<any>({});

//   const [selectedHp, setSelectedHp] = useState<any>(null);
//   const [selectedTuning, setSelectedTuning] = useState<any>(null);
//   const [selectedWheels, setSelectedWheels] = useState<any>(null);

//   const [user, setUser] = useState<any>(null);
//   const [showPay, setShowPay] = useState(false);

//   // --- РАСЧЕТ ИТОГОВОЙ СУММЫ ---
//   // Складываем цену машины и цены выбранных конфигов (если они есть в БД)
//   const totalPrice = 
//     (Number(car?.price) || 0) + 
//     (Number(selectedHp?.price) || 0) + 
//     (Number(selectedTuning?.price) || 0) + 
//     (Number(selectedWheels?.price) || 0);

//   /* ================= USER ================= */
//   const loadUser = async () => {
//     const local = JSON.parse(localStorage.getItem("user") || "{}");
//     if (!local?.id) return;
//     const res = await fetch(`${API}/profile/${local.id}`);
//     const data = await res.json();
//     setUser(data);
//     localStorage.setItem("user", JSON.stringify(data));
//   };

//   /* ================= CAR ================= */
//   const loadCar = async () => {
//     const res = await fetch(`${API}/cars`);
//     const data = await res.json();
//     const foundCar = data.find((c: any) => c.id == id);
//     setCar(foundCar);
//   };

//   /* ================= CONFIGS ================= */
//   const loadConfigs = async () => {
//     const res = await fetch(`${API}/configs`);
//     const data = await res.json();
//     setConfigs(data);
//     setSelectedHp(data.power?.[0] || null);
//     setSelectedTuning(data.tuning?.[0] || null);
//     setSelectedWheels(data.wheels?.[0] || null);
//   };

//   useEffect(() => {
//     loadCar();
//     loadConfigs();
//     loadUser();
//   }, [id]);

//   if (!car || !configs.power) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   /* ================= PAY ACTION ================= */
//   const completePayment = async () => {
//     try {
//       await fetch(`${API}/order-to-tg`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user: user?.name || "Guest",
//           car: {
//             name: car.name,
//             brand: car.brand,
//             basePrice: car.price
//           },
//           configs: {
//             hp: selectedHp?.name,
//             tuning: selectedTuning?.name,
//             wheels: selectedWheels?.name,
//           },
//           totalAmount: totalPrice, // ОТПРАВЛЯЕМ СУММУ В ТГ
//         }),
//       });

//       alert(`Payment successful! Total: $${totalPrice} sent to Telegram 🚀`);
//       setShowPay(false);
//       navigate("/market");
//     } catch (err) {
//       alert("Payment error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050608] text-white font-sans relative">
//       <Navbar />

//       <button onClick={() => navigate("/market")} className="p-4 text-white/50 hover:text-yellow-400">
//         ← BACK
//       </button>

//       <h1 className="text-5xl font-black text-center text-yellow-400">
//         {car.brand} {car.name}
//       </h1>

//       <div className="flex justify-center mt-10">
//         <img src={car.image_url || car.image} className="max-w-[700px] drop-shadow-2xl" />
//       </div>

//       {/* ОТОБРАЖЕНИЕ ТЕКУЩЕЙ ЦЕНЫ */}
//       <div className="text-center mt-4">
//         <p className="text-2xl font-bold text-green-400">Total Price: ${totalPrice}</p>
//       </div>

//       <div className="flex justify-center gap-6 mt-10">
//         {/* HP */}
//         <div>
//           <p className="text-yellow-400 mb-2">POWER</p>
//           {configs.power?.map((c: any) => (
//             <button
//               key={c.id}
//               onClick={() => setSelectedHp(c)}
//               className={`block px-4 py-2 mb-2 rounded w-full ${selectedHp?.id === c.id ? "bg-yellow-500 text-black" : "bg-white/10"}`}
//             >
//               {c.name} (+${c.price || 0})
//             </button>
//           ))}
//         </div>

//         {/* TUNING */}
//         <div>
//           <p className="text-yellow-400 mb-2">TUNING</p>
//           {configs.tuning?.map((c: any) => (
//             <button
//               key={c.id}
//               onClick={() => setSelectedTuning(c)}
//               className={`block px-4 py-2 mb-2 rounded w-full ${selectedTuning?.id === c.id ? "bg-yellow-500 text-black" : "bg-white/10"}`}
//             >
//               {c.name} (+${c.price || 0})
//             </button>
//           ))}
//         </div>

//         {/* WHEELS */}
//         <div>
//           <p className="text-yellow-400 mb-2">WHEELS</p>
//           {configs.wheels?.map((c: any) => (
//             <button
//               key={c.id}
//               onClick={() => setSelectedWheels(c)}
//               className={`block px-4 py-2 mb-2 rounded w-full ${selectedWheels?.id === c.id ? "bg-yellow-500 text-black" : "bg-white/10"}`}
//             >
//               {c.name} (+${c.price || 0})
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-center mt-10">
//         <button
//           onClick={() => setShowPay(true)}
//           className="bg-yellow-500 text-black px-10 py-4 text-xl font-bold rounded-xl hover:bg-yellow-400 transition"
//         >
//           BUY NOW — ${totalPrice}
//         </button>
//       </div>

//       {/* PAYMENT MODAL */}
//       {showPay && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
//           <div className="bg-[#111] p-6 rounded-xl w-[350px] border border-yellow-500 shadow-2xl">
//             <h2 className="text-yellow-400 font-bold mb-4 text-center">ORDER PAYMENT</h2>
            
//             <div className="mb-4 text-sm bg-white/5 p-3 rounded">
//                 <p>Car: {car.brand} {car.name}</p>
//                 <p className="text-green-400 font-bold text-lg mt-2">Total: ${totalPrice}</p>
//             </div>

//             <input
//               placeholder="4444 4444 4444 4444"
//               className="w-full p-2 mb-2 bg-black border border-white/20 text-white rounded"
//             />
//             <input
//               placeholder="Card Holder Name"
//               className="w-full p-2 mb-4 bg-black border border-white/20 text-white rounded"
//             />

//             <div className="flex gap-2">
//                 <button
//                   onClick={() => setShowPay(false)}
//                   className="flex-1 bg-red-500/20 text-red-500 font-bold py-2 rounded"
//                 >
//                   CANCEL
//                 </button>
//                 <button
//                   onClick={completePayment}
//                   className="flex-[2] bg-green-500 text-black font-bold py-2 rounded hover:bg-green-400"
//                 >
//                   PAY ${totalPrice}
//                 </button>
//             </div>
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

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState<any>(null);
  const [allConfigs, setAllConfigs] = useState<any[]>([]); // Массив всех строк из global_car_configs

  const [selectedHp, setSelectedHp] = useState<any>(null);
  const [selectedTuning, setSelectedTuning] = useState<any>(null);
  const [selectedWheels, setSelectedWheels] = useState<any>(null);

  const [user, setUser] = useState<any>(null);
  const [showPay, setShowPay] = useState(false);

  // --- РАСЧЕТ ИТОГОВОЙ СУММЫ ---
  const totalPrice = 
    (Number(car?.price) || 0) + 
    (Number(selectedHp?.price) || 0) + 
    (Number(selectedTuning?.price) || 0) + 
    (Number(selectedWheels?.price) || 0);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      // 1. Загружаем машину
      const carRes = await fetch(`${API}/cars`);
      const carsData = await carRes.json();
      
      // Проверяем: если пришел объект с полем, берем массив оттуда, иначе считаем что это сам массив
      const carsArray = Array.isArray(carsData) ? carsData : (carsData.cars || carsData.data || []);
      const foundCar = carsArray.find((c: any) => c.id == id);
      setCar(foundCar);

      // 2. Загружаем конфиги
      const configRes = await fetch(`${API}/configs`);
      const configData = await configRes.json();
      
      // Важно: проверяем, что configData - это массив перед тем как делать find/filter
      const configsArray = Array.isArray(configData) ? configData : (configData.configs || configData.data || []);
      setAllConfigs(configsArray);

      // Устанавливаем дефолты только если массив не пустой
      if (configsArray.length > 0) {
        setSelectedHp(configsArray.find((i: any) => i.type === 'power' && i.price === 0));
        setSelectedTuning(configsArray.find((i: any) => i.type === 'tuning' && i.price === 0));
        setSelectedWheels(configsArray.find((i: any) => i.type === 'wheels' && i.price === 0));
      }

      // 3. Загружаем юзера
      const local = JSON.parse(localStorage.getItem("user") || "{}");
      if (local?.id) {
        const userRes = await fetch(`${API}/profile/${local.id}`);
        const userData = await userRes.json();
        setUser(userData);
      }
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    }
  };
  useEffect(() => {
    loadData();
  }, [id]);

  if (!car) return <div className="text-white text-center mt-20">Загрузка машины...</div>;

  const completePayment = async () => {
    try {
      await fetch(`${API}/order-to-tg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user?.name || "Alex",
          car_details: `${car.brand} ${car.name}`,
          specs: {
            engine: car.dvigatel,
            base_power: car.power
          },
          selected_options: {
            hp: selectedHp?.name,
            tuning: selectedTuning?.name,
            wheels: selectedWheels?.name,
          },
          total_price: totalPrice,
        }),
      });
      alert(`Заказ на сумму ${totalPrice} $ отправлен!`);
      setShowPay(false);
      navigate("/market");
    } catch (err) {
      alert("Ошибка оплаты");
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-6">
        <button onClick={() => navigate("/market")} className="text-white/40 hover:text-yellow-400 mb-6 transition">
          ← НАЗАД В МАРКЕТ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* ЛЕВАЯ ЧАСТЬ: ФОТО И ХАРАКТЕРИСТИКИ */}
          <div>
            <h1 className="text-5xl font-black text-yellow-400 uppercase italic mb-4">
              {car.brand} <span className="text-white">{car.name}</span>
            </h1>
            
            <img src={car.image_url} className="w-full rounded-3xl shadow-2xl border border-white/5 mb-8" alt="car" />

            <div className="grid grid-cols-2 gap-4">
              <SpecBox label="ДВИГАТЕЛЬ" value={car.dvigatel} color="text-blue-400" />
              <SpecBox label="МОЩНОСТЬ" value={`${car.power} HP`} color="text-red-400" />
              <SpecBox label="СКОРОСТЬ" value={`${car.speed} KM/H`} color="text-yellow-400" />
              <SpecBox label="ЦЕНА БАЗЫ" value={`${car.price.toLocaleString()} $`} color="text-green-400" />
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: КОНФИГУРАТОР */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-widest text-white/50 mb-4">CUSTOMIZATION</h3>
            
            <ConfigGroup 
              title="STAGE / POWER" 
              items={allConfigs.filter(i => i.type === 'power')} 
              selected={selectedHp} 
              onSelect={setSelectedHp} 
            />

            <ConfigGroup 
              title="VISUAL TUNING" 
              items={allConfigs.filter(i => i.type === 'tuning')} 
              selected={selectedTuning} 
              onSelect={setSelectedTuning} 
            />

            <ConfigGroup 
              title="WHEELS" 
              items={allConfigs.filter(i => i.type === 'wheels')} 
              selected={selectedWheels} 
              onSelect={setSelectedWheels} 
            />

            <div className="bg-yellow-500 p-6 rounded-2xl mt-10 shadow-lg shadow-yellow-500/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-black font-bold text-lg">ИТОГО К ОПЛАТЕ:</span>
                <span className="text-black font-black text-3xl">{totalPrice.toLocaleString()} $</span>
              </div>
              <button 
                onClick={() => setShowPay(true)}
                className="w-full bg-black text-white py-4 rounded-xl font-black uppercase hover:bg-neutral-900 transition"
              >
                КУПИТЬ МАШИНУ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL (как ты просил: Номер карты 1234...) */}
      {showPay && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="bg-[#111] p-8 rounded-3xl border border-yellow-500 w-full max-w-md mx-4">
            <h2 className="text-yellow-400 text-2xl font-black mb-6 text-center">CHECKOUT</h2>
            <div className="space-y-4 mb-8 text-white/80">
                <p className="flex justify-between border-b border-white/5 pb-2"><span>Car:</span> <span>{car.name}</span></p>
                <p className="flex justify-between border-b border-white/5 pb-2"><span>Config:</span> <span>{selectedHp?.name}</span></p>
                <p className="flex justify-between text-xl font-bold text-green-400 pt-2"><span>Total:</span> <span>{totalPrice} $</span></p>
            </div>
            
            <input placeholder="1234 5678 9101 1121" className="w-full bg-black border border-white/10 p-4 rounded-xl mb-3 outline-none focus:border-yellow-500" />
            <input placeholder="ALEX DEVELOPER" className="w-full bg-black border border-white/10 p-4 rounded-xl mb-6 outline-none focus:border-yellow-500" />
            
            <div className="flex gap-4">
              <button onClick={() => setShowPay(false)} className="flex-1 text-white/50 font-bold">CANCEL</button>
              <button onClick={completePayment} className="flex-[2] bg-green-500 text-black py-4 rounded-xl font-black hover:bg-green-400 transition">
                CONFIRM PAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Компонент для характеристик (Engine, Power, etc)
function SpecBox({ label, value, color }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
      <p className="text-[10px] text-white/40 font-bold mb-1 tracking-tighter">{label}</p>
      <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
  );
}

// Компонент для групп кнопок в конфиге
function ConfigGroup({ title, items, selected, onSelect }: any) {
  return (
    <div>
      <p className="text-[11px] font-black text-yellow-500 mb-3 ml-1 tracking-[3px] uppercase">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selected?.id === item.id 
              ? "border-yellow-500 bg-yellow-500/10 text-yellow-500" 
              : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
            }`}
          >
            <div className="text-xs font-bold uppercase">{item.name}</div>
            <div className="text-[10px] opacity-70">+{item.price} $</div>
          </button>
        ))}
      </div>
    </div>
  );
}