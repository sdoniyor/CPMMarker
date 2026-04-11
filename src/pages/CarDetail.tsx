
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
//     setCar(data.find((c: any) => c.id == id));
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
//   }, []);

//   if (!car || !configs.power) {
//     return <div className="text-white p-10">Loading...</div>;
//   }

//   /* ================= PRICE ================= */

//   const base = Number(car.price || 0);

//   const hp = Number(selectedHp?.price || 0);
//   const tuning = Number(selectedTuning?.price || 0);
//   const wheels = Number(selectedWheels?.price || 0);

//   const configTotal = hp + tuning + wheels;

//   /* ================= DISCOUNT FIX ================= */

//   let discount = 0;
//   let discountCars: number[] = [];

//   try {
//     discount = Number(user?.discount || 0);

//     discountCars =
//       typeof user?.discount_cars === "string"
//         ? JSON.parse(user.discount_cars)
//         : user?.discount_cars || [];
//   } catch {
//     discount = 0;
//     discountCars = [];
//   }

//   const hasDiscount = discountCars.includes(Number(car.id));

//   const discountedBase =
//     discount > 0 && hasDiscount
//       ? base - (base * discount) / 100
//       : base;

//   const totalPrice = Math.round(discountedBase + configTotal);

//   /* ================= BUY ================= */
//   const buyCar = async () => {
//     const configIds = [
//       selectedHp?.id,
//       selectedTuning?.id,
//       selectedWheels?.id,
//     ].filter(Boolean);

//     const res = await fetch(`${API}/buy`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: user.id,
//         carId: car.id,
//         configIds,
//       }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert(`Bought for $${data.paid}`);
//       navigate("/market");
//     } else {
//       alert(data.error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-[#05070d] to-black text-white">
//       <Navbar />

//       <div className="max-w-7xl mx-auto p-6">

//         {/* BACK */}
//         <button
//           onClick={() => navigate("/market")}
//           className="mb-6 text-white/60 hover:text-yellow-400"
//         >
//           ← Back
//         </button>

//         {/* TITLE */}
//         <div className="text-center mb-6">
//           <h1 className="text-4xl font-bold text-yellow-400">
//             {car.name} {car.premium && "👑"}
//           </h1>
//           <p className="text-white/60">{car.brand}</p>
//         </div>

//         {/* GRID */}
//         <div className="grid grid-cols-[280px_1fr_280px] gap-6">

//           {/* LEFT */}
//           <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-2">
//             <p>Brand: {car.brand}</p>
//             <p>Engine: {car.dvigatel}</p>
//             <p>Power: {car.power}</p>
//             <p>Speed: {car.speed}</p>

//             <div className="border-t border-white/10 pt-3">
//               <p className="text-white/60">Base: ${base}</p>

//               {hasDiscount && discount > 0 && (
//                 <p className="text-green-400">
//                   Discount: -{discount}%
//                 </p>
//               )}

//               <p className="text-yellow-400 font-bold text-xl mt-2">
//                 TOTAL: ${totalPrice}
//               </p>
//             </div>
//           </div>

//           {/* CENTER */}
//           <div className="flex items-center justify-center bg-white/5 rounded-xl border border-white/10 p-4">
//             <img
//               src={car.image_url}
//               className="max-h-[420px] drop-shadow-2xl"
//             />
//           </div>

//           {/* RIGHT */}
//           <div className="bg-white/5 p-5 rounded-xl space-y-4">

//             <div>
//               <p className="text-xs text-white/40 mb-2">POWER</p>
//               {configs.power.map((c: any) => (
//                 <button
//                   key={c.id}
//                   onClick={() => setSelectedHp(c)}
//                   className={`w-full p-2 mb-2 rounded ${
//                     selectedHp?.id === c.id
//                       ? "bg-yellow-500 text-black"
//                       : "bg-white/10"
//                   }`}
//                 >
//                   {c.name} +${c.price}
//                 </button>
//               ))}
//             </div>

//             <div>
//               <p className="text-xs text-white/40 mb-2">TUNING</p>
//               {configs.tuning.map((c: any) => (
//                 <button
//                   key={c.id}
//                   onClick={() => setSelectedTuning(c)}
//                   className={`w-full p-2 mb-2 rounded ${
//                     selectedTuning?.id === c.id
//                       ? "bg-yellow-500 text-black"
//                       : "bg-white/10"
//                   }`}
//                 >
//                   {c.name} +${c.price}
//                 </button>
//               ))}
//             </div>

//             <div>
//               <p className="text-xs text-white/40 mb-2">WHEELS</p>
//               {configs.wheels.map((c: any) => (
//                 <button
//                   key={c.id}
//                   onClick={() => setSelectedWheels(c)}
//                   className={`w-full p-2 mb-2 rounded ${
//                     selectedWheels?.id === c.id
//                       ? "bg-yellow-500 text-black"
//                       : "bg-white/10"
//                   }`}
//                 >
//                   {c.name} +${c.price}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={buyCar}
//               className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400"
//             >
//               BUY CAR
//             </button>

