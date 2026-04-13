
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const API = import.meta.env.VITE_API_URL;

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
//     try {
//       const res = await fetch(`${API}/cars`);
//       const data = await res.json();
//       setCars(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Ошибка загрузки авто:", err);
//     }
//   };

//   const loadUser = async () => {
//     if (!userLocal.id) return;
//     try {
//       const res = await fetch(`${API}/profile/${userLocal.id}`);
//       const data = await res.json();
//       setUser(data);
//     } catch (err) {
//       console.error("Ошибка загрузки профиля:", err);
//     }
//   };

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
//     <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-yellow-500 selection:text-black relative">
      
//       {/* ГАРАНТИРОВАННО ВИДИМЫЙ НАВБАР */}
//       <div className="sticky top-0 z-[100] w-full bg-[#050608]/80 backdrop-blur-xl border-b border-white/5">
//         <Navbar />
//       </div>

//       {/* ФОНОВЫЙ ГРАДИЕНТ (z-0 чтобы не перекрывать контент) */}
//       <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1d26_0%,#050608_100%)] pointer-events-none z-0" />

//       <div className="relative z-10 max-w-[1400px] mx-auto p-4 lg:p-8">
        
//         {/* ШАПКА И ФИЛЬТРЫ */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
//           <div className="animate-in slide-in-from-left duration-500">
//             <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
//               AUTO <span className="text-yellow-500">MARKET</span>
//             </h1>
//             <p className="text-[10px] font-bold text-white/30 tracking-[0.3em] uppercase mt-1">Выберите свой следующий аппарат</p>
//           </div>

//           <div className="flex flex-wrap gap-4 w-full md:w-auto animate-in slide-in-from-right duration-500">
//             <div className="relative flex-1 md:flex-none">
//               <input
//                 placeholder="ПОИСК МАШИНЫ..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full md:w-[300px] px-6 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-yellow-500 outline-none transition-all font-bold italic uppercase text-xs tracking-widest"
//               />
//             </div>

//             <button
//               onClick={() => setOnlyPremium(!onlyPremium)}
//               className={`px-6 py-3 rounded-xl font-black italic uppercase text-xs tracking-widest transition-all flex items-center gap-2 border ${
//                 onlyPremium
//                   ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]"
//                   : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
//               }`}
//             >
//               👑 Premium
//             </button>
//           </div>
//         </div>

//         {/* СЕТКА КАРТОЧЕК */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredCars.map((car: any) => {
//             const discounted = isDiscountCar(car);
//             const price = getPrice(car);

//             return (
//               <div
//                 key={car.id}
//                 onClick={() => navigate(`/car/${car.id}`)}
//                 className="group relative cursor-pointer rounded-[2rem] bg-gradient-to-b from-neutral-800/40 to-black border border-white/5 hover:border-yellow-500/50 transition-all duration-500 overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300"
//               >
//                 {/* МЕТКА СКИДКИ */}
//                 {discounted && (
//                   <div className="absolute top-4 left-4 z-20 bg-green-500 text-black font-black italic text-[9px] px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg animate-pulse">
//                     АКЦИЯ -{user.discount}%
//                   </div>
//                 )}

//                 {/* ИЗОБРАЖЕНИЕ */}
//                 <div className="relative h-48 overflow-hidden flex items-center justify-center p-4">
//                   <img
//                     src={car.image_url}
//                     className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 ease-out drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
//                     alt={car.name}
//                   />
//                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
//                     <span className="bg-yellow-500 text-black font-black italic px-4 py-2 rounded-lg text-xs tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">
//                       ПОСМОТРЕТЬ
//                     </span>
//                   </div>
//                 </div>

//                 {/* ИНФО */}
//                 <div className="p-6 bg-black/20 flex-1 flex flex-col justify-between">
//                   <div>
//                     <div className="flex justify-between items-start mb-1">
//                       <h2 className="text-xl font-black italic tracking-tighter uppercase truncate pr-2">
//                         {car.name}
//                       </h2>
//                       {car.premium && <span className="text-yellow-400 drop-shadow-[0_0_8px_gold]">👑</span>}
//                     </div>
//                     <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">{car.brand}</p>
                    
