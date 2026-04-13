
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = import.meta.env.VITE_API_URL;

// export default function CarDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [car, setCar] = useState<any>(null);
//   const [configs, setConfigs] = useState<any>({});
//   const [selectedHp, setSelectedHp] = useState<any>(null);
//   const [selectedTuning, setSelectedTuning] = useState<any>(null);
//   const [selectedWheels, setSelectedWheels] = useState<any>(null);
//   const [user, setUser] = useState<any>(null);

//   /* ================= USER DATA ================= */
//   const loadUser = async () => {
//     const local = JSON.parse(localStorage.getItem("user") || "{}");
//     if (!local?.id) return;

//     try {
//       const res = await fetch(`${API}/profile/${local.id}`);
//       const data = await res.json();
//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
//     } catch (err) {
//       console.error("User load error:", err);
//     }
//   };

//   /* ================= CAR DATA ================= */
//   const loadCar = async () => {
//     try {
//       const res = await fetch(`${API}/cars`);
//       const data = await res.json();
//       setCar(data.find((c: any) => c.id == id));
//     } catch (err) {
//       console.error("Car load error:", err);
//     }
//   };

//   /* ================= CONFIGS DATA ================= */
//   const loadConfigs = async () => {
//     try {
//       const res = await fetch(`${API}/configs`);
//       const data = await res.json();
//       setConfigs(data);

//       setSelectedHp(data.power?.[0] || null);
//       setSelectedTuning(data.tuning?.[0] || null);
//       setSelectedWheels(data.wheels?.[0] || null);
//     } catch (err) {
//       console.error("Configs load error:", err);
//     }
//   };

//   useEffect(() => {
//     loadCar();
//     loadConfigs();
//     loadUser();
//   }, [id]);

//   if (!car || !configs.power) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   /* ================= PRICE CALCULATION ================= */
//   const base = Number(car.price || 0);
//   const hp = Number(selectedHp?.price || 0);
//   const tuning = Number(selectedTuning?.price || 0);
//   const wheels = Number(selectedWheels?.price || 0);
//   const configTotal = hp + tuning + wheels;

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
//   const discountedBase = discount > 0 && hasDiscount ? base - (base * discount) / 100 : base;
//   const totalPrice = Math.round(discountedBase + configTotal);

//   /* ================= BUY ACTION ================= */
//   const buyCar = async () => {
//     if (!user?.id) return alert("Login first");

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
//     <div className="min-h-screen bg-[#050608] text-white font-sans overflow-x-hidden relative">
      
//       {/* NAVBAR LAYER */}
//       <div className="relative z-[100]">
//         <Navbar />
//       </div>

//       {/* BACKGROUND DECORATIONS */}
//       <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1d26_0%,#050608_100%)] pointer-events-none z-0" />
//       <div className="absolute top-20 left-0 w-96 h-96 bg-yellow-500/5 blur-[120px] pointer-events-none" />

//       <div className="relative z-10 max-w-[1500px] mx-auto p-4 lg:p-8">
        
//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
//           <div className="animate-in slide-in-from-left duration-500">
//             <button
//               onClick={() => navigate("/market")}
//               className="mb-4 flex items-center gap-2 text-[10px] font-black italic uppercase tracking-[0.2em] text-white/30 hover:text-yellow-400 transition-colors"
//             >
//               <span className="text-lg">←</span> BACK TO MARKET
//             </button>
//             <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none filter drop-shadow-2xl">
//               {car.brand} <span className="text-yellow-500">{car.name}</span>
//             </h1>
//           </div>
          
//           <div className="bg-neutral-900/60 backdrop-blur-xl px-10 py-5 rounded-[2rem] border border-white/10 text-right shadow-2xl animate-in slide-in-from-right duration-500">
//             <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-1">Total Configuration</p>
//             <p className="text-5xl font-black italic text-yellow-400 tracking-tighter">
//               ${totalPrice.toLocaleString()}
//             </p>
//           </div>
//         </div>

//         {/* MAIN INTERFACE GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr_350px] gap-8 items-start mt-6">