//           </div>
//         </div>
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
  const [configs, setConfigs] = useState<any>({});

  const [selectedHp, setSelectedHp] = useState<any>(null);
  const [selectedTuning, setSelectedTuning] = useState<any>(null);
  const [selectedWheels, setSelectedWheels] = useState<any>(null);

  const [user, setUser] = useState<any>(null);

  const loadUser = async () => {
    const local = JSON.parse(localStorage.getItem("user") || "{}");
    if (!local?.id) return;
    const res = await fetch(`${API}/profile/${local.id}`);
    const data = await res.json();
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const loadCar = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();
    setCar(data.find((c: any) => c.id == id));
  };

  const loadConfigs = async () => {
    const res = await fetch(`${API}/configs`);
    const data = await res.json();
    setConfigs(data);
    setSelectedHp(data.power?.[0] || null);
    setSelectedTuning(data.tuning?.[0] || null);
    setSelectedWheels(data.wheels?.[0] || null);
  };

  useEffect(() => {
    loadCar();
    loadConfigs();
    loadUser();
  }, []);

  if (!car || !configs.power) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const base = Number(car.price || 0);
  const hp = Number(selectedHp?.price || 0);
  const tuning = Number(selectedTuning?.price || 0);
  const wheels = Number(selectedWheels?.price || 0);
  const configTotal = hp + tuning + wheels;

  let discount = 0;
  let discountCars: number[] = [];
  try {
    discount = Number(user?.discount || 0);
    discountCars = typeof user?.discount_cars === "string" ? JSON.parse(user.discount_cars) : user?.discount_cars || [];
  } catch {
    discount = 0;
    discountCars = [];
  }

  const hasDiscount = discountCars.includes(Number(car.id));
  const discountedBase = discount > 0 && hasDiscount ? base - (base * discount) / 100 : base;
  const totalPrice = Math.round(discountedBase + configTotal);

  const buyCar = async () => {
    const configIds = [selectedHp?.id, selectedTuning?.id, selectedWheels?.id].filter(Boolean);
    const res = await fetch(`${API}/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, carId: car.id, configIds }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`Bought for $${data.paid}`);
      navigate("/market");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white font-sans selection:bg-yellow-500 selection:text-black">
      <Navbar />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#1f2129_0%,#0b0c10_100%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-[1400px] mx-auto p-4 lg:p-8">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          <button
            onClick={() => navigate("/market")}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all font-bold italic text-sm"
          >
            ← EXIT TO MARKET
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              {car.brand} <span className="text-yellow-400">{car.name}</span> {car.premium && "👑"}
            </h1>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-6">

          {/* LEFT COLUMN: SPECS */}
          <div className="space-y-4 animate-in slide-in-from-left duration-500">
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-950 p-6 rounded-3xl border border-white/10 shadow-2xl">
              <h3 className="text-yellow-500 font-black italic mb-4 uppercase tracking-widest text-xs">Technical Specs</h3>
              <div className="space-y-4">
                {[
                  { label: "ENGINE", value: car.dvigatel },
                  { label: "POWER", value: `${car.power} HP` },
                  { label: "MAX SPEED", value: `${car.speed} KM/H` },
                  { label: "DRIVE", value: "AWD" }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-1">
                    <span className="text-[10px] font-bold text-white/40">{spec.label}</span>
                    <span className="font-black italic text-sm tracking-tight">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-500 p-6 rounded-3xl text-black shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              <p className="text-[10px] font-black uppercase opacity-60">Total Price</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black italic">${totalPrice.toLocaleString()}</span>
              </div>
              {hasDiscount && (
                <p className="text-[10px] font-bold mt-1 bg-black/10 px-2 py-0.5 rounded inline-block">
                  PROMO DISCOUNT: -{discount}%
                </p>
              )}
            </div>
          </div>

          {/* CENTER COLUMN: VISUAL */}
          <div className="relative group animate-in zoom-in duration-700">
            <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="flex items-center justify-center min-h-[400px]">
              <img
                src={car.image_url}
                className="w-full h-auto max-w-[650px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)] transform group-hover:scale-105 transition-transform duration-700"
                alt={car.name}
              />
            </div>
            {/* FLOATING BADGE */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black italic uppercase tracking-tighter">
                4K TEXTURES
              </div>
              <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black italic uppercase tracking-tighter">
                HIGH DETAIL
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONFIGURATOR */}
          <div className="space-y-4 animate-in slide-in-from-right duration-500">
            <div className="bg-neutral-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 max-h-[600px] overflow-y-auto custom-scrollbar">
              
              <div className="mb-6">
                <p className="text-[10px] font-black text-yellow-500 mb-3 uppercase tracking-widest italic">Engine Power</p>
                <div className="grid grid-cols-1 gap-2">
                  {configs.power.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedHp(c)}
                      className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                        selectedHp?.id === c.id
                          ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10 text-white"
                      }`}
                    >
                      <span className="text-xs font-black italic uppercase">{c.name}</span>
                      <span className="text-[10px] font-bold">+${c.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black text-yellow-500 mb-3 uppercase tracking-widest italic">Body Tuning</p>
                <div className="grid grid-cols-1 gap-2">
                  {configs.tuning.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedTuning(c)}
                      className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                        selectedTuning?.id === c.id
                          ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10 text-white"
                      }`}
                    >
                      <span className="text-xs font-black italic uppercase">{c.name}</span>
                      <span className="text-[10px] font-bold">+${c.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black text-yellow-500 mb-3 uppercase tracking-widest italic">Wheel Sets</p>
                <div className="grid grid-cols-1 gap-2">
                  {configs.wheels.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedWheels(c)}
                      className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
                        selectedWheels?.id === c.id
                          ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10 text-white"
                      }`}
                    >
                      <span className="text-xs font-black italic uppercase">{c.name}</span>
                      <span className="text-[10px] font-bold">+${c.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={buyCar}
                className="w-full py-4 bg-white text-black font-black italic uppercase tracking-tighter rounded-2xl hover:bg-yellow-400 transition-all active:scale-95 shadow-xl border-b-4 border-neutral-400"
              >
                CONFIRM PURCHASE
              </button>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #facc15; }
      `}} />
    </div>
  );
}