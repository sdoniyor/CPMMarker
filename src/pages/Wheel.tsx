// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function Roulette() {
//   const [items, setItems] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState(null);
//   const [promo, setPromo] = useState("");
//   const [promoUsed, setPromoUsed] = useState(false);
//   const [userData, setUserData] = useState(null);

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   const itemWidth = 170;
//   const gap = 18;
//   const containerWidth = 900;

//   useEffect(() => {
//     loadWheel();

//     const u = JSON.parse(localStorage.getItem("user") || "{}");
//     setUserData(u);
//     setPromoUsed(!!u?.used_promo);
//   }, []);

//   /* ================= LOAD WHEEL ================= */
//   const loadWheel = async () => {
//     try {
//       const res = await fetch(`${API}/wheel`);
//       const data = await res.json();
//       setItems(data || []);
//     } catch (e) {
//       console.error("Failed to load wheel items");
//     }
//   };

//   /* ================= PROMO ================= */
//   const redeemPromo = async () => {
//     try {
//       const res = await fetch(`${API}/promo/redeem`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user.id, code: promo }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Promo activated! 🎁 You can now spin once");

//         const updatedUser = {
//           ...user,
//           used_promo: true,
//         };

//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         setUserData(updatedUser);
//         setPromoUsed(true);
//       } else {
//         alert(data.error);
//       }
//     } catch (e) {
//       alert("Promo error");
//     }
//   };

//   /* ================= SPIN ================= */
//   const spin = async () => {
//     if (spinning || !items.length) return;

//     if (!user?.id) return alert("Login first");

//     // ❌ БЛОК ДО ПРОМО
//     if (!userData?.used_promo) {
//       return alert("You must activate promo first");
//     }

//     setSpinning(true);
//     setResult(null);
//     setOffset(0);

//     try {
//       const res = await fetch(`${API}/wheel/spin`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user.id }),
//       });

//       const data = await res.json();

//       if (!data.success) {
//         setSpinning(false);
//         return;
//       }

//       // ✅ ВАЖНО: берём win С СЕРВЕРА
//       const winItem = data.win;

//       // индекс берём ТОЛЬКО локально по id
//       const winIndex = items.findIndex((i) => i.id === winItem.id);

//       const fullWidth = items.length * (itemWidth + gap);
//       const iterations = 10;

//       const finalOffset =
//         iterations * fullWidth +
//         winIndex * (itemWidth + gap) -
//         containerWidth / 2 +
//         itemWidth / 2;

//       requestAnimationFrame(() => {
//         requestAnimationFrame(() => {
//           setOffset(finalOffset);
//         });
//       });

//       setTimeout(() => {
//         setResult(winItem);
//         setSpinning(false);
//       }, 5000);
//     } catch (e) {
//       setSpinning(false);
//     }
//   };

//   const renderItems = items.length ? Array(30).fill(items).flat() : [];

//   return (
//     <div className="min-h-screen bg-[#020305] text-white overflow-hidden font-sans relative">
//       <Navbar />

//       {/* BACKGROUND */}
//       <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-900/40 blur-[150px] rounded-full pointer-events-none" />
//       <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-yellow-600/20 blur-[130px] rounded-full pointer-events-none" />

//       {/* TITLE */}
//       <div className="text-center mt-20 relative z-10">
//         <h1 className="text-7xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-300 to-orange-500">
//           Ultra Case
//         </h1>
//         <p className="text-neutral-400 text-sm uppercase tracking-[0.4em] mt-3">
//           Try your luck • Win insane rewards
//         </p>
//       </div>

//       {/* PROMO */}
//       {!promoUsed && (
//         <div className="flex justify-center mt-12 relative z-10 max-w-lg mx-auto bg-neutral-900/50 p-1 rounded-full border border-white/5">
//           <input
//             value={promo}
//             onChange={(e) => setPromo(e.target.value)}
//             placeholder="ENTER PROMO CODE"
//             className="flex-grow px-6 py-3 bg-transparent text-white text-sm font-bold"
//           />
//           <button
//             onClick={redeemPromo}
//             className="px-8 py-3 bg-yellow-400 text-black font-black rounded-full"
//           >
//             Redeem
//           </button>
//         </div>
//       )}

//       {/* WHEEL */}
//       <div className="flex justify-center mt-16 relative z-10">
//         <div
//           className="overflow-hidden bg-neutral-900/40"
//           style={{ width: containerWidth, height: 220 }}
//         >
//           <div
//             className="flex items-center h-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.1,0.9,0.2,1)]"
//             style={{
//               transform: `translateX(-${offset}px)`,
//               gap: `${gap}px`,
//               paddingLeft: `${containerWidth / 2 - itemWidth / 2}px`,
//             }}
//           >
//             {renderItems.map((item, i) => (
//               <div
//                 key={i}
//                 className="flex-shrink-0 bg-neutral-800 rounded-xl flex flex-col items-center justify-center"
//                 style={{ width: itemWidth, height: 180 }}
//               >
//                 <img
//                   src={item.image_url}
//                   className="w-32 h-24 object-contain"
//                 />
//                 <p className="text-[10px] uppercase text-neutral-400 mt-2">
//                   {item.name}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* BUTTON */}
//       <div className="flex justify-center mt-12 z-10 relative">
//         <button
//           onClick={spin}
//           disabled={spinning}
//           className="px-20 py-5 bg-yellow-400 text-black font-black uppercase rounded-full"
//         >
//           {spinning ? "Spinning..." : "SPIN NOW"}
//         </button>
//       </div>

