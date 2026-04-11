// // import { useEffect, useState } from "react";
// // import Navbar from "../components/Navbar";

// // const API = "https://cpmmarker.onrender.com";

// // export default function Roulette() {
// //   const [items, setItems] = useState<any[]>([]);
// //   const [offset, setOffset] = useState(0);
// //   const [spinning, setSpinning] = useState(false);
// //   const [result, setResult] = useState<any>(null);

// //   const itemWidth = 160;
// //   const gap = 12;
// //   const containerWidth = 600;

// //   const user = JSON.parse(localStorage.getItem("user") || "{}");

// //   useEffect(() => {
// //     loadWheel();
// //   }, []);

// //   const loadWheel = async () => {
// //     const res = await fetch(`${API}/wheel`);
// //     const data = await res.json();
// //     setItems(data || []);
// //   };

// //   const spin = async () => {
// //     if (spinning || items.length === 0) return;

// //     if (!user?.id) {
// //       alert("Ты не залогинен");
// //       return;
// //     }

// //     setSpinning(true);
// //     setResult(null);

// //     const res = await fetch(`${API}/wheel/spin`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ userId: user.id }),
// //     });

// //     const data = await res.json();

// //     console.log("SPIN:", data);

// //     if (!data.success || typeof data.index !== "number") {
// //       console.error("INDEX ERROR", data);
// //       setSpinning(false);
// //       return;
// //     }

// //     const winIndex = data.index;

// //     const iterations = 8;
// //     const fullWidth = items.length * (itemWidth + gap);

// //     const randomOffset = Math.floor(Math.random() * (itemWidth * 0.8));

// //     const finalOffset =
// //       iterations * fullWidth +
// //       winIndex * (itemWidth + gap) -
// //       containerWidth / 2 +
// //       itemWidth / 2 +
// //       randomOffset;

// //     // 💥 фикс анимации
// //     setOffset(0);

// //     requestAnimationFrame(() => {
// //       requestAnimationFrame(() => {
// //         setOffset(finalOffset);
// //       });
// //     });

// //     setTimeout(() => {
// //       setResult(data.win);
// //       setSpinning(false);
// //     }, 5000);
// //   };

// //   const renderItems = Array(20).fill(items).flat();

// //   return (
// //     <div className="min-h-screen bg-black text-white flex flex-col items-center">
// //       <Navbar />

// //       <h1 className="text-4xl mt-10 mb-6">Roulette</h1>

// //       <div className="relative">
// //         <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-yellow-400 z-50" />

// //         <div
// //           className="overflow-hidden border border-white/10"
// //           style={{ width: containerWidth, height: 200 }}
// //         >
// //           <div
// //             className="flex items-center h-full transition-transform duration-[5000ms] ease-out"
// //             style={{
// //               transform: `translateX(-${offset}px)`,
// //               gap: `${gap}px`,
// //             }}
// //           >
// //             {renderItems.map((item, i) => (
// //               <div
// //                 key={i}
// //                 className="flex-shrink-0 bg-neutral-800 rounded-lg flex flex-col items-center justify-center"
// //                 style={{ width: itemWidth, height: 160 }}
// //               >
// //                 <img
// //                   src={item.image_url}
// //                   className="w-24 h-16 object-contain"
// //                 />
// //                 <p className="text-xs mt-2">{item.title}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       <button
// //         onClick={spin}
// //         disabled={spinning}
// //         className="mt-10 px-10 py-3 bg-yellow-400 text-black font-bold rounded"
// //       >
// //         {spinning ? "Rolling..." : "SPIN"}
// //       </button>

// //       {result && !spinning && (
// //         <div className="mt-6 text-center">
// //           <h2>You won:</h2>
// //           <img src={result.image_url} className="w-40 mx-auto" />
// //           <p>{result.title}</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



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
//   const gap = 12;
//   const containerWidth = 600;

//   useEffect(() => {
//     loadWheel();
//   }, []);

//   /* ================= LOAD WHEEL ================= */
//   const loadWheel = async () => {
//     try {
//       const res = await fetch(`${API}/wheel`);
//       if (!res.ok) return;

//       const data = await res.json();
//       setItems(data || []);
//     } catch (e) {
//       console.log("wheel load error");
//     }
//   };

//   /* ================= SPIN ================= */
//   const spin = async () => {
//     if (spinning || items.length === 0) return;

//     if (!user?.id) {
//       alert("Login first");
//       return;
//     }

//     setSpinning(true);
//     setResult(null);

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

//     const winIndex = data.index;

//     const fullWidth = items.length * (itemWidth + gap);
//     const iterations = 8;

//     const randomOffset = Math.floor(Math.random() * (itemWidth * 0.5));

//     const finalOffset =
//       iterations * fullWidth +
//       winIndex * (itemWidth + gap) -
//       containerWidth / 2 +
//       itemWidth / 2 +
//       randomOffset;

//     setOffset(0);

//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         setOffset(finalOffset);
//       });
//     });

//     setTimeout(() => {
//       setResult(data.win);
//       setSpinning(false);
//     }, 5000);
//   };

//   const renderItems = items.length
//     ? Array(20).fill(items).flat()
//     : [];

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center">
//       <Navbar />

//       <h1 className="text-4xl mt-10 mb-6">Roulette</h1>

