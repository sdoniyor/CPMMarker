
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
  const [configs, setConfigs] = useState<any>({}); // Данные из global_car_configs

  const [selectedHp, setSelectedHp] = useState<any>(null);
  const [selectedTuning, setSelectedTuning] = useState<any>(null);
  const [selectedWheels, setSelectedWheels] = useState<any>(null);

  const [user, setUser] = useState<any>(null);
  const [showPay, setShowPay] = useState(false);

  // --- РАСЧЕТ ИТОГОВОЙ СУММЫ ---
  // Берем цену из таблицы cars + цены выбранных опций из global_car_configs
  const totalPrice = 
    (Number(car?.price) || 0) + 
    (Number(selectedHp?.price) || 0) + 
    (Number(selectedTuning?.price) || 0) + 
    (Number(selectedWheels?.price) || 0);

  const loadUser = async () => {
    const local = JSON.parse(localStorage.getItem("user") || "{}");
    if (!local?.id) return;
    const res = await fetch(`${API}/profile/${local.id}`);
    const data = await res.json();
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  /* ================= LOAD FROM 'cars' ================= */
  const loadCar = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();
    const foundCar = data.find((c: any) => c.id == id);
    setCar(foundCar);
  };

  /* ================= LOAD FROM 'global_car_configs' ================= */
  const loadConfigs = async () => {
    const res = await fetch(`${API}/configs`); // Предполагаем, что этот роут отдает global_car_configs
    const data = await res.json();
    setConfigs(data);

    // Устанавливаем первые элементы по умолчанию
    if (data.power) setSelectedHp(data.power[0]);
    if (data.tuning) setSelectedTuning(data.tuning[0]);
    if (data.wheels) setSelectedWheels(data.wheels[0]);
  };

  useEffect(() => {
    loadCar();
    loadConfigs();
    loadUser();
  }, [id]);

  if (!car || !configs.power) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ================= ОТПРАВКА В ТЕЛЕГРАМ ================= */
  const completePayment = async () => {
    try {
      await fetch(`${API}/order-to-tg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user?.name || "Аноним",
          car_info: {
            brand: car.brand,
            name: car.name,
            base_price: car.price
          },
          selected_configs: {
            power: selectedHp?.name,
            tuning: selectedTuning?.name,
            wheels: selectedWheels?.name,
          },
          final_price: totalPrice, // Передаем итоговую сумму
        }),
      });

      alert(`Оплата прошла успешно! Сумма: ${totalPrice} отправлена в Telegram`);
      setShowPay(false);
      navigate("/market");
    } catch (err) {
      alert("Ошибка при оплате");
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans">
      <Navbar />

      <button onClick={() => navigate("/market")} className="p-4 text-white/50 hover:text-yellow-400">
        ← НАЗАД В МАРКЕТ
      </button>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-black text-center text-yellow-400 uppercase">
          {car.brand} {car.name}
        </h1>

        <div className="flex justify-center mt-8">
          <img src={car.image_url || car.image} className="max-w-full h-auto drop-shadow-[0_20px_50px_rgba(234,179,8,0.2)]" />
        </div>

        {/* ДИНАМИЧЕСКИЕ КОНФИГИ ИЗ БД */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* POWER */}
          <ConfigSection 
            title="МОЩНОСТЬ" 
            items={configs.power} 
            selected={selectedHp} 
            onSelect={setSelectedHp} 
          />
          {/* TUNING */}
          <ConfigSection 
            title="ТЮНИНГ" 
            items={configs.tuning} 
            selected={selectedTuning} 
            onSelect={setSelectedTuning} 
          />
          {/* WHEELS */}
          <ConfigSection 
            title="КОЛЕСА" 
            items={configs.wheels} 
            selected={selectedWheels} 
            onSelect={setSelectedWheels} 
          />
        </div>

        {/* ИТОГОВАЯ КНОПКА */}
        <div className="flex flex-col items-center mt-12 pb-20">
            <div className="text-3xl font-bold mb-4 text-green-400">
                Итого: {totalPrice.toLocaleString()} $
            </div>
            <button
              onClick={() => setShowPay(true)}
              className="bg-yellow-500 text-black px-12 py-4 text-2xl font-black rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20"
            >
              КУПИТЬ СЕЙЧАС
            </button>
        </div>
      </div>

      {/* МОДАЛКА ОПЛАТЫ */}
      {showPay && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border-2 border-yellow-500 p-8 rounded-3xl w-full max-w-md">
            <h2 className="text-yellow-400 text-2xl font-bold mb-6 text-center">ОФОРМЛЕНИЕ ЗАКАЗА</h2>
            
            <div className="space-y-2 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="flex justify-between"><span>Машина:</span> <span>{car.name}</span></p>
                <p className="flex justify-between text-white/60 text-sm"><span>Конфиг:</span> <span>{selectedHp?.name}, {selectedTuning?.name}</span></p>
                <div className="border-t border-white/10 mt-2 pt-2 flex justify-between font-bold text-xl text-green-400">
                    <span>К оплате:</span>
                    <span>{totalPrice.toLocaleString()} $</span>
                </div>
            </div>

            <div className="space-y-4">
                <input placeholder="1234 5678 1234 5678" className="w-full p-4 bg-black border border-white/20 rounded-xl outline-none focus:border-yellow-500" />
                <input placeholder="Имя владельца" className="w-full p-4 bg-black border border-white/20 rounded-xl outline-none focus:border-yellow-500" />
                
                <div className="flex gap-4 mt-6">
                    <button onClick={() => setShowPay(false)} className="flex-1 py-4 font-bold text-white/50 hover:text-white transition">ОТМЕНА</button>
                    <button onClick={completePayment} className="flex-[2] bg-green-500 text-black py-4 rounded-xl font-bold hover:bg-green-400 transition">
                        ОПЛАТИТЬ
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Вспомогательный компонент для секций конфига
function ConfigSection({ title, items, selected, onSelect }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
      <p className="text-yellow-400 font-bold mb-4 tracking-widest text-center">{title}</p>
      <div className="space-y-2">
        {items?.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full p-3 rounded-xl text-sm font-medium transition-all ${
              selected?.id === item.id 
              ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" 
              : "bg-white/5 hover:bg-white/10 text-white/70"
            }`}
          >
            <div className="flex justify-between">
                <span>{item.name}</span>
                <span className={selected?.id === item.id ? "text-black/60" : "text-green-500"}>
                    +{item.price || 0} $
                </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}