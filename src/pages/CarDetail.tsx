



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

//   const loadCar = async () => {
//     const res = await fetch(`${API}/cars`);
//     const data = await res.json();
//     const found = data.find((c: any) => c.id == id);
//     setCar(found);
//   };

//   const loadConfigs = async () => {
//     const res = await fetch(`${API}/configs`);
//     const data = await res.json();
//     setConfigs(data);

//     setSelectedHp(data.power?.[0]);
//     setSelectedTuning(data.tuning?.[0]);
//     setSelectedWheels(data.wheels?.[0]);
//   };

//   useEffect(() => {
//     loadCar();
//     loadConfigs();
//   }, []);

//   if (!car || !configs.power) {
//     return <div className="text-white p-10">Loading...</div>;
//   }

//   const totalPrice =
//     Number(car.price) +
//     (selectedHp?.price || 0) +
//     (selectedTuning?.price || 0) +
//     (selectedWheels?.price || 0);

//   const SpecItem = ({ icon, label, value }: any) => (
//     <div className="flex justify-between text-sm text-white/70 border-b border-white/5 pb-2">
//       <span>{icon} {label}</span>
//       <span className="text-white">{value}</span>
//     </div>
//   );

//   const ConfigOption = ({ title, items, selected, setSelected }: any) => (
//     <div className="mb-5">
//       <p className="text-xs text-white/40 mb-2 uppercase">{title}</p>

//       <div className="flex flex-wrap gap-2">
//         {items?.map((item: any) => (
//           <button
//             key={item.id}
//             onClick={() => setSelected(item)}
//             className={`px-3 py-1 rounded-md text-xs ${
//               selected?.id === item.id
//                 ? "bg-yellow-500 text-black"
//                 : "bg-white/5 text-white/70"
//             }`}
//           >
//             {item.name} (+${item.price})
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#05070d] text-white">
//       <Navbar />

//       <div className="max-w-7xl mx-auto p-6">

//         <button
//           onClick={() => navigate("/market")}
//           className="mb-6 text-white/60 hover:text-yellow-400 text-sm"
//         >
//           ← BACK
//         </button>

//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-yellow-400">
//             {car.name}
//           </h1>
//           <p className="text-white/60">{car.brand}</p>
//         </div>

//         <div className="grid grid-cols-[280px_1fr_280px] gap-6">

//           {/* LEFT */}
//           <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
//             <SpecItem icon="💰" label="Base price" value={`$${car.price}`} />
//             <SpecItem icon="⚡" label="Power" value={selectedHp?.name} />
//             <SpecItem icon="🏎" label="Tuning" value={selectedTuning?.name} />
//             <SpecItem icon="🛞" label="Wheels" value={selectedWheels?.name} />

//             <div className="pt-3 text-yellow-400 font-bold">
//               TOTAL: ${totalPrice}
//             </div>
//           </div>

//           {/* CENTER */}
//           <div className="flex flex-col items-center">
//             <div className="w-full h-[400px] bg-white/5 rounded-xl flex items-center justify-center">
//               <img src={car.image_url} className="max-h-full" />
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="bg-white/5 p-5 rounded-xl">

//             <ConfigOption
//               title="POWER"
//               items={configs.power}
//               selected={selectedHp}
//               setSelected={setSelectedHp}
//             />

//             <ConfigOption
//               title="TUNING"
//               items={configs.tuning}
//               selected={selectedTuning}
//               setSelected={setSelectedTuning}
//             />

//             <ConfigOption
//               title="WHEELS"
//               items={configs.wheels}
//               selected={selectedWheels}
//               setSelected={setSelectedWheels}
//             />

//             <button className="mt-6 w-full py-3 bg-yellow-500 text-black font-bold rounded-lg">
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

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadCar = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();
    setCar(data.find((c: any) => c.id == id));
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

  const configIds = [
    selectedHp?.id,
    selectedTuning?.id,
    selectedWheels?.id,
  ].filter(Boolean);

  const configPrice =
    (selectedHp?.price || 0) +
    (selectedTuning?.price || 0) +
    (selectedWheels?.price || 0);

  let totalPrice = Number(car.price) + configPrice;

  if (user.discount > 0) {
    totalPrice = totalPrice - (totalPrice * user.discount) / 100;
  }

  const buyCar = async () => {
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
    <div className="min-h-screen bg-[#05070d] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-4xl text-yellow-400 font-bold text-center">
          {car.name}
        </h1>

        <div className="grid grid-cols-[280px_1fr_280px] gap-6 mt-6">

          {/* LEFT */}
          <div className="bg-white/5 p-5 rounded-xl">
            <p>Base: ${car.price}</p>
            <p>Config: ${configPrice}</p>
            <p className="text-yellow-400 font-bold mt-3">
              TOTAL: ${totalPrice}
            </p>
          </div>

          {/* CENTER */}
          <div className="flex justify-center">
            <img src={car.image_url} className="h-[400px]" />
          </div>

          {/* RIGHT */}
          <div className="bg-white/5 p-5 rounded-xl space-y-4">

            <div>
              <p className="text-sm mb-2">POWER</p>
              {configs.power.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedHp(c)}
                  className={`block w-full p-2 mb-1 ${
                    selectedHp?.id === c.id ? "bg-yellow-500 text-black" : "bg-white/10"
                  }`}
                >
                  {c.name} +${c.price}
                </button>
              ))}
            </div>

            <div>
              <p className="text-sm mb-2">TUNING</p>
              {configs.tuning.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedTuning(c)}
                  className={`block w-full p-2 mb-1 ${
                    selectedTuning?.id === c.id ? "bg-yellow-500 text-black" : "bg-white/10"
                  }`}
                >
                  {c.name} +${c.price}
                </button>
              ))}
            </div>

            <div>
              <p className="text-sm mb-2">WHEELS</p>
              {configs.wheels.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedWheels(c)}
                  className={`block w-full p-2 mb-1 ${
                    selectedWheels?.id === c.id ? "bg-yellow-500 text-black" : "bg-white/10"
                  }`}
                >
                  {c.name} +${c.price}
                </button>
              ))}
            </div>

            <button
              onClick={buyCar}
              className="w-full bg-yellow-500 text-black font-bold py-3 rounded"
            >
              BUY
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}