//           {/* LEFT: SPECS */}
//           <div className="space-y-6 animate-in slide-in-from-left duration-700">
//             <div className="bg-gradient-to-br from-neutral-800/50 to-black p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-6xl font-black italic uppercase pointer-events-none">
//                 {car.brand}
//               </div>
//               <h3 className="text-yellow-500 font-black italic mb-8 uppercase tracking-[0.2em] text-xs flex items-center gap-3">
//                 <div className="w-8 h-[2px] bg-yellow-500"></div> PERFORMANCE
//               </h3>
//               <div className="space-y-6">
//                 {[
//                   { label: "ENGINE TYPE", value: car.dvigatel },
//                   { label: "HORSE POWER", value: `${car.power} HP` },
//                   { label: "MAX SPEED", value: `${car.speed} KM/H` },
//                   { label: "DRIVE TYPE", value: "AWD SYSTEM" }
//                 ].map((spec, i) => (
//                   <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
//                     <span className="text-[9px] font-black text-white/20 tracking-widest uppercase">{spec.label}</span>
//                     <span className="font-black italic text-xl tracking-tight text-white/90">{spec.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {hasDiscount && (
//               <div className="bg-green-500/10 border border-green-500/20 px-6 py-3 rounded-2xl backdrop-blur-md">
//                 <p className="text-green-400 font-black italic text-[10px] uppercase tracking-widest text-center">
//                    PROMO APPLIED: -{discount}% DISCOUNT
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* CENTER: CAR VIEW */}
//           <div className="relative flex flex-col items-center justify-center min-h-[500px] animate-in zoom-in duration-1000">
//             {/* Ground Glow */}
//             <div className="absolute bottom-20 w-[85%] h-[20%] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
            
//             <img
//               src={car.image_url}
//               className="w-full h-auto max-w-[800px] object-contain drop-shadow-[0_50px_60px_rgba(0,0,0,0.9)] transition-all duration-700 hover:scale-110"
//               alt={car.name}
//             />
            
//             {/* HUD Decoration */}
//             <div className="mt-12 flex gap-4 opacity-30">
//                <div className="w-2 h-2 bg-white rotate-45"></div>
//                <div className="w-2 h-2 bg-yellow-500 rotate-45"></div>
//                <div className="w-2 h-2 bg-white rotate-45"></div>
//             </div>
//           </div>

//           {/* RIGHT: CONFIGURATOR */}
//           <div className="space-y-4 animate-in slide-in-from-right duration-700">
//             <div className="bg-neutral-900/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 max-h-[750px] overflow-y-auto custom-scrollbar shadow-inner">
              
