// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function Roulette() {
//   const [items, setItems] = useState<any[]>([]);
//   const [offset, setOffset] = useState(0);
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState<any>(null);

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   const itemWidth = 160;
//   const gap = 16;
//   const containerWidth = 800;

//   useEffect(() => {
//     loadWheel();
//   }, []);

//   const loadWheel = async () => {
//     const res = await fetch(`${API}/wheel`);
//     const data = await res.json();
//     setItems(data || []);
//   };

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

//     if (!data.success) {
//       setSpinning(false);
//       return;
//     }

//     // 🔥 НАХОДИМ ПРЕДМЕТ ПО ID (ВАЖНО)
//     const winItem = items.find(i => i.id === data.winId);

//     if (!winItem) {
//       console.error("WIN ITEM NOT FOUND");
//       setSpinning(false);
//       return;
//     }

//     const winIndex = items.findIndex(i => i.id === data.winId);

//     const fullWidth = items.length * (itemWidth + gap);
//     const iterations = 10;

//     const finalOffset =
//       iterations * fullWidth +
//       winIndex * (itemWidth + gap) -
//       containerWidth / 2 +
//       itemWidth / 2;

//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         setOffset(finalOffset);
//       });
//     });

//     setTimeout(() => {
//       setResult(winItem); // 🔥 ВСЕГДА ПРАВИЛЬНЫЙ
//       setSpinning(false);
//     }, 5000);
//   };

//   const renderItems = items.length ? Array(30).fill(items).flat() : [];

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center">
//       <Navbar />

//       <h1 className="text-4xl mt-10">Roulette</h1>

//       <div className="relative mt-10">
//         <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-yellow-400 z-50" />

//         <div
//           className="overflow-hidden border border-white/10"
//           style={{ width: containerWidth, height: 200 }}
//         >
//           <div
//             className="flex items-center h-full transition-transform duration-[5000ms] ease-out"
//             style={{
//               transform: `translateX(-${offset}px)`,
//               gap: `${gap}px`,
//             }}
//           >
//             {renderItems.map((item, i) => (
//               <div
//                 key={i}
//                 className="flex-shrink-0 bg-neutral-800 rounded-lg flex flex-col items-center justify-center"
//                 style={{ width: itemWidth, height: 160 }}
//               >
//                 <img src={item.image_url} className="w-24 h-16 object-contain" />
//                 <p className="text-xs mt-2">{item.name || item.title}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={spin}
//         disabled={spinning}
//         className="mt-10 px-10 py-3 bg-yellow-400 text-black font-bold rounded"
//       >
//         {spinning ? "Rolling..." : "SPIN"}
//       </button>

//       {result && !spinning && (
//         <div className="mt-6 text-center">
//           <h2>You won:</h2>
//           <img src={result.image_url} className="w-40 mx-auto" />
//           <p>{result.name || result.title}</p>
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
    <div className="min-h-screen bg-[#05060a] text-white overflow-hidden">

      <Navbar />

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600 blur-[180px] opacity-30" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-yellow-400 blur-[180px] opacity-20" />

      {/* ================= TITLE ================= */}
      <div className="text-center mt-20">
        <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
          ULTRA CASE ROULETTE
        </h1>
        <p className="text-gray-400 mt-2">Try your luck. Win insane rewards.</p>
      </div>

      {/* ================= PROMO ================= */}
      {!promoUsed && (
        <div className="flex justify-center mt-10 gap-3">
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Enter promo code"
            className="px-4 py-2 rounded bg-black border border-white/20"
          />
          <button
            onClick={redeemPromo}
            className="px-6 py-2 bg-yellow-400 text-black font-bold rounded"
          >
            REDEEM
          </button>
        </div>
      )}

      {/* ================= WHEEL ================= */}
      <div className="flex justify-center mt-16 relative">

        <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-yellow-400 z-50" />

        <div
          className="overflow-hidden border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(255,215,0,0.1)]"
          style={{ width: containerWidth, height: 220 }}
        >
          <div
            className="flex items-center h-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.1,0.9,0.2,1)]"
            style={{
              transform: `translateX(-${offset}px)`,
              gap: `${gap}px`,
            }}
          >
            {renderItems.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-xl flex flex-col items-center justify-center hover:scale-105 transition"
                style={{ width: itemWidth, height: 180 }}
              >
                <img src={item.image_url} className="w-28 h-20 object-contain" />
                <p className="text-[10px] uppercase text-gray-400 mt-2">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BUTTON ================= */}
      <div className="flex justify-center mt-12">
        <button
          onClick={spin}
          disabled={spinning}
          className="px-14 py-4 rounded-full font-black text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 transition disabled:opacity-50"
        >
          {spinning ? "Spinning..." : "SPIN NOW"}
        </button>
      </div>

      {/* ================= RESULT ================= */}
      {result && !spinning && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-[#111] p-10 rounded-3xl text-center border border-yellow-400/20">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              YOU WON
            </h2>
            <img src={result.image_url} className="w-64 mx-auto" />
            <p className="mt-4 text-white">{result.name}</p>

            <button
              onClick={() => setResult(null)}
              className="mt-6 px-8 py-2 bg-yellow-400 text-black font-bold rounded-full"
            >
              CLAIM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
