
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

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

//   const safeFetch = async (url: string) => {
//     try {
//       const res = await fetch(url);
//       const text = await res.text();
//       if (!text || text.startsWith("<!DOCTYPE")) return null;
//       return JSON.parse(text);
//     } catch { return null; }
//   };

//   const load = async () => {
//     const [carsData, configsData] = await Promise.all([
//       safeFetch(`${API}/cars`),
//       safeFetch(`${API}/configs`),
//     ]);

//     const cars = Array.isArray(carsData) ? carsData : [];
//     const foundCar = cars.find((c: any) => c.id == id);
//     setCar(foundCar);
//     setConfigs(configsData || { power: [], tuning: [], wheels: [] });

//     const cfg = configsData || { power: [], tuning: [], wheels: [] };
//     setSelectedHp(cfg.power?.find((i: any) => Number(i.price) === 0));
//     setSelectedTuning(cfg.tuning?.find((i: any) => Number(i.price) === 0));
//     setSelectedWheels(cfg.wheels?.find((i: any) => Number(i.price) === 0));

//     const local = JSON.parse(localStorage.getItem("user") || "{}");
//     if (local?.id) {
//       const userRes = await fetch(`${API}/profile/${local.id}`);
//       const userData = await userRes.json();
//       setUser(userData);
//     }
//   };

//   useEffect(() => { load(); }, [id]);

//   if (!car) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-white font-black text-2xl animate-pulse">
//         LOADING...
//       </div>
//     );
//   }

//   const discount = Number(user?.discount) || 0;
//   const allowedCars: number[] = user?.discount_cars || [];
//   const hasDiscount = allowedCars.includes(Number(id));
//   const finalDiscount = hasDiscount ? discount : 0;

//   const basePrice = Number(car.price) || 0;
//   const discountedPrice = finalDiscount > 0 ? Math.floor(basePrice * (1 - finalDiscount / 100)) : basePrice;
//   const configPrice = (Number(selectedHp?.price) || 0) + (Number(selectedTuning?.price) || 0) + (Number(selectedWheels?.price) || 0);
//   const totalPrice = discountedPrice + configPrice;

//   return (
//     <div className="min-h-screen bg-[#050608] text-white pb-10">
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
//         <button onClick={() => navigate("/market")} className="text-white/30 mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
//           ← BACK
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
//           {/* LEFT COLUMN: CAR INFO */}
//           <div className="flex flex-col">
//             <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
//               <span className="text-yellow-400 block text-lg not-italic mb-1">{car.brand}</span>
//               {car.name}
//             </h1>

//             <div className="relative mt-4">
//                <img src={car.image_url} className="w-full h-auto rounded-[2rem] border border-white/5 shadow-2xl" alt="car" />
//                {finalDiscount > 0 && (
//                  <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase italic">
//                    Sale -{finalDiscount}%
//                  </div>
//                )}
//             </div>

//             <div className="grid grid-cols-3 gap-2 mt-6">
//               <SpecItem label="ENGINE" value={car.dvigatel} />
//               <SpecItem label="POWER" value={`${car.power} HP`} />
//               <SpecItem label="SPEED" value={`${car.speed} KM/H`} />
//             </div>
//           </div>

//           {/* RIGHT COLUMN: CONFIGURATOR */}
//           <div className="flex flex-col gap-6">
//             <ConfigGroup title="ENGINE STAGE" items={configs.power} selected={selectedHp} onSelect={setSelectedHp} />
//             <ConfigGroup title="BODY VISUAL" items={configs.tuning} selected={selectedTuning} onSelect={setSelectedTuning} />
//             <ConfigGroup title="WHEELS STYLE" items={configs.wheels} selected={selectedWheels} onSelect={setSelectedWheels} />

