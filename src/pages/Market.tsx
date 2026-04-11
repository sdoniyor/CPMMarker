
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function Market() {
//   const [cars, setCars] = useState<any[]>([]);
//   const [search, setSearch] = useState("");
//   const [onlyPremium, setOnlyPremium] = useState(false);

//   const navigate = useNavigate();

//   const loadCars = async () => {
//     try {
//       const res = await fetch(`${API}/cars`);
//       const data = await res.json();

//       if (Array.isArray(data)) {
//         setCars(data);
//       } else {
//         setCars([]);
//       }
//     } catch (err) {
//       console.log("Error loading cars", err);
//     }
//   };

//   useEffect(() => {
//     loadCars();
//   }, []);

//   // 🔍 фильтрация
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

//         {/* <h1 className="text-3xl font-extrabold text-yellow-400 tracking-widest mb-6">
//           CAR MARKET
//         </h1> */}

//         {/* 🔍 SEARCH + FILTER */}
//         <div className="flex flex-col md:flex-row gap-4 mb-6">

//           {/* SEARCH */}
//           <input
//             placeholder="Search car..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 w-full md:w-[300px]"
//           />

//           {/* PREMIUM FILTER */}
//           <button
//             onClick={() => setOnlyPremium(!onlyPremium)}
//             className={`px-4 py-2 rounded-lg border transition ${
//               onlyPremium
//                 ? "bg-yellow-500 text-black border-yellow-400"
//                 : "bg-white/5 border-white/10 text-white"
//             }`}
//           >
//             👑 Premium
//           </button>

//         </div>

//         {/* GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

//           {filteredCars.map((car: any) => (
//             <div
//               key={car.id}
//               onClick={() => navigate(`/car/${car.id}`)}
//               className="group cursor-pointer relative overflow-hidden rounded-2xl border border-white/10
//               bg-white/5 hover:bg-white/10 transition
//               shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-[1.02]"
//             >

//               {/* 👑 PREMIUM ICON */}
//               {car.premium && (
//                 <div className="absolute top-2 right-2 text-yellow-400 text-xl z-10">
//                   👑
//                 </div>
//               )}

//               {/* IMAGE */}
//               <div className="h-44 overflow-hidden">
//                 <img
//                   src={car.image_url}
//                   className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
//                 />
//               </div>

//               {/* INFO */}
//               <div className="p-4">

//                 <h2 className="text-lg font-bold text-yellow-400">
//                   {car.name}
//                 </h2>

//                 <p className="text-sm text-white/60">
//                   {car.brand}
//                 </p>

//                 {/* STATS */}
//                 <div className="mt-2 text-xs text-white/70 space-y-1">
//                   <p>⚡ Power: {car.power}</p>
//                   <p>🏎 Speed: {car.speed}</p>
//                 </div>

//               </div>
//             </div>
//           ))}

//         </div>

//         {/* EMPTY */}
//         {filteredCars.length === 0 && (
//           <p className="text-white/50 mt-10 text-center">
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
    const res = await fetch(`${API}/profile/${userLocal.id}`);
    const data = await res.json();
    setUser(data);
  };

  // 🔥 discount logic
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
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050a10] to-black text-white">

      <Navbar />

      <div className="p-6">

        {/* SEARCH */}
        <div className="flex gap-4 mb-6">
          <input
            placeholder="Search car..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 w-[300px]"
          />

          <button
            onClick={() => setOnlyPremium(!onlyPremium)}
            className={`px-4 py-2 rounded-lg border ${
              onlyPremium
                ? "bg-yellow-500 text-black"
                : "bg-white/5 border-white/10"
            }`}
          >
            👑 Premium
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {filteredCars.map((car: any) => {
            const discounted = isDiscountCar(car);
            const price = getPrice(car);

            return (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="relative cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >

                {/* PREMIUM */}
                {car.premium && (
                  <div className="absolute top-2 right-2 text-yellow-400 text-xl">
                    👑
                  </div>
                )}

                {/* DISCOUNT BADGE */}
                {discounted && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{user.discount}% OFF
                  </div>
                )}

                {/* IMAGE */}
                <img
                  src={car.image_url}
                  className="h-44 w-full object-cover"
                />

                {/* INFO */}
                <div className="p-4">

                  <h2 className="text-lg font-bold text-yellow-400">
                    {car.name}
                  </h2>

                  <p className="text-sm text-white/60">{car.brand}</p>

                  {/* PRICE */}
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-white font-bold">
                      ${price}
                    </p>

                    {discounted && (
                      <p className="text-white/40 line-through text-sm">
                        ${car.price}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-white/70 mt-2">
                    ⚡ {car.power} | 🏎 {car.speed}
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* EMPTY */}
        {filteredCars.length === 0 && (
          <p className="text-center text-white/50 mt-10">
            No cars found...
          </p>
        )}

      </div>
    </div>
  );
}