
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
  const [user, setUser] = useState<any>(null);

  const [selectedHp, setSelectedHp] = useState<any>(null);
  const [selectedTuning, setSelectedTuning] = useState<any>(null);
  const [selectedWheels, setSelectedWheels] = useState<any>(null);

  const [showPay, setShowPay] = useState(false);

  /* ================= РАСЧЕТ ЦЕНЫ ================= */
  // Цена без скидки
  const fullPrice = 
    (Number(car?.price) || 0) + 
    (Number(selectedHp?.price) || 0) + 
    (Number(selectedTuning?.price) || 0) + 
    (Number(selectedWheels?.price) || 0);

  // Применяем скидку (если у юзера есть поле discount, например 10 для 10%)
  const userDiscount = Number(user?.discount) || 0;
  const totalPrice = userDiscount > 0 
    ? Math.floor(fullPrice * (1 - userDiscount / 100)) 
    : fullPrice;

  /* ================= ЗАГРУЗКА ДАННЫХ ================= */
  const loadData = async () => {
    try {
      // 1. Машины
      const carRes = await fetch(`${API}/cars`);
      const carsData = await carRes.json();
      const carsArray = Array.isArray(carsData) ? carsData : (carsData.data || []);
      const foundCar = carsArray.find((c: any) => c.id == id);
      setCar(foundCar);

      // 2. Конфиги (global_car_configs)
      const configRes = await fetch(`${API}/configs`);
      const configData = await configRes.json();
      
      // Обработка разных форматов ответа API
      let configsArray: any[] = [];
      if (Array.isArray(configData)) {
        configsArray = configData;
      } else {
        configsArray = configData.configs || configData.data || [];
      }
      setAllConfigs(configsArray);

      // Установка дефолтов (Standart / 0$)
      if (configsArray.length > 0) {
        setSelectedHp(configsArray.find((i: any) => i.type === 'power' && Number(i.price) === 0));
        setSelectedTuning(configsArray.find((i: any) => i.type === 'tuning' && Number(i.price) === 0));
        setSelectedWheels(configsArray.find((i: any) => i.type === 'wheels' && Number(i.price) === 0));
      }

      // 3. Профиль пользователя для проверки скидки
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

  useEffect(() => {
    loadData();
  }, [id]);

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completePayment = async () => {
    try {
      await fetch(`${API}/order-to-tg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user?.name || "Player",
          car: `${car.brand} ${car.name}`,
          config: `${selectedHp?.name}, ${selectedTuning?.name}, ${selectedWheels?.name}`,
          amount: `${totalPrice} $`,
          discount_applied: `${userDiscount}%`
        }),
      });
      alert("Оплата успешно проведена! Заказ отправлен в TG.");
      setShowPay(false);
      navigate("/market");
    } catch (err) {
      alert("Ошибка при отправке заказа");
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-4">
        <button onClick={() => navigate("/market")} className="text-white/30 hover:text-yellow-400 mb-6 transition">
          ← НАЗАД В МАРКЕТ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* БЛОК МАШИНЫ */}
          <div>
            <h1 className="text-5xl font-black italic uppercase mb-2">
              <span className="text-yellow-400">{car.brand}</span> {car.name}
            </h1>
            <img src={car.image_url} className="w-full rounded-3xl shadow-2xl border border-white/5 mb-8" alt="car" />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/40 font-bold mb-1">ДВИГАТЕЛЬ</p>
                <p className="text-lg font-black text-blue-400 uppercase">{car.dvigatel}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/40 font-bold mb-1">МОЩНОСТЬ</p>
                <p className="text-lg font-black text-red-400">{car.power} HP</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/40 font-bold mb-1">СКОРОСТЬ</p>
                <p className="text-lg font-black text-yellow-400">{car.speed} KM/H</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/40 font-bold mb-1">ЦЕНА БАЗЫ</p>
                <p className="text-lg font-black text-green-400 uppercase">{car.price.toLocaleString()} $</p>
              </div>
            </div>
          </div>

          {/* КОНФИГУРАТОР */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white/30 font-bold tracking-[3px] uppercase text-sm">Customization</h3>
            
            <ConfigSection 
              title="Stage / Power" 
              items={allConfigs.filter(i => i.type === 'power')} 
              selected={selectedHp} 
              onSelect={setSelectedHp} 
            />

            <ConfigSection 
              title="Visual Tuning" 
              items={allConfigs.filter(i => i.type === 'tuning')} 
              selected={selectedTuning} 
              onSelect={setSelectedTuning} 
            />

            <ConfigSection 
              title="Wheels" 
              items={allConfigs.filter(i => i.type === 'wheels')} 
              selected={selectedWheels} 
              onSelect={setSelectedWheels} 
            />

            {/* ИТОГОВАЯ ПАНЕЛЬ */}
            <div className="mt-6 bg-yellow-500 rounded-3xl p-6 shadow-xl shadow-yellow-500/10">
              <div className="flex justify-between items-end mb-4 text-black">
                <span className="font-bold text-lg">ИТОГО К ОПЛАТЕ:</span>
                <div className="text-right">
                  {userDiscount > 0 && (
                    <span className="block text-black/40 line-through font-bold text-sm">
                      {fullPrice.toLocaleString()} $
                    </span>
                  )}
                  <span className="text-3xl font-black">{totalPrice.toLocaleString()} $</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowPay(true)}
                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-neutral-900 transition active:scale-95"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ОПЛАТА */}
      {showPay && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-yellow-500/50 p-8 rounded-[40px] w-full max-w-md shadow-2xl">
            <h2 className="text-yellow-400 text-2xl font-black mb-6 text-center italic uppercase">Payment Details</h2>
            
            <div className="bg-white/5 p-4 rounded-2xl mb-6 text-sm border border-white/5">
              <div className="flex justify-between mb-1"><span>Машина:</span> <span className="text-yellow-400">{car.name}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10 mt-2">
                <span>Сумма:</span> 
                <span className="text-green-400">{totalPrice.toLocaleString()} $</span>
              </div>
            </div>

            <div className="space-y-3">
              <input placeholder="4444 4444 4444 4444" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 transition" />
              <input placeholder="CARD HOLDER" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-400 transition" />
              
              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowPay(false)} className="flex-1 text-white/40 font-bold uppercase text-xs">Назад</button>
                <button onClick={completePayment} className="flex-[2] bg-green-500 text-black py-4 rounded-2xl font-black uppercase hover:bg-green-400">
                  Оплатить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigSection({ title, items, selected, onSelect }: any) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] font-black text-yellow-500/50 mb-3 tracking-[2px] uppercase">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selected?.id === item.id 
              ? "border-yellow-500 bg-yellow-500 text-black" 
              : "border-white/5 bg-white/5 text-white/50 hover:border-white/20"
            }`}
          >
            <div className="text-[11px] font-black uppercase truncate">{item.name}</div>
            <div className={`text-[10px] font-bold ${selected?.id === item.id ? "text-black/60" : "text-green-500"}`}>
              {Number(item.price) === 0 ? "FREE" : `+${item.price} $`}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}