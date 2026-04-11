
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

//   /* ================= PRICES ================= */
//   const basePrice = Number(car.price || 0);

//   const hpPrice = Number(selectedHp?.price || 0);
//   const tuningPrice = Number(selectedTuning?.price || 0);
//   const wheelsPrice = Number(selectedWheels?.price || 0);

//   let totalPrice = basePrice + hpPrice + tuningPrice + wheelsPrice;

//   const discount = Number(user?.discount || 0);

//   if (discount > 0) {
//     totalPrice -= (totalPrice * discount) / 100;
//   }

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

//         {/* BACK BUTTON */}
//         <button
//           onClick={() => navigate("/market")}
//           className="mb-6 text-white/60 hover:text-yellow-400 transition"
//         >
//           ← Back to market
//         </button>

//         {/* TITLE */}
//         <div className="text-center mb-6">
//           <h1 className="text-4xl font-extrabold text-yellow-400 tracking-widest">
//             {car.name}{" "}
//             {car.premium && <span className="text-yellow-300">👑</span>}
//           </h1>

//           <p className="text-white/60">{car.brand}</p>
//         </div>

//         {/* GRID */}
//         <div className="grid grid-cols-[280px_1fr_280px] gap-6">

//           {/* LEFT INFO */}
//           <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">

//             <h2 className="text-xs text-white/40">CAR INFO</h2>

//             <p>🏷 Brand: {car.brand}</p>
//             <p>⚙ Engine: {car.dvigatel}</p>
//             <p>🔥 Power: {car.power}</p>
//             <p>🏎 Speed: {car.speed}</p>

//             <div className="pt-2 border-t border-white/10">
//               <p className="text-white/60">Base price</p>
//               <p className="text-white font-bold">${basePrice}</p>
//             </div>

//             {discount > 0 && (
//               <p className="text-green-400">
//                 Discount: -{discount}%
//               </p>
//             )}

//             <div className="text-yellow-400 font-bold text-xl">
//               TOTAL: ${Math.floor(totalPrice)}
//             </div>
//           </div>

//           {/* CENTER IMAGE */}
//           <div className="flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 p-4">
//             <img
//               src={car.image_url}
//               className="max-h-[420px] drop-shadow-2xl"
//             />
//           </div>

//           {/* RIGHT CONFIG */}
//           <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4">

//             {/* POWER */}
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

//             {/* TUNING */}
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

//             {/* WHEELS */}
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

//             {/* BUY */}
//             <button
//               onClick={buyCar}
//               className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
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
  }, []);

  if (!car || !configs.power) {
    return <div className="text-white p-10">Loading...</div>;
  }

  /* ================= PRICES ================= */

  const base = Number(car.price || 0);

  const hp = Number(selectedHp?.price || 0);
  const tuning = Number(selectedTuning?.price || 0);
  const wheels = Number(selectedWheels?.price || 0);

  const configTotal = hp + tuning + wheels;

  const discount = Number(user?.discount || 0);

  // 🔥 DISCOUNT ONLY FOR BASE PRICE
  const discountedBase =
    discount > 0 ? base - (base * discount) / 100 : base;

  const totalPrice = Math.round(discountedBase + configTotal);

  /* ================= BUY ================= */
  const buyCar = async () => {
    const configIds = [
      selectedHp?.id,
      selectedTuning?.id,
      selectedWheels?.id,
    ].filter(Boolean);

    const res = await fetch(`${API}/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        carId: car.id,
        configIds,
      }),
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
    <div className="min-h-screen bg-gradient-to-b from-black via-[#05070d] to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* BACK */}
        <button
          onClick={() => navigate("/market")}
          className="mb-6 text-white/60 hover:text-yellow-400"
        >
          ← Back
        </button>

        {/* TITLE */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-yellow-400">
            {car.name} {car.premium && "👑"}
          </h1>
          <p className="text-white/60">{car.brand}</p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-[280px_1fr_280px] gap-6">

          {/* LEFT */}
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-2">
            <p>Brand: {car.brand}</p>
            <p>Engine: {car.dvigatel}</p>
            <p>Power: {car.power}</p>
            <p>Speed: {car.speed}</p>

            <div className="border-t border-white/10 pt-3">
              <p className="text-white/60">Base: ${base}</p>

              {discount > 0 && (
                <p className="text-green-400">
                  Discount: -{discount}%
                </p>
              )}

              <p className="text-yellow-400 font-bold text-xl mt-2">
                TOTAL: ${totalPrice}
              </p>
            </div>
          </div>

          {/* CENTER */}
          <div className="flex items-center justify-center bg-white/5 rounded-xl border border-white/10 p-4">
            <img
              src={car.image_url}
              className="max-h-[420px] drop-shadow-2xl"
            />
          </div>

          {/* RIGHT */}
          <div className="bg-white/5 p-5 rounded-xl space-y-4">

            <div>
              <p className="text-xs text-white/40 mb-2">POWER</p>
              {configs.power.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedHp(c)}
                  className={`w-full p-2 mb-2 rounded ${
                    selectedHp?.id === c.id
                      ? "bg-yellow-500 text-black"
                      : "bg-white/10"
                  }`}
                >
                  {c.name} +${c.price}
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs text-white/40 mb-2">TUNING</p>
              {configs.tuning.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedTuning(c)}
                  className={`w-full p-2 mb-2 rounded ${
                    selectedTuning?.id === c.id
                      ? "bg-yellow-500 text-black"
                      : "bg-white/10"
                  }`}
                >
                  {c.name} +${c.price}
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs text-white/40 mb-2">WHEELS</p>
              {configs.wheels.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedWheels(c)}
                  className={`w-full p-2 mb-2 rounded ${
                    selectedWheels?.id === c.id
                      ? "bg-yellow-500 text-black"
                      : "bg-white/10"
                  }`}
                >
                  {c.name} +${c.price}
                </button>
              ))}
            </div>

            <button
              onClick={buyCar}
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400"
            >
              BUY CAR
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}