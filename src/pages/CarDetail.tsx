
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

  const [configs, setConfigs] = useState<any>({
    power: [],
    tuning: [],
    wheels: [],
  });

  const [user, setUser] = useState<any>(null);

  const [selectedHp, setSelectedHp] = useState<any>(null);
  const [selectedTuning, setSelectedTuning] = useState<any>(null);
  const [selectedWheels, setSelectedWheels] = useState<any>(null);

  const [showPay, setShowPay] = useState(false);

  /* ================= FETCH ================= */
  const safeFetch = async (url: string) => {
    try {
      const res = await fetch(url);
      const text = await res.text();
      if (!text || text.startsWith("<!DOCTYPE")) return null;
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  /* ================= LOAD ================= */
  const load = async () => {
    const [carsData, configsData] = await Promise.all([
      safeFetch(`${API}/cars`),
      safeFetch(`${API}/configs`),
    ]);

    const cars = Array.isArray(carsData) ? carsData : [];
    const foundCar = cars.find((c: any) => c.id == id);

    setCar(foundCar);
    setConfigs(configsData || { power: [], tuning: [], wheels: [] });

    const cfg = configsData || { power: [], tuning: [], wheels: [] };

    setSelectedHp(cfg.power?.find((i: any) => Number(i.price) === 0));
    setSelectedTuning(cfg.tuning?.find((i: any) => Number(i.price) === 0));
    setSelectedWheels(cfg.wheels?.find((i: any) => Number(i.price) === 0));

    const local = JSON.parse(localStorage.getItem("user") || "{}");

    if (local?.id) {
      const userRes = await fetch(`${API}/profile/${local.id}`);
      const userData = await userRes.json();
      setUser(userData);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-black text-3xl">
        LOADING...
      </div>
    );
  }

  /* ================= DISCOUNT LOGIC ================= */

  const discount = Number(user?.discount) || 0;
  const allowedCars: number[] = user?.discount_cars || [];

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

  return (
    <div className="min-h-screen bg-[#050608] text-white pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate("/market")}
          className="text-white/30 mb-6"
        >
          ← BACK
        </button>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* CAR */}
          <div>
            <h1 className="text-5xl font-black">
              {car.brand} {car.name}
            </h1>

            <img src={car.image_url} className="mt-6 rounded-3xl" />

            <div className="grid grid-cols-2 gap-3 mt-8">
              <SpecItem label="ENGINE" value={car.dvigatel} />
              <SpecItem label="POWER" value={`${car.power} HP`} />
              <SpecItem label="SPEED" value={`${car.speed} KM/H`} />
            </div>
          </div>

          {/* CONFIG */}
          <div>
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

            {/* TOTAL */}
            <div className="bg-yellow-500 text-black p-8 rounded-3xl mt-8">
              <div className="flex justify-between">
                <span className="font-black">TOTAL</span>

                <div className="text-right">
                  {finalDiscount > 0 && (
                    <div className="line-through opacity-60">
                      {basePrice.toLocaleString()} $
                    </div>
                  )}

                  <div className="text-3xl font-black">
                    {totalPrice.toLocaleString()} $
                  </div>
                </div>
              </div>

              {finalDiscount > 0 && (
                <div className="text-xs mt-2 font-bold opacity-70">
                  -{finalDiscount}% DISCOUNT ACTIVE
                </div>
              )}

              <button
                onClick={() => setShowPay(true)}
                className="w-full mt-6 bg-black text-white py-4 rounded-xl font-black"
              >
                BUY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PAY */}
      {showPay && (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="bg-[#111] p-8 rounded-3xl w-[380px]">
            <h2 className="text-yellow-400 mb-4">PAY</h2>

            <div className="text-green-400 text-2xl font-black mb-6">
              {totalPrice.toLocaleString()} $
            </div>

            <button
              onClick={() => {
                alert("SUCCESS");
                navigate("/market");
              }}
              className="w-full bg-yellow-500 text-black py-3 font-black rounded-xl"
            >
              CONFIRM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= UI ================= */

function SpecItem({ label, value }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-xl">
      <div className="text-white/40 text-xs">{label}</div>
      <div className="font-black">{value}</div>
    </div>
  );
}

function ConfigGroup({ title, items, selected, onSelect }: any) {
  if (!items?.length) return null;

  return (
    <div className="mb-6">
      <div className="text-yellow-500 text-xs mb-2">{title}</div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-xl ${
              selected?.id === item.id
                ? "bg-yellow-500 text-black"
                : "bg-white/5 text-white/50"
            }`}
          >
            <div className="font-black">{item.name}</div>
            <div className="text-xs">
              {Number(item.price) === 0 ? "FREE" : `+${item.price}$`}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}