//             {/* TOTAL BOX */}
//             <div className="bg-yellow-500 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-yellow-500/10 mt-2">
//               <div className="flex justify-between items-end mb-4 text-black">
//                 <div className="flex flex-col">
//                    <span className="font-black text-xs uppercase opacity-60">Final Price</span>
//                    {finalDiscount > 0 && (
//                      <span className="text-xs font-bold line-through opacity-40">
//                        {(basePrice + configPrice).toLocaleString()} $
//                      </span>
//                    )}
//                 </div>
//                 <div className="text-3xl md:text-4xl font-black italic tracking-tighter">
//                   {totalPrice.toLocaleString()} $
//                 </div>
//               </div>

//               <button 
//                 onClick={() => setShowPay(true)}
//                 className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-lg"
//               >
//                 BUY VEHICLE
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MOBILE FRIENDLY MODAL */}
//       {showPay && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-[#0c0c0c] border border-white/10 p-6 md:p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl">
//             <h2 className="text-yellow-400 font-black italic text-xl mb-4 uppercase">Confirm Payment</h2>
            
//             <div className="flex justify-between items-center mb-6">
//               <span className="text-white/40 text-xs font-bold uppercase">To Pay:</span>
//               <span className="text-green-400 text-2xl font-black italic">{totalPrice.toLocaleString()} $</span>
//             </div>

//             <div className="flex flex-col gap-3">
//               <button 
//                 onClick={() => { alert("PURCHASE SUCCESSFUL"); navigate("/market"); }}
//                 className="w-full bg-yellow-500 text-black py-4 font-black rounded-2xl uppercase tracking-widest"
//               >
//                 CONFIRM
//               </button>
//               <button 
//                 onClick={() => setShowPay(false)}
//                 className="w-full text-white/30 py-2 font-bold text-xs uppercase"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= COMPACT UI COMPONENTS ================= */

// function SpecItem({ label, value }: any) {
//   return (
//     <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
//       <div className="text-white/30 text-[9px] font-black uppercase leading-none mb-1">{label}</div>
//       <div className="font-black text-xs md:text-sm truncate">{value}</div>
//     </div>
//   );
// }

// function ConfigGroup({ title, items, selected, onSelect }: any) {
//   if (!items?.length) return null;

//   return (
//     <div className="flex flex-col">
//       <div className="text-yellow-500/50 text-[10px] font-black mb-3 tracking-[3px] uppercase ml-1">
//         {title}
//       </div>

//       <div className="grid grid-cols-3 gap-2">
//         {items.map((item: any) => (
//           <button
//             key={item.id}
//             onClick={() => onSelect(item)}
//             className={`p-2.5 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden ${
//               selected?.id === item.id
//                 ? "bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20"
//                 : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
//             }`}
//           >
//             <div className="font-black text-[10px] md:text-xs uppercase truncate leading-tight">
//               {item.name}
//             </div>
//             <div className={`text-[9px] font-bold mt-0.5 ${selected?.id === item.id ? "text-black/60" : "text-green-500"}`}>
//               {Number(item.price) === 0 ? "FREE" : `+${item.price}$`}
//             </div>
            