//               {/* CONFIG SECTIONS */}
//               {[
//                 { label: "Engine Stages", items: configs.power, state: selectedHp, setter: setSelectedHp },
//                 { label: "Body Kits", items: configs.tuning, state: selectedTuning, setter: setSelectedTuning },
//                 { label: "Rims & Wheels", items: configs.wheels, state: selectedWheels, setter: setSelectedWheels }
//               ].map((section, idx) => (
//                 <div key={idx} className="mb-10 last:mb-6">
//                   <p className="text-[10px] font-black text-yellow-500 mb-5 uppercase tracking-[0.3em] italic flex items-center gap-2">
//                     <span className="w-2 h-2 bg-yellow-500 rotate-45"></span> {section.label}
//                   </p>
//                   <div className="space-y-3">
//                     {section.items.map((c: any) => (
//                       <button
//                         key={c.id}
//                         onClick={() => section.setter(c)}
//                         className={`w-full flex justify-between items-center p-5 rounded-[1.25rem] border transition-all duration-300 ${
//                           section.state?.id === c.id
//                             ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_15px_30px_rgba(234,179,8,0.2)] scale-[1.03]"
//                             : "bg-white/5 border-white/5 hover:bg-white/10 text-white/70"
//                         }`}
//                       >
//                         <span className="text-xs font-black italic uppercase tracking-tighter">{c.name}</span>
//                         <span className={`text-[11px] font-black ${section.state?.id === c.id ? "text-black/50" : "text-yellow-500"}`}>
//                           +${c.price.toLocaleString()}
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               <button
//                 onClick={buyCar}
//                 className="w-full py-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-black font-black italic uppercase tracking-tighter rounded-[1.5rem] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all active:scale-95 text-2xl border-b-4 border-black/20"
//               >
//                 CONFIRM ORDER
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #facc15; }
        
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-in {
//           animation: fadeIn 0.5s ease-out fill-mode-forwards;
//         }
//       `}} />
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// const API = import.meta.env.VITE_API_URL;
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
  const [showPay, setShowPay] = useState(false);

  /* ================= USER ================= */
  const loadUser = async () => {
    const local = JSON.parse(localStorage.getItem("user") || "{}");
    if (!local?.id) return;

    const res = await fetch(`${API}/profile/${local.id}`);
    const data = await res.json();

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  /* ================= CAR ================= */
  const loadCar = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();
    setCar(data.find((c: any) => c.id == id));
  };

  /* ================= CONFIGS ================= */
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
  }, [id]);

  if (!car || !configs.power) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ================= PAY ACTION ================= */
  const completePayment = async () => {
    try {
      await fetch(`${API}/order-to-tg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user?.name,
          car: {
            name: car.name,
            brand: car.brand,
          },
          configs: {
            hp: selectedHp?.name,
            tuning: selectedTuning?.name,
            wheels: selectedWheels?.name,
          },
        }),
      });

      alert("Payment successful! Order sent to Telegram 🚀");
      setShowPay(false);
      navigate("/market");
    } catch (err) {
      alert("Payment error");
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans relative">

      <Navbar />

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/market")}
        className="p-4 text-white/50 hover:text-yellow-400"
      >
        ← BACK
      </button>

      {/* TITLE */}
      <h1 className="text-5xl font-black text-center text-yellow-400">
        {car.brand} {car.name}
      </h1>

      {/* CAR IMAGE */}
      <div className="flex justify-center mt-10">
        <img
          src={car.image_url || car.image}
          className="max-w-[700px] drop-shadow-2xl"
        />
      </div>

      {/* CONFIG */}
      <div className="flex justify-center gap-6 mt-10">

        {/* HP */}
        <div>
          <p className="text-yellow-400 mb-2">POWER</p>
          {configs.power?.map((c: any) => (
            <button
              key={c.id}
              onClick={() => setSelectedHp(c)}
              className={`block px-4 py-2 mb-2 rounded ${
                selectedHp?.id === c.id
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* TUNING */}
        <div>
          <p className="text-yellow-400 mb-2">TUNING</p>
          {configs.tuning?.map((c: any) => (
            <button
              key={c.id}
              onClick={() => setSelectedTuning(c)}
              className={`block px-4 py-2 mb-2 rounded ${
                selectedTuning?.id === c.id
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* WHEELS */}
        <div>
          <p className="text-yellow-400 mb-2">WHEELS</p>
          {configs.wheels?.map((c: any) => (
            <button
              key={c.id}
              onClick={() => setSelectedWheels(c)}
              className={`block px-4 py-2 mb-2 rounded ${
                selectedWheels?.id === c.id
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* BUY BUTTON */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => setShowPay(true)}
          className="bg-yellow-500 text-black px-10 py-4 text-xl font-bold rounded-xl"
        >
          BUY NOW
        </button>
      </div>

      {/* PAYMENT MODAL */}
      {showPay && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">

          <div className="bg-[#111] p-6 rounded-xl w-[350px] border border-yellow-500">

            <h2 className="text-yellow-400 font-bold mb-4">
              PAYMENT
            </h2>

            <input
              placeholder="Card Number"
              className="w-full p-2 mb-2 bg-black border border-white/20"
            />

            <input
              placeholder="Card Holder Name"
              className="w-full p-2 mb-4 bg-black border border-white/20"
            />

            <button
              onClick={completePayment}
              className="w-full bg-green-500 text-black font-bold py-2"
            >
              COMPLETE PAYMENT
            </button>

          </div>
        </div>
      )}

    </div>
  );
}