//                     <div className="flex gap-2 mb-4">
//                       <div className="bg-white/5 px-2 py-1 rounded border border-white/5 text-[9px] font-black italic">
//                         <span className="text-yellow-500">HP</span> {car.power}
//                       </div>
//                       <div className="bg-white/5 px-2 py-1 rounded border border-white/5 text-[9px] font-black italic text-white/60">
//                         {car.dvigatel}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-end justify-between border-t border-white/5 pt-4">
//                     <div className="flex flex-col">
//                       {discounted && (
//                         <span className="text-[10px] text-white/30 line-through font-bold">${car.price.toLocaleString()}</span>
//                       )}
//                       <span className="text-2xl font-black italic text-yellow-400 tracking-tighter leading-none">
//                         ${price.toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-all">
//                       <span className="text-lg font-bold">→</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ПУСТОЕ СОСТОЯНИЕ */}
//         {filteredCars.length === 0 && (
//           <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10 mt-10">
//             <p className="text-4xl font-black italic opacity-10 uppercase tracking-tighter">Машины не найдены</p>
//             <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-2">Попробуйте изменить параметры поиска</p>
//           </div>
//         )}
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         @keyframes zoomIn {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .animate-in {
//           animation: zoomIn 0.4s ease-out forwards;
//         }
//       `}} />
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const userLocal = JSON.parse(localStorage.getItem("user") || "{}");

  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [promo, setPromo] = useState("");
  const [promoStatus, setPromoStatus] = useState("");

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API}/profile/${userLocal.id}`);
      const text = await res.text();

      if (!res.ok) throw new Error(text);

      const data = JSON.parse(text);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("Profile error:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const convertBase64 = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const updateAvatar = async () => {
    if (!avatarFile) return;

    const base64 = await convertBase64(avatarFile);

    await fetch(`${API}/update-avatar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userLocal.id,
        avatar: base64,
      }),
    });

    loadProfile();
  };

  const connectTelegram = () => {
    window.open(
      `https://t.me/YOUR_BOT_USERNAME?start=${userLocal.id}`,
      "_blank"
    );
  };

  const applyPromo = async () => {
    const res = await fetch(`${API}/promo/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userLocal.id,
        code: promo,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setPromoStatus("✅ OK");
      loadProfile();
    } else {
      setPromoStatus("❌ " + data.error);
    }
  };

  if (!user) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-yellow-400">PROFILE</h1>

        {/* AVATAR */}
        <div className="mt-6">
          <img
            src={user.avatar || "https://i.pravatar.cc/150"}
            className="w-28 h-28 rounded-xl"
          />

          <input
            type="file"
            onChange={(e: any) => setAvatarFile(e.target.files[0])}
          />

          {avatarFile && (
            <button onClick={updateAvatar} className="bg-yellow-500 text-black px-4 py-1 mt-2">
              Save Avatar
            </button>
          )}
        </div>

        <p className="mt-4">👤 {user.name}</p>
        <p>📧 {user.email}</p>

        {/* TELEGRAM */}
        <div className="mt-6 bg-white/10 p-4 rounded">
          <h2 className="text-yellow-400">Telegram</h2>

          {user.telegram_id ? (
            <p>✅ Connected: {user.telegram_id}</p>
          ) : (
            <button
              onClick={connectTelegram}
              className="bg-blue-500 px-4 py-2 mt-2"
            >
              Connect Telegram
            </button>
          )}
        </div>

        {/* PROMO */}
        <div className="mt-6 bg-white/10 p-4 rounded">
          <h2 className="text-yellow-400">Promo</h2>

          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            className="w-full p-2 bg-black border"
          />

          <button
            onClick={applyPromo}
            className="bg-yellow-500 text-black px-4 py-1 mt-2"
          >
            Apply
          </button>

          {promoStatus && <p>{promoStatus}</p>}
        </div>

      </div>
    </div>
  );
}