//       {/* RESULT */}
//       {result && !spinning && (
//         <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]">
//           <div className="bg-neutral-900 p-10 rounded-2xl text-center">
//             <h2 className="text-yellow-400 mb-4">YOU WON</h2>
//             <img src={result.image_url} className="w-64 mx-auto" />
//             <p className="text-white mt-4">{result.name}</p>

//             <button
//               onClick={() => setResult(null)}
//               className="mt-6 px-10 py-3 bg-white text-black font-bold rounded-full"
//             >
//               CLAIM
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = import.meta.env.VITE_API_URL;

export default function Wheel() {
  const [items, setItems] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [promo, setPromo] = useState("");
  const [promoUsed, setPromoUsed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const itemWidth = 170;
  const gap = 18;
  const containerWidth = 900;

  useEffect(() => {
    loadWheel();
    setPromoUsed(!!user?.used_promo);
  }, []);

  const loadWheel = async () => {
    const res = await fetch(`${API}/wheel`);
    const data = await res.json();
    setItems(data || []);
  };

  /* ================= PROMO ================= */
  const redeemPromo = async () => {
    const res = await fetch(`${API}/promo/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, code: promo }),
    });

    const data = await res.json();

    if (data.success) {
      setPromoUsed(true);

      const u = { ...user, used_promo: true };
      localStorage.setItem("user", JSON.stringify(u));

      alert("Promo activated 🎁");
    } else {
      alert(data.error);
    }
  };

  /* ================= SPIN ================= */
  const spin = async () => {
    if (spinning) return;
    if (!user?.id) return alert("Login first");
    if (!promoUsed) return alert("Activate promo first");

    setSpinning(true);
    setResult(null);
    setOffset(0);

    const res = await fetch(`${API}/wheel/spin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await res.json();
    if (!data.success) {
      setSpinning(false);
      return;
    }

    // 🔥 ВАЖНО: берём ТОЛЬКО ID с сервера
    const winId = data.winId;

    // ищем в локальном списке
    const winIndex = items.findIndex((i) => i.id === winId);
    const winItem = items[winIndex];

    const fullWidth = items.length * (itemWidth + gap);
    const rounds = 10;

    const finalOffset =
      rounds * fullWidth +
      winIndex * (itemWidth + gap) -
      containerWidth / 2 +
      itemWidth / 2;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOffset(finalOffset);
      });
    });

    setTimeout(() => {
      setResult(winItem);
      setSpinning(false);
    }, 5200);
  };

  const renderItems = items.length ? Array(25).fill(items).flat() : [];

  return (
    <div className="min-h-screen bg-[#05060a] text-white relative overflow-hidden">

      <Navbar />

      {/* ===== BACKGROUND ===== */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-yellow-500/20 blur-[150px]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-[150px]" />

      {/* ===== TITLE ===== */}
      <div className="text-center mt-20 relative z-10">
        <h1 className="text-6xl font-black uppercase text-yellow-400">
          WHEEL
        </h1>
      </div>

      {/* ===== PROMO ===== */}
      {!promoUsed && (
        <div className="flex justify-center mt-10 gap-2 z-10 relative">
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="PROMO CODE"
            className="px-4 py-2 bg-black/40 border border-white/10 rounded"
          />
          <button
            onClick={redeemPromo}
            className="px-6 py-2 bg-yellow-400 text-black font-bold rounded"
          >
            APPLY
          </button>
        </div>
      )}

      {/* ===== WHEEL ===== */}
      <div className="flex justify-center mt-16 relative z-10">

        {/* 🔥 CENTER ARROW */}
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-50">
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
        </div>

        <div
          className="overflow-hidden bg-black/40 border border-white/10"
          style={{ width: containerWidth, height: 220 }}
        >
          <div
            className="flex items-center h-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.12,0.8,0.2,1)]"
            style={{
              transform: `translateX(-${offset}px)`,
              gap: `${gap}px`,
              paddingLeft: `${containerWidth / 2 - itemWidth / 2}px`,
            }}
          >
            {renderItems.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[170px] h-[180px] bg-neutral-900 border border-white/10 rounded-xl flex flex-col items-center justify-center"
              >
                <img src={item.image_url} className="w-28 h-20 object-contain" />
                <p className="text-[10px] text-gray-400 mt-2">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== BUTTON ===== */}
      <div className="flex justify-center mt-10">
        <button
          onClick={spin}
          disabled={spinning}
          className="px-16 py-4 bg-yellow-400 text-black font-black rounded-full"
        >
          {spinning ? "SPINNING..." : "SPIN"}
        </button>
      </div>

      {/* ===== RESULT ===== */}
      {result && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100]">
          <div className="bg-neutral-900 p-10 rounded-xl text-center">
            <h2 className="text-yellow-400 mb-4">YOU WON</h2>
            <img src={result.image_url} className="w-64 mx-auto" />
            <p className="mt-4">{result.name}</p>

            <button
              onClick={() => setResult(null)}
              className="mt-6 px-10 py-2 bg-white text-black font-bold rounded"
            >
              CLAIM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
