// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function CarDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [car, setCar] = useState<any>(null);

//   const [selectedHp, setSelectedHp] = useState("300HP");
//   const [selectedTuning, setSelectedTuning] = useState("Standart");
//   const [selectedDiska, setSelectedDiska] = useState("Standart");

//   const loadCar = async () => {
//     const res = await fetch(`${API}/cars`);
//     const data = await res.json();
//     const found = data.find((c: any) => c.id == id);
//     setCar(found);
//   };

//   useEffect(() => {
//     loadCar();
//   }, []);

//   if (!car) {
//     return <div className="text-white p-10">Loading...</div>;
//   }

//   const SpecItem = ({ icon, label, value }: any) => (
//     <div className="flex justify-between text-sm text-white/70 border-b border-white/5 pb-2">
//       <span>{icon} {label}</span>
//       <span className="text-white">{value}</span>
//     </div>
//   );

//   const ConfigOption = ({ label, options, selected, onSelect }: any) => (
//     <div className="mb-5">
//       <p className="text-xs text-white/40 mb-2 uppercase">{label}</p>
//       <div className="flex gap-2 flex-wrap">
//         {options.map((opt: string) => (
//           <button
//             key={opt}
//             onClick={() => onSelect(opt)}
//             className={`px-3 py-1 rounded-md text-xs transition ${
//               selected === opt
//                 ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.6)]"
//                 : "bg-white/5 text-white/70 hover:bg-white/10"
//             }`}
//           >
//             {opt}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#05070d] text-white">

//       <Navbar />

//       <div className="max-w-7xl mx-auto p-6">

//         {/* BACK */}
//         <button
//           onClick={() => navigate("/market")}
//           className="mb-6 text-white/60 hover:text-yellow-400 text-sm"
//         >
//           ← BACK
//         </button>

//         {/* TITLE */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-extrabold text-yellow-400 tracking-widest">
//             {car.name}
//           </h1>
//           <p className="text-white/60 uppercase">{car.brand}</p>
//         </div>

//         {/* GRID */}
//         <div className="grid grid-cols-[280px_1fr_280px] gap-6">

//           {/* LEFT */}
//           <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
//             <h2 className="text-xs text-white/40 mb-3">STATS</h2>

//             <SpecItem icon="⚙️" label="Engine" value={car.dvigatel} />
//             <SpecItem icon="🔥" label="Power" value={car.power} />
//             <SpecItem icon="🏎" label="Speed" value={car.speed} />
//             <SpecItem icon="💰" label="Price" value={`$${car.price}`} />
//           </div>

//           {/* CENTER */}
//           <div className="flex flex-col items-center">

//             <div className="w-full h-[400px] bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl">
//               <img
//                 src={car.image_url}
//                 className="max-h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
//               />
//             </div>

//           </div>

//           {/* RIGHT */}
//           <div className="bg-white/5 p-5 rounded-xl border border-white/10">

//             <h2 className="text-xs text-white/40 mb-4">CONFIG</h2>

//             {/* HP */}
//             <ConfigOption
//               label="POWER"
//               options={["630HP", "300HP"]}
//               selected={selectedHp}
//               onSelect={setSelectedHp}
//             />

//             {/* TUNING */}
//             <ConfigOption
//               label="TUNING"
//               options={["Standart", "Kolodka xrom", "Fara XROM"]}
//               selected={selectedTuning}
//               onSelect={setSelectedTuning}
//             />

//             {/* DISKA */}
//             <ConfigOption
//               label="WHEELS"
//               options={["Standart", "Diska XROM"]}
//               selected={selectedDiska}
//               onSelect={setSelectedDiska}
//             />

//             {/* BUY */}
//             <button className="mt-6 w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(234,179,8,0.5)]">
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
  const [configs, setConfigs] = useState<any[]>([]);

  const [selectedHp, setSelectedHp] = useState("");
  const [selectedTuning, setSelectedTuning] = useState("");
  const [selectedWheels, setSelectedWheels] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);

  /* ================= LOAD CAR ================= */
  const loadCar = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();
    const found = data.find((c: any) => c.id == id);
    setCar(found);
  };

  /* ================= LOAD CONFIGS ================= */
  const loadConfigs = async () => {
    const res = await fetch(`${API}/configs`);
    const data = await res.json();
    setConfigs(data);

    const hp = data.find((c: any) => c.type === "hp");
    const tuning = data.find((c: any) => c.type === "tuning");
    const wheels = data.find((c: any) => c.type === "wheels");

    if (hp) setSelectedHp(hp.name);
    if (tuning) setSelectedTuning(tuning.name);
    if (wheels) setSelectedWheels(wheels.name);
  };

  useEffect(() => {
    loadCar();
    loadConfigs();
  }, []);

  /* ================= CALCULATE PRICE ================= */
  useEffect(() => {
    if (!car) return;

    let price = Number(car.price);

    const getPrice = (type: string, name: string) => {
      const item = configs.find(
        (c) => c.type === type && c.name === name
      );
      return item ? Number(item.price) : 0;
    };

    price += getPrice("hp", selectedHp);
    price += getPrice("tuning", selectedTuning);
    price += getPrice("wheels", selectedWheels);

    setTotalPrice(price);
  }, [selectedHp, selectedTuning, selectedWheels, configs, car]);

  /* ================= BUY ================= */
  const buyCar = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch(`${API}/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        carId: car.id
      })
    });

    const data = await res.json();

    alert(data.success ? `Bought for $${data.paid}` : data.error);
  };

  if (!car) {
    return <div className="text-white p-10">Loading...</div>;
  }

  /* ================= UI ================= */
  const Option = ({ title, type, selected, setSelected }: any) => (
    <div className="mb-4">
      <p className="text-xs text-white/40 mb-2">{title}</p>

      <div className="flex flex-wrap gap-2">
        {configs
          .filter((c) => c.type === type)
          .map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.name)}
              className={`px-3 py-1 rounded text-xs ${
                selected === opt.name
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              {opt.name} (+{opt.price})
            </button>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {/* BACK */}
        <button
          onClick={() => navigate("/market")}
          className="text-white/60 mb-4"
        >
          ← Back
        </button>

        {/* TITLE */}
        <h1 className="text-3xl text-yellow-400 font-bold">
          {car.name}
        </h1>
        <p className="text-white/60">{car.brand}</p>

        <div className="grid grid-cols-3 gap-6 mt-6">

          {/* LEFT CONFIG */}
          <div className="bg-white/5 p-4 rounded">

            <Option
              title="POWER"
              type="hp"
              selected={selectedHp}
              setSelected={setSelectedHp}
            />

            <Option
              title="TUNING"
              type="tuning"
              selected={selectedTuning}
              setSelected={setSelectedTuning}
            />

            <Option
              title="WHEELS"
              type="wheels"
              selected={selectedWheels}
              setSelected={setSelectedWheels}
            />

            {/* PRICE */}
            <div className="mt-4 text-yellow-400 font-bold">
              TOTAL: ${totalPrice}
            </div>

            <button
              onClick={buyCar}
              className="mt-4 w-full bg-yellow-500 text-black py-2 rounded font-bold"
            >
              BUY CAR
            </button>
          </div>

          {/* IMAGE */}
          <div className="col-span-2 flex justify-center items-center">
            <img
              src={car.image_url}
              className="max-h-[400px]"
            />
          </div>

        </div>
      </div>
    </div>
  );
}