//       <div className="relative">
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
//                 <img
//                   src={item.image_url}
//                   className="w-24 h-16 object-contain"
//                 />
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

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const itemWidth = 160;
  const gap = 16;
  const containerWidth = 800; // Немного увеличим для солидности

  useEffect(() => {
    loadWheel();
  }, []);

  const loadWheel = async () => {
    try {
      const res = await fetch(`${API}/wheel`);
      if (!res.ok) return;
      const data = await res.json();
      setItems(data || []);
    } catch (e) {
      console.log("wheel load error");
    }
  };

  const spin = async () => {
    if (spinning || items.length === 0) return;

    if (!user?.id) {
      alert("Login first");
      return;
    }

    setSpinning(true);
    setResult(null);
    setOffset(0); // Сброс позиции

    try {
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

      const winIndex = data.index;
      const fullWidth = items.length * (itemWidth + gap);
      const iterations = 10; // Больше кругов для эпичности
      const randomInItem = Math.floor(Math.random() * (itemWidth * 0.7)); // Случайная точка в карточке

      const finalOffset =
        iterations * fullWidth +
        winIndex * (itemWidth + gap) -
        containerWidth / 2 +
        itemWidth / 2 +
        randomInItem;

      // Принудительный reflow для сброса анимации
      setTimeout(() => {
        setOffset(finalOffset);
      }, 50);

      setTimeout(() => {
        setResult(data.win);
        setSpinning(false);
      }, 5500);
    } catch (e) {
      setSpinning(false);
    }
  };

  const renderItems = items.length ? Array(30).fill(items).flat() : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center relative overflow-hidden">
      <Navbar />

      {/* --- ДЕКОРАТИВНЫЕ ФОНОВЫЕ ЭЛЕМЕНТЫ --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      {/* --- ЗАГОЛОВОК --- */}
      <div className="z-10 text-center mt-16 mb-12">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
          Roulette <span className="text-yellow-400">Case</span>
        </h1>
        <p className="text-neutral-500 uppercase tracking-[0.3em] text-sm mt-2">Win exclusive items and upgrades</p>
      </div>

      {/* --- РУЛЕТКА --- */}
      <div className="z-10 relative flex flex-col items-center">
        
        {/* Указатели (Стрелки) */}
        <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 z-50">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 filter drop-shadow(0 0 10px #facc15)" />
        </div>
        <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 z-50 rotate-180">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 filter drop-shadow(0 0 10px #facc15)" />
        </div>

        {/* Контейнер ленты */}
        <div
          className="relative overflow-hidden bg-neutral-900/40 backdrop-blur-sm border-y border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          style={{ width: containerWidth, height: 220 }}
        >
          {/* Боковые тени для плавного исчезновения предметов */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-40" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-40" />

          {/* Центральная линия */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-yellow-400/30 z-30" />

          {/* Сама лента */}
          <div
            className="flex items-center h-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.15,0,0.05,1)]"
            style={{
              transform: `translateX(-${offset}px)`,
              gap: `${gap}px`,
              paddingLeft: `${containerWidth / 2 - itemWidth / 2}px`
            }}
          >
            {renderItems.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-gradient-to-b from-neutral-800 to-neutral-900 border border-white/5 rounded-xl flex flex-col items-center justify-center relative group"
                style={{ width: itemWidth, height: 180 }}
              >
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500 animate-pulse" />
                <img
                  src={item.image_url}
                  className="w-32 h-24 object-contain filter drop-shadow(0 10px 10px rgba(0,0,0,0.5))"
                  alt={item.title}
                />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-2">{item.name || item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- КНОПКА --- */}
      <div className="z-10 flex flex-col items-center gap-4">
        <button
          onClick={spin}
          disabled={spinning}
          className={`mt-12 group relative px-16 py-5 bg-yellow-400 text-black font-black italic uppercase tracking-tighter rounded-full transition-all duration-300 transform active:scale-95 overflow-hidden ${
            spinning ? "opacity-50 cursor-not-allowed" : "hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]"
          }`}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 text-xl">{spinning ? "Rolling..." : "Open Case"}</span>
        </button>
        <p className="text-neutral-600 text-[10px] uppercase tracking-widest">Fair play guaranteed • 1 spin = 500$</p>
      </div>

      {/* --- МОДАЛКА ВЫИГРЫША --- */}
      {result && !spinning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="text-center p-12 border border-yellow-500/20 rounded-[40px] bg-neutral-900 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />
              <p className="text-yellow-400 font-bold uppercase tracking-widest mb-2 animate-bounce">Congratulations!</p>
              <h2 className="text-5xl font-black italic text-white mb-8">{result.name || result.title}</h2>
              <div className="relative inline-block mb-10">
                 <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
                 <img src={result.image_url} className="w-72 relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" />
              </div>
              <br />
              <button 
                onClick={() => setResult(null)}
                className="px-12 py-3 bg-white text-black font-bold rounded-full hover:bg-yellow-400 transition-colors uppercase text-sm"
              >
                Claim Item
              </button>
           </div>
        </div>
      )}

      {/* --- СТАТИСТИКА (ДЛЯ ЗАПОЛНЕНИЯ ПУСТОТЫ) --- */}
      <div className="mt-20 z-10 grid grid-cols-3 gap-12 border-t border-white/5 pt-10 mb-20">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">1,240</p>
          <p className="text-neutral-500 text-[10px] uppercase tracking-widest">Users Online</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">42,901</p>
          <p className="text-neutral-500 text-[10px] uppercase tracking-widest">Cases Opened</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">100%</p>
          <p className="text-neutral-500 text-[10px] uppercase tracking-widest">Provably Fair</p>
        </div>
      </div>
    </div>
  );
}
