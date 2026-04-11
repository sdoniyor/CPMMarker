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
  const [configs, setConfigs] = useState<any>({});

  const [selectedHp, setSelectedHp] = useState<any>(null);
  const [selectedTuning, setSelectedTuning] = useState<any>(null);
  const [selectedWheels, setSelectedWheels] = useState<any>(null);

  const loadCar = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();
    const found = data.find((c: any) => c.id == id);
    setCar(found);
  };

  const loadConfigs = async () => {
    const res = await fetch(`${API}/configs`);
    const data = await res.json();
    setConfigs(data);

    setSelectedHp(data.power?.[0]);
    setSelectedTuning(data.tuning?.[0]);
    setSelectedWheels(data.wheels?.[0]);
  };

  useEffect(() => {
    loadCar();
    loadConfigs();
  }, []);

  if (!car || !configs.power) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const totalPrice =
    Number(car.price) +
    (selectedHp?.price || 0) +
    (selectedTuning?.price || 0) +
    (selectedWheels?.price || 0);

  const SpecItem = ({ icon, label, value }: any) => (
    <div className="flex justify-between text-sm text-white/70 border-b border-white/5 pb-2">
      <span>{icon} {label}</span>
      <span className="text-white">{value}</span>
    </div>
  );

  const ConfigOption = ({ title, items, selected, setSelected }: any) => (
    <div className="mb-5">
      <p className="text-xs text-white/40 mb-2 uppercase">{title}</p>

      <div className="flex flex-wrap gap-2">
        {items?.map((item: any) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className={`px-3 py-1 rounded-md text-xs ${
              selected?.id === item.id
                ? "bg-yellow-500 text-black"
                : "bg-white/5 text-white/70"
            }`}
          >
            {item.name} (+${item.price})
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <button
          onClick={() => navigate("/market")}
          className="mb-6 text-white/60 hover:text-yellow-400 text-sm"
        >
          ← BACK
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400">
            {car.name}
          </h1>
          <p className="text-white/60">{car.brand}</p>
        </div>

        <div className="grid grid-cols-[280px_1fr_280px] gap-6">

          {/* LEFT */}
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
            <SpecItem icon="💰" label="Base price" value={`$${car.price}`} />
            <SpecItem icon="⚡" label="Power" value={selectedHp?.name} />
            <SpecItem icon="🏎" label="Tuning" value={selectedTuning?.name} />
            <SpecItem icon="🛞" label="Wheels" value={selectedWheels?.name} />

            <div className="pt-3 text-yellow-400 font-bold">
              TOTAL: ${totalPrice}
            </div>
          </div>

          {/* CENTER */}
          <div className="flex flex-col items-center">
            <div className="w-full h-[400px] bg-white/5 rounded-xl flex items-center justify-center">
              <img src={car.image_url} className="max-h-full" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white/5 p-5 rounded-xl">

            <ConfigOption
              title="POWER"
              items={configs.power}
              selected={selectedHp}
              setSelected={setSelectedHp}
            />

            <ConfigOption
              title="TUNING"
              items={configs.tuning}
              selected={selectedTuning}
              setSelected={setSelectedTuning}
            />

            <ConfigOption
              title="WHEELS"
              items={configs.wheels}
              selected={selectedWheels}
              setSelected={setSelectedWheels}
            />

            <button className="mt-6 w-full py-3 bg-yellow-500 text-black font-bold rounded-lg">
              BUY CAR
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}