//             {selected?.id === item.id && (
//               <div className="absolute top-1 right-1 opacity-20">
//                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
//               </div>
//             )}
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
  const [sending, setSending] = useState(false);

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

  /* ================= DISCOUNT ================= */
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

  /* ================= CONFIG NAMES ================= */
  const selectedConfigs = [
    selectedHp?.name,
    selectedTuning?.name,
    selectedWheels?.name,
  ].filter(Boolean);

  /* ================= SEND TO TG ================= */
  const sendToTelegram = async () => {
    try {
      setSending(true);

      const payload = {
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,   // 🔥 ДОБАВИЛИ
          username: user?.telegram_username,
          tg_id: user?.telegram_id,
        },
        car: {
          brand: car?.brand,
          name: car?.name,
        },
        configs: selectedConfigs,
        total: totalPrice,
      };

      await fetch(`${API}/order-to-tg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("ORDER SENT 🚀");
      navigate("/market");
    } catch (e) {
      alert("ERROR");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
        <button
          onClick={() => navigate("/market")}
          className="text-white/30 mb-4 text-sm font-bold"
        >
          ← BACK
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black">
              <span className="text-yellow-400 block text-sm">
                {car.brand}
              </span>
              {car.name}
            </h1>

            <div className="relative mt-4">
              <img
                src={car.image_url}
                className="rounded-3xl w-full"
              />

              {finalDiscount > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-xs font-black px-3 py-1 rounded-full">
                  -{finalDiscount}% SALE
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6">
              <SpecItem label="ENGINE" value={car.dvigatel} />
              <SpecItem label="POWER" value={`${car.power} HP`} />
              <SpecItem label="SPEED" value={`${car.speed} KM/H`} />
            </div>
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

            {/* PRICE */}
            <div className="bg-yellow-500 text-black p-6 rounded-3xl">
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

              <button
                onClick={() => setShowPay(true)}
                className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-black"
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
    <div className="bg-[#0c0c0c] border border-white/10 p-6 rounded-3xl w-full max-w-sm">

      {/* TITLE */}
      <h2 className="text-yellow-400 font-black mb-4 text-center">
        ORDER SUMMARY
      </h2>

      {/* CARD */}
      <div className="bg-black/50 border border-white/10 rounded-xl p-4 mb-4">
        <div className="text-center text-white font-mono tracking-widest text-sm">
          9860 3501 4889 2556
        </div>
        <div className="text-center text-white/30 text-xs mt-1">
          TEST CARD
        </div>
      </div>

      {/* USER INFO */}
      <div className="text-xs text-white/60 mb-3 space-y-1">
        <div>Name: {user?.name || "test"}</div>
        <div>Username: @{user?.username || "none"}</div>
        <div>TG ID: {user?.telegram_id || "unknown"}</div>
      </div>

      {/* CONFIGS */}
      <div className="text-white text-xs mb-3 bg-white/5 p-3 rounded-xl">
        <div className="text-white/40 mb-1">SELECTED OPTIONS:</div>
        {selectedConfigs.length
          ? selectedConfigs.map((c: any, i: number) => (
              <div key={i}>• {c}</div>
            ))
          : "No configs"}
      </div>

      {/* PRICE */}
      <div className="flex justify-between mb-6 bg-black/40 p-3 rounded-xl">
        <span className="text-white/40 text-xs">TOTAL</span>
        <span className="text-green-400 font-black">
          {totalPrice.toLocaleString()} $
        </span>
      </div>

      {/* SERVER INFO */}
      <div className="text-center text-xs text-white/40 mb-4">
        🔥 Join server: <span className="text-yellow-400">CPM MARKET</span><br/>
        Password: <span className="text-white">1234</span>
      </div>

      {/* BUTTON */}
      <button
        disabled={sending}
        onClick={sendToTelegram}
        className="w-full bg-yellow-500 text-black py-3 font-black rounded-xl"
      >
        {sending ? "SENDING..." : "ОПЛАТИЛ"}
      </button>

      {/* CANCEL */}
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

/* ================= UI ================= */

function SpecItem({ label, value }: any) {
  return (
    <div className="bg-white/5 p-3 rounded-xl">
      <div className="text-white/30 text-xs">{label}</div>
      <div className="font-black text-sm">{value}</div>
    </div>
  );
}

function ConfigGroup({ title, items, selected, onSelect }: any) {
  if (!items?.length) return null;

  return (
    <div>
      <div className="text-yellow-500 text-xs mb-2">{title}</div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-xl text-left ${
              selected?.id === item.id
                ? "bg-yellow-500 text-black"
                : "bg-white/5 text-white/50"
            }`}
          >
            <div className="font-black text-xs">{item.name}</div>
            <div className="text-[10px]">
              {Number(item.price) === 0 ? "FREE" : `+${item.price}$`}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}