// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function Roulette() {
//   const [items, setItems] = useState<any[]>([]);
//   const [offset, setOffset] = useState(0);
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [promo, setPromo] = useState("");
//   const [promoUsed, setPromoUsed] = useState(false);

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   const itemWidth = 170;
//   const gap = 18;
//   const containerWidth = 900;

//   useEffect(() => {
//     loadWheel();
//   }, []);

//   const loadWheel = async () => {
//     const res = await fetch(`${API}/wheel`);
//     const data = await res.json();
//     setItems(data || []);
//   };

//   /* ================= PROMO ================= */
//   const redeemPromo = async () => {
//     const res = await fetch(`${API}/promo/redeem`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: user.id, code: promo }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Promo activated! 🎁 You got 1 free spin");
//       setPromoUsed(true);
//     } else {
//       alert(data.error);
//     }
//   };

//   /* ================= SPIN ================= */
//   const spin = async () => {
//     if (spinning || !items.length) return;
//     if (!user?.id) return alert("Login first");

//     setSpinning(true);
//     setResult(null);
//     setOffset(0);

//     const res = await fetch(`${API}/wheel/spin`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: user.id }),
//     });

//     const data = await res.json();

//     const winItem = items.find(i => i.id === data.winId);
//     const winIndex = items.findIndex(i => i.id === data.winId);

//     const fullWidth = items.length * (itemWidth + gap);

//     const finalOffset =
//       10 * fullWidth +
//       winIndex * (itemWidth + gap) -
//       containerWidth / 2 +
//       itemWidth / 2;

//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         setOffset(finalOffset);
//       });
//     });

//     setTimeout(() => {
//       setResult(winItem);
//       setSpinning(false);
//     }, 5000);
//   };

//   const renderItems = items.length ? Array(30).fill(items).flat() : [];

//   return (
//     <div className="min-h-screen bg-[#05060a] text-white overflow-hidden">

//       <Navbar />

//       {/* 🔥 BACKGROUND GLOW */}
//       <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600 blur-[180px] opacity-30" />
//       <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-yellow-400 blur-[180px] opacity-20" />

//       {/* ================= TITLE ================= */}
//       <div className="text-center mt-20">
//         <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
//           ULTRA CASE ROULETTE
//         </h1>
//         <p className="text-gray-400 mt-2">Try your luck. Win insane rewards.</p>
//       </div>

//       {/* ================= PROMO ================= */}
//       {!promoUsed && (
//         <div className="flex justify-center mt-10 gap-3">
//           <input
//             value={promo}
//             onChange={(e) => setPromo(e.target.value)}
//             placeholder="Enter promo code"
//             className="px-4 py-2 rounded bg-black border border-white/20"
//           />
//           <button
//             onClick={redeemPromo}
//             className="px-6 py-2 bg-yellow-400 text-black font-bold rounded"
//           >
//             REDEEM
//           </button>
//         </div>
//       )}

//       {/* ================= WHEEL ================= */}
//       <div className="flex justify-center mt-16 relative">

//         <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-yellow-400 z-50" />

//         <div
//           className="overflow-hidden border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(255,215,0,0.1)]"
//           style={{ width: containerWidth, height: 220 }}
//         >
//           <div
//             className="flex items-center h-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.1,0.9,0.2,1)]"
//             style={{
//               transform: `translateX(-${offset}px)`,
//               gap: `${gap}px`,
//             }}
//           >
//             {renderItems.map((item, i) => (
//               <div
//                 key={i}
//                 className="flex-shrink-0 bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-xl flex flex-col items-center justify-center hover:scale-105 transition"
//                 style={{ width: itemWidth, height: 180 }}
//               >
//                 <img src={item.image_url} className="w-28 h-20 object-contain" />
//                 <p className="text-[10px] uppercase text-gray-400 mt-2">
//                   {item.name}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ================= BUTTON ================= */}
//       <div className="flex justify-center mt-12">
//         <button
//           onClick={spin}
//           disabled={spinning}
//           className="px-14 py-4 rounded-full font-black text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 transition disabled:opacity-50"
//         >
//           {spinning ? "Spinning..." : "SPIN NOW"}
//         </button>
//       </div>

//       {/* ================= RESULT ================= */}
//       {result && !spinning && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
//           <div className="bg-[#111] p-10 rounded-3xl text-center border border-yellow-400/20">
//             <h2 className="text-2xl font-bold text-yellow-400 mb-4">
//               YOU WON
//             </h2>
//             <img src={result.image_url} className="w-64 mx-auto" />
//             <p className="mt-4 text-white">{result.name}</p>

//             <button
//               onClick={() => setResult(null)}
//               className="mt-6 px-8 py-2 bg-yellow-400 text-black font-bold rounded-full"
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

const API = "https://cpmmarker.onrender.com";

