
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

//   const loadUser = async () => {
//     const local = JSON.parse(localStorage.getItem("user") || "{}");
//     if (!local?.id) return;
//     const res = await fetch(`${API}/profile/${local.id}`);
//     const data = await res.json();
//     setUser(data);
//     localStorage.setItem("user", JSON.stringify(data));
//   };

//   const loadCar = async () => {
//     const res = await fetch(`${API}/cars`);
//     const data = await res.json();
//     setCar(data.find((c: any) => c.id == id));
//   };

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
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   const base = Number(car.price || 0);
//   const hp = Number(selectedHp?.price || 0);
//   const tuning = Number(selectedTuning?.price || 0);
//   const wheels = Number(selectedWheels?.price || 0);
//   const configTotal = hp + tuning + wheels;

//   let discount = 0;
//   let discountCars: number[] = [];
//   try {
//     discount = Number(user?.discount || 0);
//     discountCars = typeof user?.discount_cars === "string" ? JSON.parse(user.discount_cars) : user?.discount_cars || [];
//   } catch {
//     discount = 0;
//     discountCars = [];
//   }

//   const hasDiscount = discountCars.includes(Number(car.id));
//   const discountedBase = discount > 0 && hasDiscount ? base - (base * discount) / 100 : base;
//   const totalPrice = Math.round(discountedBase + configTotal);

//   const buyCar = async () => {
//     const configIds = [selectedHp?.id, selectedTuning?.id, selectedWheels?.id].filter(Boolean);
//     const res = await fetch(`${API}/buy`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: user.id, carId: car.id, configIds }),
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
//     <div className="min-h-screen bg-[#0b0c10] text-white font-sans selection:bg-yellow-500 selection:text-black">
//       <Navbar />

//       {/* BACKGROUND EFFECTS */}
//       <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#1f2129_0%,#0b0c10_100%)] pointer-events-none" />
      
//       <div className="relative z-10 max-w-[1400px] mx-auto p-4 lg:p-8">
        
//         {/* TOP BAR */}
//         <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
//           <button
//             onClick={() => navigate("/market")}
//             className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all font-bold italic text-sm"
//           >
//             ← EXIT TO MARKET
//           </button>
//           <div className="text-right">
//             <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
//               {car.brand} <span className="text-yellow-400">{car.name}</span> {car.premium && "👑"}
//             </h1>
//           </div>
//         </div>

//         {/* MAIN LAYOUT */}
//         <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-6">

//           {/* LEFT COLUMN: SPECS */}
//           <div className="space-y-4 animate-in slide-in-from-left duration-500">
//             <div className="bg-gradient-to-br from-neutral-800 to-neutral-950 p-6 rounded-3xl border border-white/10 shadow-2xl">
//               <h3 className="text-yellow-500 font-black italic mb-4 uppercase tracking-widest text-xs">Technical Specs</h3>
//               <div className="space-y-4">
//                 {[
//                   { label: "ENGINE", value: car.dvigatel },
//                   { label: "POWER", value: `${car.power} HP` },
//                   { label: "MAX SPEED", value: `${car.speed} KM/H` },
//                   { label: "DRIVE", value: "AWD" }
//                 ].map((spec, i) => (
//                   <div key={i} className="flex justify-between items-end border-b border-white/5 pb-1">
//                     <span className="text-[10px] font-bold text-white/40">{spec.label}</span>
//                     <span className="font-black italic text-sm tracking-tight">{spec.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-yellow-500 p-6 rounded-3xl text-black shadow-[0_0_30px_rgba(234,179,8,0.3)]">
//               <p className="text-[10px] font-black uppercase opacity-60">Total Price</p>
//               <div className="flex items-baseline gap-1">
//                 <span className="text-3xl font-black italic">${totalPrice.toLocaleString()}</span>
//               </div>
//               {hasDiscount && (
//                 <p className="text-[10px] font-bold mt-1 bg-black/10 px-2 py-0.5 rounded inline-block">
//                   PROMO DISCOUNT: -{discount}%
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* CENTER COLUMN: VISUAL */}
//           <div className="relative group animate-in zoom-in duration-700">
//             <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
//             <div className="flex items-center justify-center min-h-[400px]">
//               <img
//                 src={car.image_url}
//                 className="w-full h-auto max-w-[650px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)] transform group-hover:scale-105 transition-transform duration-700"
//                 alt={car.name}
//               />
//             </div>
//             {/* FLOATING BADGE */}
//             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
//               <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black italic uppercase tracking-tighter">
//                 4K TEXTURES
//               </div>
//               <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black italic uppercase tracking-tighter">
//                 HIGH DETAIL
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: CONFIGURATOR */}
//           <div className="space-y-4 animate-in slide-in-from-right duration-500">
//             <div className="bg-neutral-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 max-h-[600px] overflow-y-auto custom-scrollbar">
              
