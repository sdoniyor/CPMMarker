
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

  /* ================= PROMO ================= */
  const activePromo = promoCodes.find(p =>
    p.type === "discount" &&
    Array.isArray(p.car_ids) &&
    p.car_ids.map(Number).includes(Number(id))
  );

  const discountValue = activePromo ? Number(activePromo.value) : 0;

  /* ================= PRICES ================= */

  const basePrice = Number(car?.price) || 0;

  // скидка ТОЛЬКО на машину
  const discountedBasePrice =
    discountValue > 0
      ? Math.floor(basePrice * (1 - discountValue / 100))
      : basePrice;

  // конфиги без скидки
  const configPrice =
    (Number(selectedHp?.price) || 0) +
    (Number(selectedTuning?.price) || 0) +
    (Number(selectedWheels?.price) || 0);

  const totalPrice = discountedBasePrice + configPrice;

  // для перечёркнутой цены
  const fullPrice = basePrice + configPrice;

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      const [carsRes, configRes, promoRes] = await Promise.all([
        fetch(`${API}/cars`),
        fetch(`${API}/global_car_configs`), // 👈 FIXED
        fetch(`${API}/promo_codes`)
      ]);

      const carsData = await carsRes.json();
      const configsData = await configRes.json();
      const promosData = await promoRes.json();

      const carsArray = Array.isArray(carsData) ? carsData : (carsData.data || []);
      const foundCar = carsArray.find((c: any) => c.id == id);
      setCar(foundCar);

      const configsArray = Array.isArray(configsData)
        ? configsData
        : (configsData.data || []);

      setAllConfigs(configsArray);

      setPromoCodes(Array.isArray(promosData) ? promosData : (promosData.data || []));

      // дефолты (0$)
      if (configsArray.length > 0) {
        setSelectedHp(configsArray.find((i: any) => i.type === "power" && Number(i.price) === 0));
        setSelectedTuning(configsArray.find((i: any) => i.type === "tuning" && Number(i.price) === 0));
        setSelectedWheels(configsArray.find((i: any) => i.type === "wheels" && Number(i.price) === 0));
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

  useEffect(() => {
    loadData();
  }, [id]);

  if (!car)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-tighter italic text-3xl">
        LOADING...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-4">
        <button
          onClick={() => navigate("/market")}
          className="text-white/20 hover:text-white mb-8 transition text-[10px] font-black uppercase tracking-[3px]"
        >
          ← BACK TO MARKET
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* ================= CAR ================= */}
          <div className="flex flex-col">
            <h1 className="text-6xl font-black italic uppercase leading-[0.8]">
              <span className="text-yellow-400 block text-3xl not-italic mb-2">
                {car.brand}
              </span>
              {car.name}
            </h1>

            <img
              src={car.image_url}
              className="w-full rounded-[2.5rem] mt-8"
              alt="car"
            />

            <div className="grid grid-cols-2 gap-4 mt-10">
              <SpecItem label="ENGINE" value={car.dvigatel} color="text-blue-400" />
              <SpecItem label="POWER" value={`${car.power} HP`} color="text-red-500" />
              <SpecItem label="SPEED" value={`${car.speed} KM/H`} color="text-yellow-400" />
              <SpecItem label="PRICE" value={`${car.price?.toLocaleString()} $`} color="text-green-500" />
            </div>
          </div>

          {/* ================= CONFIG ================= */}
          <div className="flex flex-col gap-10">
            <h3 className="text-white/20 font-black tracking-[5px] uppercase text-[11px]">
              Vehicle Configuration
            </h3>

            <ConfigGroup
              title="POWER"
              items={allConfigs.filter(i => i.type === "power")}
              selected={selectedHp}
              onSelect={setSelectedHp}
            />

            <ConfigGroup
              title="TUNING"
              items={allConfigs.filter(i => i.type === "tuning")}
              selected={selectedTuning}
              onSelect={setSelectedTuning}
            />

            <ConfigGroup
              title="WHEELS"
              items={allConfigs.filter(i => i.type === "wheels")}
              selected={selectedWheels}
              onSelect={setSelectedWheels}
            />

            {/* ================= PRICE ================= */}
            <div className="bg-yellow-500 rounded-[2.8rem] p-10 text-black">
              <div className="flex justify-between mb-6">
                <span className="font-black uppercase text-xs">TOTAL:</span>

                <div className="text-right">
                  {discountValue > 0 && (
                    <span className="block line-through opacity-40">
                      {fullPrice.toLocaleString()} $
                    </span>
                  )}

                  <span className="text-4xl font-black italic">
                    {totalPrice.toLocaleString()} $
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPay(true)}
                className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase"
              >
                BUY CAR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PAY ================= */}
      {showPay && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="bg-[#0a0a0a] p-10 rounded-3xl w-[400px]">
            <h2 className="text-yellow-400 text-2xl font-black mb-6 text-center">
              CHECKOUT
            </h2>

            <div className="text-center mb-6">
              <p>{car.name}</p>
              <p className="text-green-400 text-3xl font-black">
                {totalPrice.toLocaleString()} $
              </p>
            </div>

            <input
              placeholder="CARD NUMBER"
              className="w-full p-4 rounded-xl bg-white/5 text-center mb-4"
            />

            <button
              onClick={() => {
                alert("PURCHASE SUCCESS!");
                navigate("/market");
              }}
              className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black"
            >
              PAY
            </button>

            <button
              onClick={() => setShowPay(false)}
              className="w-full text-white/40 mt-4"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SPEC ================= */
function SpecItem({ label, value, color }: any) {
  return (
    <div className="bg-white/5 p-5 rounded-2xl">
      <p className="text-xs opacity-40">{label}</p>
      <p className={`font-black ${color}`}>{value}</p>
    </div>
  );
}

/* ================= CONFIG ================= */
function ConfigGroup({ title, items, selected, onSelect }: any) {
  if (!items?.length) return null;

  return (
    <div>
      <p className="text-yellow-500 text-xs mb-3">{title}</p>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-4 rounded-xl text-left ${
              selected?.id === item.id
                ? "bg-yellow-500 text-black"
                : "bg-white/5 text-white/40"
            }`}
          >
            <div className="font-black">{item.name}</div>
            <div className="text-xs">
              {Number(item.price) === 0
                ? "FREE"
                : `+${item.price.toLocaleString()} $`}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}