export default function Roulette() {
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
  }, []);

  const loadWheel = async () => {
    try {
      const res = await fetch(`${API}/wheel`);
      const data = await res.json();
      setItems(data || []);
    } catch (e) {
      console.error("Failed to load wheel items");
    }
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
      alert("Promo activated! 🎁 You got 1 free spin");
      setPromoUsed(true);
    } else {
      alert(data.error);
    }
  };

  /* ================= SPIN ================= */
  const spin = async () => {
    if (spinning || !items.length) return;
    if (!user?.id) return alert("Login first");

    setSpinning(true);
    setResult(null);
    setOffset(0);

    const res = await fetch(`${API}/wheel/spin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await res.json();

    const winItem = items.find(i => i.id === data.winId);
    const winIndex = items.findIndex(i => i.id === data.winId);

    const fullWidth = items.length * (itemWidth + gap);

    const finalOffset =
      10 * fullWidth +
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
    }, 5000);
  };

  const renderItems = items.length ? Array(30).fill(items).flat() : [];

  return (
    <div className="min-h-screen bg-[#020305] text-white overflow-hidden font-sans relative">
      <Navbar />

      {/* 🔥 BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-900/40 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-yellow-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      {/* ================= TITLE ================= */}
      <div className="text-center mt-20 relative z-10">
        <h1 className="text-7xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-300 to-orange-500 filter drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
          Ultra Case
        </h1>
        <p className="text-neutral-400 text-sm uppercase tracking-[0.4em] mt-3">Try your luck • Win insane rewards</p>
      </div>

      {/* ================= PROMO ================= */}
      {!promoUsed && (
        <div className="flex justify-center mt-12 gap-0 relative z-10 max-w-lg mx-auto bg-neutral-900/50 p-1 rounded-full border border-white/5 backdrop-blur-sm shadow-xl">
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="ENTER PROMO CODE"
            className="flex-grow px-6 py-3 rounded-l-full bg-transparent border-none text-white placeholder-neutral-600 text-sm font-bold tracking-widest focus:ring-1 focus:ring-yellow-500 focus:outline-none"
          />
          <button
            onClick={redeemPromo}
            className="px-8 py-3 bg-gradient-to-b from-yellow-400 to-orange-500 text-black font-black uppercase text-sm rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 active:scale-95 shadow-lg"
          >
            Redeem
          </button>
        </div>
      )}

      {/* ================= WHEEL ================= */}
      <div className="flex justify-center mt-16 relative z-10">
        
        {/* УКАЗАТЕЛЬ (Neon Line) */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] h-full bg-yellow-400 z-50 shadow-[0_0_15px_#facc15]" />

        {/* Боковые тени для плавного исчезновения предметов */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#020305] via-[#020305]/80 to-transparent z-40 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#020305] via-[#020305]/80 to-transparent z-40 pointer-events-none" />

        <div
          className="overflow-hidden border-y-2 border-white/5 bg-neutral-900/40 backdrop-blur-sm shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          style={{ width: containerWidth, height: 220 }}
        >
          <div
            className="flex items-center h-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.1,0.9,0.2,1)]"
            style={{
              transform: `translateX(-${offset}px)`,
              gap: `${gap}px`,
              paddingLeft: `${containerWidth / 2 - itemWidth / 2}px`
            }}
          >
            {renderItems.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-gradient-to-b from-neutral-800 to-neutral-950 border border-white/5 rounded-2xl flex flex-col items-center justify-center hover:scale-105 hover:border-yellow-500/30 transition-all duration-300 relative group overflow-hidden"
                style={{ width: itemWidth, height: 180 }}
              >
                {/* Эффект свечения при наведении */}
                <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-all duration-300" />
                
                <img 
                  src={item.image_url} 
                  className="w-32 h-24 object-contain filter drop-shadow(0 10px 10px rgba(0,0,0,0.5))" 
                  alt={item.name}
                />
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-3 px-2 text-center truncate w-full relative z-10">
                  {item.name}
                </p>
                
                {/* Полоска редкости внизу (декоративная) */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent shadow-[0_0_10px_#facc15]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BUTTON ================= */}
      <div className="flex justify-center mt-12 relative z-10">
        <button
          onClick={spin}
          disabled={spinning}
          className={`relative group px-20 py-5 rounded-full font-black text-black text-2xl uppercase tracking-tighter italic overflow-hidden transition-all duration-300 transform active:scale-90 ${
            spinning 
            ? "bg-neutral-700 cursor-not-allowed opacity-50" 
            : "hover:scale-105 hover:shadow-[0_0_50px_rgba(234,179,8,0.6)]"
          }`}
        >
          {/* ГРАДИЕНТНЫЙ ФОН КНОПКИ */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-300" />
          {/* Эффект блика при наведении */}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          
          <span className="relative z-10">
            {spinning ? "Spinning..." : "SPIN NOW"}
          </span>
        </button>
      </div>
      
      {/* Декоративная полоса внизу страницы */}
      <div className="mt-20 border-t border-white/5 bg-neutral-900/20 py-6 text-center text-xs text-neutral-700 uppercase tracking-widest relative z-10">
        Fair Play Guaranteed • Secured by EliteGuard™ • 1 SPIN = 500$
      </div>

      {/* ================= RESULT (MODAL) ================= */}
      {result && !spinning && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-[#0b0c11] p-12 rounded-[30px] text-center border border-yellow-400/30 shadow-[0_0_80px_rgba(234,179,8,0.3)] relative overflow-hidden">
            
            {/* Декоративные лучи */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
            
            <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-yellow-400 mb-2 animate-pulse">
              NEW ITEM UNLOCKED
            </h2>
            <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase mb-10 drop-shadow-lg">
              {result.name}
            </h1>
            
            <div className="relative inline-block mb-10">
              <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
              <img src={result.image_url} className="w-[450px] relative z-10 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]" alt={result.name} />
            </div>
            <br />

            <button
              onClick={() => setResult(null)}
              className="mt-6 px-16 py-4 border-2 border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm"
            >
              Collect Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
