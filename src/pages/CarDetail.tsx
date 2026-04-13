
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

  /* ================= ЛОГИКА СКИДКИ ================= */
  // Ищем промокод CAR50 или аналогичный, где в car_ids есть ID этой машины
  const activePromo = promoCodes.find(p => 
    p.type === 'discount' && 
    Array.isArray(p.car_ids) && 
    p.car_ids.map(Number).includes(Number(id))
  );

  const discountValue = activePromo ? Number(activePromo.value) : 0;

  // Полная цена (База + все допы)
  const fullPrice = 
    (Number(car?.price) || 0) + 
    (Number(selectedHp?.price) || 0) + 
    (Number(selectedTuning?.price) || 0) + 
    (Number(selectedWheels?.price) || 0);

  // Цена со скидкой
  const totalPrice = discountValue > 0 
    ? Math.floor(fullPrice * (1 - discountValue / 100)) 
    : fullPrice;

  /* ================= ЗАГРУЗКА ДАННЫХ ================= */
  const loadData = async () => {
    try {
      const [carsRes, configRes, promoRes] = await Promise.all([
        fetch(`${API}/cars`),
        fetch(`${API}/configs`),
        fetch(`${API}/promo_codes`)
      ]);

      const carsData = await carsRes.json();
      const configsData = await configRes.json();
      const promosData = await promoRes.json();

      const carsArray = Array.isArray(carsData) ? carsData : (carsData.data || []);
      const foundCar = carsArray.find((c: any) => c.id == id);
      setCar(foundCar);

      const configsArray = Array.isArray(configsData) ? configsData : (configsData.data || []);
      setAllConfigs(configsArray);

      setPromoCodes(Array.isArray(promosData) ? promosData : (promosData.data || []));

      // Установка дефолтов (Standart 0$)
      if (configsArray.length > 0) {
        setSelectedHp(configsArray.find((i: any) => i.type === 'power' && Number(i.price) === 0));
        setSelectedTuning(configsArray.find((i: any) => i.type === 'tuning' && Number(i.price) === 0));
        setSelectedWheels(configsArray.find((i: any) => i.type === 'wheels' && Number(i.price) === 0));
      }

      const local = JSON.parse(localStorage.getItem("user") || "{}");
      if (local?.id) {
        const uRes = await fetch(`${API}/profile/${local.id}`);
        const uData = await uRes.json();
        setUser(uData);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  if (!car) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-tighter italic text-3xl">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-4">
        <button onClick={() => navigate("/market")} className="text-white/20 hover:text-white mb-8 transition text-[10px] font-black uppercase tracking-[3px]">
          ← BACK TO MARKET
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* СЕКЦИЯ МАШИНЫ */}
          <div className="flex flex-col">
            <div className="mb-8">
               <h1 className="text-6xl font-black italic uppercase leading-[0.8]">
                <span className="text-yellow-400 block text-3xl not-italic mb-2 tracking-tight opacity-90">{car.brand}</span>
                {car.name}
              </h1>
            </div>
            
            <div className="relative group">
              <img src={car.image_url} className="w-full rounded-[2.5rem] shadow-2xl border border-white/5 relative z-10" alt="car" />
              <div className="absolute -inset-4 bg-yellow-500/5 blur-3xl rounded-full z-0 opacity-50"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <SpecItem label="ДВИГАТЕЛЬ" value={car.dvigatel} color="text-blue-400" />
              <SpecItem label="МОЩНОСТЬ" value={`${car.power} HP`} color="text-red-500" />
              <SpecItem label="СКОРОСТЬ" value={`${car.speed} KM/H`} color="text-yellow-400" />
              <SpecItem label="БАЗОВАЯ ЦЕНА" value={`${car.price?.toLocaleString()} $`} color="text-green-500" />
            </div>
          </div>

          {/* СЕКЦИЯ КОНФИГУРАТОРА */}
          <div className="flex flex-col gap-10">
            <h3 className="text-white/20 font-black tracking-[5px] uppercase text-[11px] border-l-2 border-yellow-500 pl-4">Vehicle Configuration</h3>
            
            <div className="space-y-8">
              <ConfigGroup title="STAGE / POWER" items={allConfigs.filter(i => i.type === 'power')} selected={selectedHp} onSelect={setSelectedHp} />
              <ConfigGroup title="VISUAL TUNING" items={allConfigs.filter(i => i.type === 'tuning')} selected={selectedTuning} onSelect={setSelectedTuning} />
              <ConfigGroup title="WHEELS" items={allConfigs.filter(i => i.type === 'wheels')} selected={selectedWheels} onSelect={setSelectedWheels} />
            </div>

            {/* ИТОГОВЫЙ БЛОК */}
            <div className="mt-6 bg-yellow-500 rounded-[2.8rem] p-10 shadow-2xl shadow-yellow-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                <svg width="100" height="100" fill="black" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>

              <div className="flex justify-between items-center mb-8 text-black relative z-10">
                <span className="font-black text-xs tracking-widest uppercase opacity-70">ИТОГО К ОПЛАТЕ:</span>
                <div className="text-right">
                  {discountValue > 0 && (
                    <span className="block text-black/40 line-through font-black text-xl leading-none mb-1">
                      {fullPrice.toLocaleString()} $
                    </span>
                  )}
                  <span className="text-5xl font-black leading-none tracking-tighter italic">
                    {totalPrice.toLocaleString()} $
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowPay(true)}
                className="w-full bg-black text-white py-6 rounded-[1.8rem] font-black uppercase tracking-[3px] hover:scale-[1.02] transition-all active:scale-95 shadow-2xl shadow-black/40 relative z-10"
              >
                КУПИТЬ МАШИНУ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ОПЛАТА */}
      {showPay && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-[#0a0a0a] border border-yellow-500/20 p-12 rounded-[4rem] w-full max-w-lg shadow-[0_0_100px_rgba(234,179,8,0.1)]">
            <h2 className="text-yellow-400 text-4xl font-black mb-10 text-center italic uppercase tracking-tighter">ОФОРМЛЕНИЕ</h2>
            <div className="space-y-5 mb-10">
               <div className="flex justify-between text-sm uppercase tracking-widest opacity-40 font-bold"><span>Модель:</span> <span className="text-white opacity-100">{car.name}</span></div>
               <div className="flex justify-between font-black text-4xl pt-8 border-t border-white/5 mt-6 text-green-400 italic">
                <span>К ОПЛАТЕ:</span> 
                <span>{totalPrice.toLocaleString()} $</span>
              </div>
            </div>
            <div className="space-y-4">
              <input placeholder="0000 0000 0000 0000" className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-yellow-500 text-center text-2xl tracking-[6px] font-black" />
              <button onClick={() => { alert("Успешно куплено!"); navigate("/market"); }} className="w-full bg-yellow-500 text-black py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-yellow-400 transition shadow-xl shadow-yellow-500/20 mt-4">
                ПОДТВЕРДИТЬ ОПЛАТУ
              </button>
              <button onClick={() => setShowPay(false)} className="w-full text-white/20 font-black uppercase text-[10px] tracking-[4px] mt-4 hover:text-white transition">ОТМЕНИТЬ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecItem({ label, value, color }: any) {
  return (
    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/[0.07] transition-colors">
      <p className="text-[10px] text-white/20 font-black mb-1 uppercase tracking-[2px]">{label}</p>
      <p className={`text-xl font-black ${color} truncate uppercase italic`}>{value}</p>
    </div>
  );
}

function ConfigGroup({ title, items, selected, onSelect }: any) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-[11px] font-black text-yellow-500/50 mb-4 tracking-[4px] uppercase">{title}</p>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-5 rounded-[1.8rem] border text-left transition-all duration-500 relative overflow-hidden group ${
              selected?.id === item.id 
              ? "border-yellow-500 bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" 
              : "border-white/5 bg-white/5 text-white/30 hover:border-white/20"
            }`}
          >
            <div className="text-[12px] font-black uppercase truncate relative z-10">{item.name}</div>
            <div className={`text-[11px] font-black mt-1 relative z-10 ${selected?.id === item.id ? "text-black/50" : "text-green-500"}`}>
              {Number(item.price) === 0 ? "DEFAULT" : `+${item.price.toLocaleString()} $`}
            </div>
            {selected?.id === item.id && (
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}