//               <div className="mb-6">
//                 <p className="text-[10px] font-black text-yellow-500 mb-3 uppercase tracking-widest italic">Engine Power</p>
//                 <div className="grid grid-cols-1 gap-2">
//                   {configs.power.map((c: any) => (
//                     <button
//                       key={c.id}
//                       onClick={() => setSelectedHp(c)}
//                       className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
//                         selectedHp?.id === c.id
//                           ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
//                           : "bg-white/5 border-white/5 hover:bg-white/10 text-white"
//                       }`}
//                     >
//                       <span className="text-xs font-black italic uppercase">{c.name}</span>
//                       <span className="text-[10px] font-bold">+${c.price}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <p className="text-[10px] font-black text-yellow-500 mb-3 uppercase tracking-widest italic">Body Tuning</p>
//                 <div className="grid grid-cols-1 gap-2">
//                   {configs.tuning.map((c: any) => (
//                     <button
//                       key={c.id}
//                       onClick={() => setSelectedTuning(c)}
//                       className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
//                         selectedTuning?.id === c.id
//                           ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
//                           : "bg-white/5 border-white/5 hover:bg-white/10 text-white"
//                       }`}
//                     >
//                       <span className="text-xs font-black italic uppercase">{c.name}</span>
//                       <span className="text-[10px] font-bold">+${c.price}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <p className="text-[10px] font-black text-yellow-500 mb-3 uppercase tracking-widest italic">Wheel Sets</p>
//                 <div className="grid grid-cols-1 gap-2">
//                   {configs.wheels.map((c: any) => (
//                     <button
//                       key={c.id}
//                       onClick={() => setSelectedWheels(c)}
//                       className={`flex justify-between items-center p-3 rounded-xl border transition-all ${
//                         selectedWheels?.id === c.id
//                           ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
//                           : "bg-white/5 border-white/5 hover:bg-white/10 text-white"
//                       }`}
//                     >
//                       <span className="text-xs font-black italic uppercase">{c.name}</span>
//                       <span className="text-[10px] font-bold">+${c.price}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <button
//                 onClick={buyCar}
//                 className="w-full py-4 bg-white text-black font-black italic uppercase tracking-tighter rounded-2xl hover:bg-yellow-400 transition-all active:scale-95 shadow-xl border-b-4 border-neutral-400"
//               >
//                 CONFIRM PURCHASE
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #facc15; }
//       `}} />
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Убедись, что путь верный

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
    <div className="min-h-screen bg-[#0b0c10] text-white font-sans overflow-x-hidden">
      {/* Если ты хочешь кастомный Navbar прямо здесь, 
          можно использовать этот блок вместо <Navbar /> 
      */}
      <nav className="sticky top-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-black italic tracking-tighter cursor-pointer" onClick={() => navigate("/")}>
            CPM<span className="text-yellow-500">MARKET</span>
          </div>
          <div className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <span className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => navigate("/market")}>Market</span>
            <span className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => navigate("/inventory")}>Garage</span>
            <span className="hover:text-yellow-500 cursor-pointer transition-colors" onClick={() => navigate("/roulette")}>Roulette</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <div className="text-right">
            <p className="text-[8px] font-black text-white/30 uppercase leading-none">Your Balance</p>
            <p className="text-sm font-black italic text-yellow-400">${user?.money?.toLocaleString() || "0"}</p>
          </div>
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black italic shadow-[0_0_15px_rgba(234,179,8,0.4)]">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </nav>

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#1f2129_0%,#0b0c10_100%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-[1400px] mx-auto p-4 lg:p-8">
        
        {/* TOP BAR / BREADCRUMBS */}
        <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-white/10 to-transparent p-4 rounded-2xl border-l-4 border-yellow-500 backdrop-blur-md">
          <button
            onClick={() => navigate("/market")}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-lg transition-all font-black italic text-[10px] uppercase tracking-widest"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> EXIT TO MARKET
          </button>
          <div className="text-right">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              {car.brand} <span className="text-yellow-400">{car.name}</span>
            </h1>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-8">

          {/* LEFT COLUMN: SPECS */}
          <div className="space-y-6 animate-in slide-in-from-left duration-500">
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-950 p-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl font-black italic uppercase">{car.brand}</div>
              <h3 className="text-yellow-500 font-black italic mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-4 h-[2px] bg-yellow-500"></div> Technical Specs
              </h3>
              <div className="space-y-5">
                {[
                  { label: "ENGINE TYPE", value: car.dvigatel },
                  { label: "HORSE POWER", value: `${car.power} HP` },
                  { label: "TOP SPEED", value: `${car.speed} KM/H` },
                  { label: "TRANSMISSION", value: "AWD / RWD" }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-white/30 tracking-widest">{spec.label}</span>
                    <span className="font-black italic text-base tracking-tight text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-yellow-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 opacity-10"></div>
              <p className="text-[10px] font-black uppercase text-white/40 mb-1">Estimated Cost</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black italic text-yellow-400">${totalPrice.toLocaleString()}</span>
              </div>
              {hasDiscount && (
                <div className="mt-3 inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border border-green-500/30">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Personal Discount Applied: -{discount}%
                </div>
              )}
            </div>
          </div>

          {/* CENTER COLUMN: VISUAL */}
          <div className="relative flex flex-col items-center justify-center min-h-[500px] animate-in zoom-in duration-700">
            <div className="absolute w-[80%] h-[20%] bg-yellow-500/20 blur-[120px] bottom-20 rounded-full pointer-events-none" />
            
            <img
              src={car.image_url}
              className="w-full h-auto max-w-[700px] object-contain drop-shadow-[0_45px_50px_rgba(0,0,0,0.9)] transition-all duration-700 hover:rotate-[-2deg] hover:scale-110"
              alt={car.name}
            />
            
            {/* HUD ELEMENTS */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none border border-white/5 rounded-[3rem] hidden lg:block">
                <div className="absolute top-10 left-10 w-10 h-10 border-t-2 border-l-2 border-white/20"></div>
                <div className="absolute top-10 right-10 w-10 h-10 border-t-2 border-r-2 border-white/20"></div>
                <div className="absolute bottom-10 left-10 w-10 h-10 border-b-2 border-l-2 border-white/20"></div>
                <div className="absolute bottom-10 right-10 w-10 h-10 border-b-2 border-r-2 border-white/20"></div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONFIGURATOR */}
          <div className="space-y-4 animate-in slide-in-from-right duration-500">
            <div className="bg-neutral-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 max-h-[650px] overflow-y-auto custom-scrollbar shadow-2xl">
              
              <div className="mb-8">
                <p className="text-[10px] font-black text-yellow-500 mb-4 uppercase tracking-[0.2em] italic flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rotate-45"></span> Engine Stage
                </p>
                <div className="space-y-2">
                  {configs.power.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedHp(c)}
                      className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 ${
                        selectedHp?.id === c.id
                          ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_10px_20px_rgba(234,179,8,0.3)] scale-[1.02]"
                          : "bg-white/5 border-white/5 hover:border-white/20 text-white"
                      }`}
                    >
                      <span className="text-xs font-black italic uppercase tracking-tight">{c.name}</span>
                      <span className={`text-[10px] font-black ${selectedHp?.id === c.id ? "text-black/60" : "text-yellow-500"}`}>+${c.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black text-yellow-500 mb-4 uppercase tracking-[0.2em] italic flex items-center gap-2">
                   <span className="w-2 h-2 bg-yellow-500 rotate-45"></span> Visual Tuning
                </p>
                <div className="space-y-2">
                  {configs.tuning.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedTuning(c)}
                      className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 ${
                        selectedTuning?.id === c.id
                          ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_10px_20px_rgba(234,179,8,0.3)] scale-[1.02]"
                          : "bg-white/5 border-white/5 hover:border-white/20 text-white"
                      }`}
                    >
                      <span className="text-xs font-black italic uppercase tracking-tight">{c.name}</span>
                      <span className={`text-[10px] font-black ${selectedTuning?.id === c.id ? "text-black/60" : "text-yellow-500"}`}>+${c.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black text-yellow-500 mb-4 uppercase tracking-[0.2em] italic flex items-center gap-2">
                   <span className="w-2 h-2 bg-yellow-500 rotate-45"></span> Wheel Shop
                </p>
                <div className="space-y-2">
                  {configs.wheels.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedWheels(c)}
                      className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 ${
                        selectedWheels?.id === c.id
                          ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_10px_20px_rgba(234,179,8,0.3)] scale-[1.02]"
                          : "bg-white/5 border-white/5 hover:border-white/20 text-white"
                      }`}
                    >
                      <span className="text-xs font-black italic uppercase tracking-tight">{c.name}</span>
                      <span className={`text-[10px] font-black ${selectedWheels?.id === c.id ? "text-black/60" : "text-yellow-500"}`}>+${c.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={buyCar}
                className="w-full py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black italic uppercase tracking-tighter rounded-3xl hover:shadow-[0_0_40px_rgba(234,179,8,0.5)] transition-all active:scale-95 text-xl border-b-4 border-orange-700"
              >
                BUY NOW
              </button>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #facc15; }
      `}} />
    </div>
  );
}