
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// /* ================= SAFE USER ================= */
// const getUser = () => {
//   try {
//     const raw = localStorage.getItem("user");
//     if (!raw || raw === "undefined" || raw === "null") return null;

//     const parsed = JSON.parse(raw);

//     // backend может вернуть {user, token}
//     return parsed.user || parsed;
//   } catch {
//     return null;
//   }
// };

// /* ================= SAFE FETCH ================= */
// const safeFetch = async (url: string) => {
//   try {
//     const res = await fetch(url);

//     const text = await res.text();

//     if (!text || text.startsWith("<!DOCTYPE")) {
//       console.log("❌ NOT JSON:", text);
//       return null;
//     }

//     try {
//       return JSON.parse(text);
//     } catch {
//       console.log("❌ JSON PARSE ERROR:", text);
//       return null;
//     }
//   } catch (e) {
//     console.log("❌ FETCH ERROR:", e);
//     return null;
//   }
// };

// export default function Market() {
//   const [cars, setCars] = useState<any[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [search, setSearch] = useState("");
//   const [onlyPremium, setOnlyPremium] = useState(false);

//   const navigate = useNavigate();

//   const localUser = getUser();

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     loadCars();

//     if (localUser?.id) {
//       loadUser(localUser.id);
//     }
//   }, []);

//   /* ================= API CALLS (FIXED ROUTES) ================= */
//   const loadCars = async () => {
//     const data = await safeFetch(`${API}/market/cars`);
//     setCars(Array.isArray(data) ? data : []);
//   };

//   const loadUser = async (id: number) => {
//     const data = await safeFetch(`${API}/profile/${id}`);

//     if (data) {
//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
//     }
//   };

//   /* ================= HELPERS ================= */
//   const parseSafe = (val: any) => {
//     try {
//       if (!val || val === "undefined") return [];
//       return typeof val === "string" ? JSON.parse(val) : val;
//     } catch {
//       return [];
//     }
//   };

//   const isDiscountCar = (car: any) => {
//     if (!user?.discount) return false;

//     const allowed = parseSafe(user.discount_cars);
//     return Array.isArray(allowed) && allowed.includes(car.id);
//   };

//   const getPrice = (car: any) => {
//     if (isDiscountCar(car)) {
//       return Math.floor(
//         car.price - (car.price * user.discount) / 100
//       );
//     }
//     return car.price;
//   };

//   /* ================= FILTER ================= */
//   const filteredCars = cars.filter((car) => {
//     const matchSearch =
//       car.name?.toLowerCase().includes(search.toLowerCase()) ||
//       car.brand?.toLowerCase().includes(search.toLowerCase());

//     return onlyPremium ? matchSearch && car.premium : matchSearch;
//   });

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-[#050608] text-white">
//       <Navbar />

//       <div className="max-w-[1400px] mx-auto px-6 py-10">

//         {/* HEADER */}
//         <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">

//           <div>
//             <h1 className="text-5xl font-black">
//               AUTO <span className="text-yellow-400">MARKET</span>
//             </h1>
//             <p className="text-white/40 text-sm">
//               Choose your car
//             </p>
//           </div>

//           <div className="flex gap-4">

//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
//             />

//             <button
//               onClick={() => setOnlyPremium(!onlyPremium)}
//               className={`px-4 py-2 rounded-xl ${
//                 onlyPremium ? "bg-yellow-400 text-black" : "bg-white/10"
//               }`}
//             >
//               👑 Premium
//             </button>

//           </div>
//         </div>

//         {/* CARS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           {filteredCars.map((car) => {
//             const hasDiscount = isDiscountCar(car);
//             const finalPrice = getPrice(car);

//             return (
//               <div
//                 key={car.id}
//                 onClick={() => navigate(`/car/${car.id}`)}
//                 className="bg-[#0c0c0c] p-4 rounded-2xl cursor-pointer border border-transparent hover:border-yellow-400 transition"
//               >

//                 <img
//                   src={car.image_url}
//                   className="w-full h-40 object-contain"
//                 />

//                 <h2 className="text-xl font-bold mt-2">
//                   {car.brand} {car.name}
//                 </h2>

//                 <div className="mt-2">

//                   {hasDiscount && (
//                     <div className="text-red-400 line-through text-sm">
//                       ${car.price}
//                     </div>
//                   )}

//                   <div className="text-green-400 font-bold text-lg">
//                     ${finalPrice}
//                   </div>

//                 </div>
//               </div>
//             );
//           })}

//         </div>

//         {/* EMPTY */}
//         {filteredCars.length === 0 && (
//           <div className="text-center mt-20 text-white/30">
//             No cars found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }










import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

/* ================= SAFE USER ================= */
const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") return null;

    const parsed = JSON.parse(raw);
    return parsed.user || parsed;
  } catch {
    return null;
  }
};

