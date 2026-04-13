
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
  const [allConfigs, setAllConfigs] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [selectedHp, setSelectedHp] = useState<any>(null);
  const [selectedTuning, setSelectedTuning] = useState<any>(null);
  const [selectedWheels, setSelectedWheels] = useState<any>(null);

  const [showPay, setShowPay] = useState(false);

  /* ================= РАСЧЕТ СКИДКИ ================= */
  // Ищем промокод типа discount, где в массиве car_ids есть ID текущей машины
  const activePromo = promoCodes.find(p => 
    p.type === 'discount' && 
    Array.isArray(p.car_ids) && 
    p.car_ids.map(Number).includes(Number(id))
  );

  const discountValue = activePromo ? Number(activePromo.value) : 0;

  const fullPrice = 
    (Number(car?.price) || 0) + 
    (Number(selectedHp?.price) || 0) + 
    (Number(selectedTuning?.price) || 0) + 
    (Number(selectedWheels?.price) || 0);

  const totalPrice = discountValue > 0 
    ? Math.floor(fullPrice * (1 - discountValue / 100)) 
    : fullPrice;

  /* ================= ЗАГРУЗКА ДАННЫХ ================= */
  const loadData = async () => {
    try {
      // 1. Загрузка машины
      const carRes = await fetch(`${API}/cars`);
      const carsData = await carRes.json();
      const carsArray = Array.isArray(carsData) ? carsData : (carsData.data || []);
      const foundCar = carsArray.find((c: any) => c.id == id);
      setCar(foundCar);

      // 2. Загрузка конфигов (global_car_configs)
      const configRes = await fetch(`${API}/configs`);
      const configData = await configRes.json();
      const configsArray = Array.isArray(configData) ? configData : (configData.data || []);
      setAllConfigs(configsArray);

      // Установка дефолтов (Standart с ценой 0)
      if (configsArray.length > 0) {
        setSelectedHp(configsArray.find((i: any) => i.type === 'power' && Number(i.price) === 0) || configsArray.find(i => i.type === 'power'));
        setSelectedTuning(configsArray.find((i: any) => i.type === 'tuning' && Number(i.price) === 0) || configsArray.find(i => i.type === 'tuning'));
        setSelectedWheels(configsArray.find((i: any) => i.type === 'wheels' && Number(i.price) === 0) || configsArray.find(i => i.type === 'wheels'));
      }

      // 3. Загрузка промокодов
      const promoRes = await fetch(`${API}/promo_codes`);
      const promoData = await promoRes.json();
      setPromoCodes(Array.isArray(promoData) ? promoData : (promoData.data || []));

      // 4. Загрузка юзера
      const local = JSON.parse(localStorage.getItem("user") || "{}");
      if (local?.id) {
        const userRes = await fetch(`${API}/profile/${local.id}`);
        const userData = await userRes.json();
        setUser(userData);
      }
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  if (!car) return <div className="min-h-screen bg-black flex items-center justify-center text-white">ЗАГРУЗКА...</div>;

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-4">
        <button onClick={() => navigate("/market")} className="text-white/30 hover:text-yellow-400 mb-6 transition text-xs uppercase tracking-widest">
          ← BACK TO MARKET
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* ЛЕВАЯ КОЛОНКА: ИНФО */}
          <div>
            <div className="mb-6">
              <h1 className="text-5xl font-black italic uppercase leading-none">
                <span className="text-yellow-400 block text-2xl not-italic mb-1">{car.brand}</span>
                {car.name}
              </h1>
              {discountValue > 0 && (
                <div className="mt-3 inline-block bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  SALE {discountValue}% ACTIVE
                </div>
              )}
            </div>
            
            <img src={car.image_url} className="w-full rounded-[2rem] shadow-2xl border border-white/5 mb-8" alt="car" />

            <div className="grid grid-cols-2 gap-4">
              <SpecBox label="ДВИГАТЕЛЬ" value={car.dvigatel} color="text-blue-400" />
              <SpecBox label="МОЩНОСТЬ" value={`${car.power} HP`} color="text-red-500" />
              <SpecBox label="СКОРОСТЬ" value={`${car.speed} KM/H`} color="text-yellow-400" />
              <SpecBox label="БАЗОВАЯ ЦЕНА" value={`${car.price?.toLocaleString()} $`} color="text-green-500" />
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: КАСТОМИЗАЦИЯ */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white/20 font-bold tracking-[4px] uppercase text-[10px]">Vehicle Configuration</h3>
            
            <ConfigSection title="Stage / Power" items={allConfigs.filter(i => i.type === 'power')} selected={selectedHp} onSelect={setSelectedHp} />
            <ConfigSection title="Visual Tuning" items={allConfigs.filter(i => i.type === 'tuning')} selected={selectedTuning} onSelect={setSelectedTuning} />
            <ConfigSection title="Wheels" items={allConfigs.filter(i => i.type === 'wheels')} selected={selectedWheels} onSelect={setSelectedWheels} />

            {/* ИТОГО */}
            <div className="mt-4 bg-yellow-500 rounded-[2.5rem] p-8 shadow-2xl shadow-yellow-500/10">
              <div className="flex justify-between items-end mb-6 text-black">
                <span className="font-bold text-sm tracking-widest uppercase opacity-60">Итого к оплате:</span>
                <div className="text-right">
                  {discountValue > 0 && (
                    <span className="block text-black/40 line-through font-bold text-lg leading-none">
                      {fullPrice.toLocaleString()} $
                    </span>
                  )}
                  <span className="text-4xl font-black leading-none tracking-tighter">
                    {totalPrice.toLocaleString()} $
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowPay(true)}
                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[2px] hover:scale-[1.02] transition active:scale-95 shadow-xl shadow-black/20"
              >
                ОФОРМИТЬ ПОКУПКУ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showPay && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] border border-yellow-500/30 p-10 rounded-[3rem] w-full max-w-md shadow-2xl">
            <h2 className="text-yellow-400 text-2xl font-black mb-8 text-center italic uppercase tracking-tighter">Оплата заказа</h2>
            <div className="space-y-4 mb-8">
               <div className="flex justify-between text-sm"><span className="opacity-40 font-bold uppercase tracking-widest text-[10px]">Автомобиль</span> <span className="font-bold">{car.name}</span></div>
               <div className="flex justify-between font-black text-3xl pt-6 border-t border-white/5 mt-4 text-green-400">
                <span>ИТОГО:</span> 
                <span>{totalPrice.toLocaleString()} $</span>
              </div>
            </div>
            <div className="space-y-4">
              <input placeholder="0000 0000 0000 0000" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-yellow-500 text-center text-xl tracking-[4px]" />
              <button onClick={() => { alert("Успешно!"); setShowPay(false); navigate("/market"); }} className="w-full bg-green-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-green-400 transition">
                ПОДТВЕРДИТЬ
              </button>
              <button onClick={() => setShowPay(false)} className="w-full text-white/20 font-bold uppercase text-[10px] tracking-widest mt-2">ОТМЕНА</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecBox({ label, value, color }: any) {
  return (
    <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
      <p className="text-[9px] text-white/30 font-bold mb-1 uppercase tracking-widest">{label}</p>
      <p className={`text-lg font-black ${color} truncate uppercase italic`}>{value}</p>
    </div>
  );
}

function ConfigSection({ title, items, selected, onSelect }: any) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-black text-yellow-500 mb-3 tracking-[3px] uppercase ml-1">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
              selected?.id === item.id 
              ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.1)]" 
              : "border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:text-white"
            }`}
          >
            <div className="text-xs font-black uppercase truncate mb-1">{item.name}</div>
            <div className={`text-[10px] font-bold ${selected?.id === item.id ? "text-yellow-200" : "text-green-500"}`}>
              {Number(item.price) === 0 ? "FREE" : `+${item.price.toLocaleString()} $`}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}