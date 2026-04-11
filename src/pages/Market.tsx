
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function Market() {
//   const [cars, setCars] = useState<any[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [search, setSearch] = useState("");
//   const [onlyPremium, setOnlyPremium] = useState(false);

//   const navigate = useNavigate();

//   const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

//   useEffect(() => {
//     loadCars();
//     loadUser();
//   }, []);

//   const loadCars = async () => {
//     const res = await fetch(`${API}/cars`);
//     const data = await res.json();
//     setCars(Array.isArray(data) ? data : []);
//   };

//   const loadUser = async () => {
//     const res = await fetch(`${API}/profile/${userLocal.id}`);
//     const data = await res.json();
//     setUser(data);
//   };

//   // 🔥 проверка скидки
//   const isDiscountCar = (car: any) => {
//     if (!user?.discount || !user?.discount_cars) return false;

//     const allowed = user.discount_cars;

//     return Array.isArray(allowed)
//       ? allowed.includes(car.id)
//       : String(allowed).includes(String(car.id));
//   };

//   const getPrice = (car: any) => {
//     if (isDiscountCar(car)) {
//       return Math.floor(car.price - (car.price * user.discount) / 100);
//     }
//     return car.price;
//   };

//   const filteredCars = cars.filter((car) => {
//     const matchSearch =
//       car.name.toLowerCase().includes(search.toLowerCase()) ||
//       car.brand.toLowerCase().includes(search.toLowerCase());

//     const matchPremium = onlyPremium ? car.premium : true;

//     return matchSearch && matchPremium;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-[#050a10] to-black text-white">

//       <Navbar />

//       <div className="p-6">

//         {/* SEARCH + FILTER */}
//         <div className="flex gap-4 mb-6">
//           <input
//             placeholder="Search car..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 w-[300px]"
//           />

//           <button
//             onClick={() => setOnlyPremium(!onlyPremium)}
//             className={`px-4 py-2 rounded-lg border ${
//               onlyPremium
//                 ? "bg-yellow-500 text-black"
//                 : "bg-white/5 border-white/10"
//             }`}
//           >
//             👑 Premium
//           </button>
//         </div>

//         {/* GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

//           {filteredCars.map((car: any) => {
//             const discounted = isDiscountCar(car);
//             const price = getPrice(car);

//             return (
//               <div
//                 key={car.id}
//                 onClick={() => navigate(`/car/${car.id}`)}
//                 className="relative cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
//               >

//                 {/* PREMIUM BADGE */}
//                 {car.premium && (
//                   <div className="absolute top-2 right-2 text-yellow-400 text-xl">
//                     👑
//                   </div>
//                 )}

//                 {/* IMAGE */}
//                 <img
//                   src={car.image_url}
//                   className="h-44 w-full object-cover"
//                 />

//                 {/* INFO */}
//                 <div className="p-4">

//                   {/* NAME + CROWN */}
//                   <h2 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
//                     {car.name}

//                     {car.premium && (
//                       <span className="text-yellow-300 drop-shadow-[0_0_6px_gold] animate-pulse">
//                         👑
//                       </span>
//                     )}
//                   </h2>

//                   <p className="text-sm text-white/60">{car.brand}</p>

//                   {/* PRICE */}
//                   <div className="mt-2 flex items-center gap-2">
//                     <p className="text-white font-bold">
//                       ${price}
//                     </p>

//                     {discounted && (
//                       <p className="text-white/40 line-through text-sm">
//                         ${car.price}
//                       </p>
//                     )}
//                   </div>

//                   {/* STATS */}
//                   <div className="text-xs text-white/70 mt-2">
//                     ⚡ {car.power} | 🏎 {car.speed}
//                   </div>

//                 </div>
//               </div>
//             );
//           })}

//         </div>

//         {/* EMPTY */}
//         {filteredCars.length === 0 && (
//           <p className="text-center text-white/50 mt-10">
//             No cars found...
//           </p>
//         )}

//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

export default function Market() {
  const [cars, setCars] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [onlyPremium, setOnlyPremium] = useState(false);

  const navigate = useNavigate();
  const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadCars();
    loadUser();
  }, []);

  const loadCars = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();
    setCars(Array.isArray(data) ? data : []);
  };

  const loadUser = async () => {
    if (!userLocal.id) return;
    const res = await fetch(`${API}/profile/${userLocal.id}`);
    const data = await res.json();
    setUser(data);
  };

  const isDiscountCar = (car: any) => {
    if (!user?.discount || !user?.discount_cars) return false;
    const allowed = user.discount_cars;
    return Array.isArray(allowed)
      ? allowed.includes(car.id)
      : String(allowed).includes(String(car.id));
  };

  const getPrice = (car: any) => {
    if (isDiscountCar(car)) {
      return Math.floor(car.price - (car.price * user.discount) / 100);
    }
    return car.price;
  };

  const filteredCars = cars.filter((car) => {
    const matchSearch =
      car.name.toLowerCase().includes(search.toLowerCase()) ||
      car.brand.toLowerCase().includes(search.toLowerCase());
    const matchPremium = onlyPremium ? car.premium : true;
    return matchSearch && matchPremium;
  });

  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-yellow-500 selection:text-black relative">
      <Navbar />

      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1d26_0%,#050608_100%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto p-4 lg:p-8">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              AUTO <span className="text-yellow-500">MARKET</span>
            </h1>
            <p className="text-[10px] font-bold text-white/30 tracking-[0.3em] uppercase mt-1">Select your next beast</p>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                placeholder="SEARCH CARS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-[300px] px-6 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-yellow-500 outline-none transition-all font-bold italic uppercase text-xs tracking-widest"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 italic font-black text-xs">FIND</div>
            </div>

            <button
              onClick={() => setOnlyPremium(!onlyPremium)}
              className={`px-6 py-3 rounded-xl font-black italic uppercase text-xs tracking-widest transition-all flex items-center gap-2 border ${
                onlyPremium
                  ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              👑 Premium
            </button>
          </div>
        </div>

        {/* CAR GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car: any) => {
            const discounted = isDiscountCar(car);
            const price = getPrice(car);

            return (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="group relative cursor-pointer rounded-[2rem] bg-gradient-to-b from-neutral-800/40 to-black border border-white/5 hover:border-yellow-500/50 transition-all duration-500 overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300"
              >
                {/* DISCOUNT TAG */}
                {discounted && (
                  <div className="absolute top-4 left-4 z-20 bg-green-500 text-black font-black italic text-[9px] px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg animate-pulse">
                    PROMO -{user.discount}%
                  </div>
                )}

                {/* PREMIUM GLOW */}
                {car.premium && (
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-500/20 blur-[40px] z-10" />
                )}

                {/* IMAGE CONTAINER */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={car.image_url}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 ease-out drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
                    alt={car.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-yellow-500 text-black font-black italic px-4 py-2 rounded-lg text-xs tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">
                      VIEW DETAILS
                    </span>
                  </div>
                </div>

                {/* INFO CONTENT */}
                <div className="p-6 bg-black/40 backdrop-blur-sm flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-xl font-black italic tracking-tighter uppercase truncate">
                        {car.name}
                      </h2>
                      {car.premium && <span className="text-yellow-400 drop-shadow-[0_0_8px_gold]">👑</span>}
                    </div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">{car.brand}</p>
                    
                    {/* STATS MINI */}
                    <div className="flex gap-3 mb-6">
                      <div className="bg-white/5 px-2 py-1 rounded border border-white/5 text-[9px] font-black italic">
                        <span className="text-yellow-500">HP</span> {car.power}
                      </div>
                      <div className="bg-white/5 px-2 py-1 rounded border border-white/5 text-[9px] font-black italic">
                        <span className="text-yellow-500">TOP</span> {car.speed}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/5 pt-4">
                    <div className="flex flex-col">
                      {discounted && (
                        <span className="text-[10px] text-white/30 line-through font-bold">${car.price.toLocaleString()}</span>
                      )}
                      <span className="text-2xl font-black italic text-yellow-400 tracking-tighter leading-none">
                        ${price.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                      <span className="text-lg font-bold">→</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {filteredCars.length === 0 && (
          <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10 mt-10">
            <p className="text-4xl font-black italic opacity-10 uppercase tracking-tighter italic">No vehicles found</p>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-2">Try changing your search filters</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: zoomIn 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
}