/* ================= SAFE FETCH ================= */
const safeFetch = async (url: string) => {
  try {
    const res = await fetch(url);
    const text = await res.text();

    if (!text || text.startsWith("<!DOCTYPE")) {
      console.log("❌ NOT JSON:", text);
      return null;
    }

    return JSON.parse(text);
  } catch (e) {
    console.log("❌ FETCH ERROR:", e);
    return null;
  }
};

/* ================= PARSE discount_cars ================= */
const parseDiscountCars = (val: any): number[] => {
  try {
    if (!val) return [];

    // уже массив
    if (Array.isArray(val)) return val.map(Number);

    // postgres {1,2,3}
    if (typeof val === "string" && val.startsWith("{")) {
      return val
        .replace("{", "")
        .replace("}", "")
        .split(",")
        .map(Number);
    }

    // json строка "[1,2,3]"
    if (typeof val === "string") {
      return JSON.parse(val);
    }

    return [];
  } catch {
    return [];
  }
};

export default function Market() {
  const [cars, setCars] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [onlyPremium, setOnlyPremium] = useState(false);

  const navigate = useNavigate();
  const localUser = getUser();

  /* ================= LOAD ================= */
  useEffect(() => {
    loadCars();

    if (localUser?.id) {
      loadUser(localUser.id);
    }
  }, []);

  const loadCars = async () => {
    const data = await safeFetch(`${API}/market/cars`);
    setCars(Array.isArray(data) ? data : []);
  };

  const loadUser = async (id: number) => {
    const data = await safeFetch(`${API}/profile/${id}`);

    if (data) {
      console.log("👤 USER:", data);

      setUser(data);
      localStorage.setItem("user", JSON.stringify({ user: data }));
    }
  };

  /* ================= LOGIC ================= */
  const isDiscountCar = (car: any) => {
    if (!user?.discount) return false;

    const allowed = parseDiscountCars(user.discount_cars);

    console.log("🚗 CHECK:", car.id, allowed);

    return allowed.includes(Number(car.id));
  };

  const getPrice = (car: any) => {
    const hasDiscount = isDiscountCar(car);

    if (hasDiscount) {
      return Math.floor(
        car.price - (car.price * user.discount) / 100
      );
    }

    return car.price;
  };

  /* ================= FILTER ================= */
  const filteredCars = cars.filter((car) => {
    const matchSearch =
      car.name?.toLowerCase().includes(search.toLowerCase()) ||
      car.brand?.toLowerCase().includes(search.toLowerCase());

    return onlyPremium ? matchSearch && car.premium : matchSearch;
  });

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050608] text-white">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">

          <div>
            <h1 className="text-5xl font-black">
              AUTO <span className="text-yellow-400">MARKET</span>
            </h1>
            <p className="text-white/40 text-sm">
              Choose your car
            </p>
          </div>

          <div className="flex gap-4">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
            />

            <button
              onClick={() => setOnlyPremium(!onlyPremium)}
              className={`px-4 py-2 rounded-xl ${
                onlyPremium
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10"
              }`}
            >
              👑 Premium
            </button>

          </div>
        </div>

        {/* CARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {filteredCars.map((car) => {
            const hasDiscount = isDiscountCar(car);
            const finalPrice = getPrice(car);

            return (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="bg-[#0c0c0c] p-4 rounded-2xl cursor-pointer border border-transparent hover:border-yellow-400 transition"
              >

                <img
                  src={car.image_url}
                  className="w-full h-40 object-contain"
                />

                <h2 className="text-xl font-bold mt-2">
                  {car.brand} {car.name}
                </h2>

                <div className="mt-2">

                  {hasDiscount && (
                    <div className="text-red-400 line-through text-sm">
                      ${car.price}
                    </div>
                  )}

                  <div className="text-green-400 font-bold text-lg">
                    ${finalPrice}
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* EMPTY */}
        {filteredCars.length === 0 && (
          <div className="text-center mt-20 text-white/30">
            No cars found
          </div>
        )}

      </div>
    </div>
  );
}