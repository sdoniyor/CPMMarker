// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";

// const API = "https://cpmmarker.onrender.com";

// export default function Wheel() {
//   const [items, setItems] = useState<any[]>([]);
//   const [rotation, setRotation] = useState(0);
//   const [spinning, setSpinning] = useState(false);
//   const [result, setResult] = useState<any>(null);

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   useEffect(() => {
//     loadWheel();
//   }, []);

//   const loadWheel = async () => {
//     const res = await fetch(`${API}/wheel`);
//     const data = await res.json();
//     setItems(data);
//   };

//   const spin = async () => {
//     if (spinning || items.length === 0) return;

//     setSpinning(true);
//     setResult(null);

//     const res = await fetch(`${API}/wheel/spin`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: user.id }),
//     });

//     const data = await res.json();
//     const index = data.index;

//     const sector = 360 / items.length;

//     const finalRotation =
//       rotation +
//       360 * 6 +
//       (360 - index * sector - sector / 2);

//     setRotation(finalRotation);

//     setTimeout(() => {
//       setResult(data.win);
//       setSpinning(false);
//     }, 4200);
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center">
//       <Navbar />

//       <h1 className="text-yellow-400 text-3xl font-bold mt-10">
//         WHEEL OF FORTUNE
//       </h1>

//       {/* WHEEL */}
//       <div className="relative mt-16 w-[400px] h-[400px]">

//         {/* POINTER */}
//         <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-50">
//           <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[25px] border-l-transparent border-r-transparent border-b-yellow-400" />
//         </div>

//         {/* WHEEL */}
//         <div
//           className="w-full h-full rounded-full border-4 border-yellow-500 transition-transform duration-[4200ms]"
//           style={{
//             transform: `rotate(${rotation}deg)`,
//           }}
//         >
//           {items.map((item, i) => {
//             const sector = 360 / items.length;

//             return (
//               <div
//                 key={item.id}
//                 className="absolute w-full h-full flex items-start justify-center"
//                 style={{
//                   transform: `rotate(${i * sector}deg)`,
//                 }}
//               >
//                 {/* LINE */}
//                 <div className="absolute w-[2px] h-1/2 bg-yellow-500/30" />

//                 {/* CONTENT */}
//                 <div
//                   className="mt-10 flex flex-col items-center"
//                   style={{
//                     transform: `rotate(${-i * sector}deg)`,
//                   }}
//                 >
//                   {item.image_url && (
//                     <img
//                       src={item.image_url}
//                       className="w-10 h-10 object-contain"
//                     />
//                   )}

//                   <p className="text-[10px] text-white">
//                     {item.title}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* BUTTON */}
//         <button
//           onClick={spin}
//           disabled={spinning}
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
//           w-20 h-20 bg-yellow-500 text-black font-bold rounded-full"
//         >
//           {spinning ? "..." : "SPIN"}
//         </button>
//       </div>

//       {/* RESULT */}
//       {result && (
//         <div className="mt-10 text-center">
//           <p className="text-yellow-400">YOU WON:</p>
//           <h2 className="text-2xl font-bold">{result.title}</h2>
//         </div>
//       )}
//     </div>
//   );
// }






import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

export default function Roulette() {
  const [items, setItems] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const itemWidth = 160; // Сделали карточки побольше
  const gap = 12;
  const containerWidth = 600; // Ширина видимого окна

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadWheel();
  }, []);

  const loadWheel = async () => {
    try {
      const res = await fetch(`${API}/wheel`);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error("Ошибка загрузки:", e);
    }
  };

  const spin = async () => {
    if (spinning || items.length === 0) return;

    // Сброс позиции перед новым стартом, если нужно
    setOffset(0);
    setResult(null);
    
    // Небольшая задержка перед стартом для корректной анимации
    setTimeout(async () => {
      setSpinning(true);

      const res = await fetch(`${API}/wheel/spin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      const winIndex = data.index;

      const iterations = 8; // Больше кругов для эпичности
      const fullListWidth = items.length * (itemWidth + gap);
      
      // Рандомное смещение внутри карточки, чтобы не всегда по центру останавливалось
      const randomInCard = Math.floor(Math.random() * (itemWidth * 0.8));
      
      const finalOffset = 
        (iterations * fullListWidth) + 
        (winIndex * (itemWidth + gap)) - 
        (containerWidth / 2) + (itemWidth / 2) + randomInCard;

      setOffset(finalOffset);

      setTimeout(() => {
        setResult(data.win);
        setSpinning(false);
      }, 5000); // Увеличили время до 5 сек
    }, 50);
  };

  // Умножаем список предметов для длинной ленты
  const renderItems = Array(20).fill(items).flat();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center font-sans">
      <Navbar />

      {/* ФОНОВЫЙ ДЕКОР */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-5xl px-4">
        <div className="text-center mt-12 mb-8">
          <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 uppercase">
            Legendary Case
          </h1>
          <p className="text-gray-400 mt-2 tracking-widest text-sm uppercase">Try your luck and win exclusive cars</p>
        </div>

        {/* РУЛЕТКА КОНТЕЙНЕР */}
        <div className="relative w-full max-w-[800px] flex justify-center">
          
          {/* ВЕРХНИЙ И НИЖНИЙ УКАЗАТЕЛЬ */}
          <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 z-50 w-1 h-10 bg-yellow-500 shadow-[0_0_15px_#facc15]" />
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 z-50 w-1 h-10 bg-yellow-500 shadow-[0_0_15px_#facc15]" />

          {/* ГЛАВНОЕ ОКНО */}
          <div 
            className="w-full h-[200px] bg-neutral-900/50 backdrop-blur-md border-y border-white/10 overflow-hidden relative shadow-2xl"
            style={{ width: `${containerWidth}px` }}
          >
            {/* ГРАДИЕНТ ПО БОКАМ (ЗАТЕМНЕНИЕ) */}
            <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

            <div
              className="flex items-center h-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.1, 0, 0, 1)]"
              style={{
                transform: `translateX(-${offset}px)`,
                gap: `${gap}px`,
              }}
            >
              {renderItems.map((item, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 group relative overflow-hidden bg-gradient-to-b from-neutral-800 to-neutral-900 border border-white/5 rounded-xl flex flex-col items-center justify-center transition-all duration-300`}
                  style={{ width: `${itemWidth}px`, height: `160px` }}
                >
                  {/* Изображение с эффектом свечения */}
                  <div className="relative z-10 p-2 transform group-hover:scale-110 transition-transform">
                     {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-28 h-20 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                     ) : (
                        <div className="w-28 h-20 bg-neutral-700 animate-pulse rounded-md" />
                     )}
                  </div>

                  <p className="mt-2 text-[11px] font-bold text-gray-300 uppercase tracking-tight z-10">
                    {item.title || "Loading..."}
                  </p>
                  
                  {/* Полоска снизу в зависимости от редкости (можно добавить логику) */}
                  <div className="absolute bottom-0 left-0 w-full h-[4px] bg-yellow-500 shadow-[0_-5px_10px_rgba(234,179,8,0.3)]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* КНОПКА И СТАТИСТИКА */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <button
            onClick={spin}
            disabled={spinning}
            className={`relative group px-16 py-4 rounded-xl font-black text-xl uppercase tracking-tighter overflow-hidden transition-all active:scale-95 ${
              spinning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-400 group-hover:from-yellow-500 group-hover:to-yellow-300 transition-all" />
            <span className="relative text-black">{spinning ? "Rolling..." : "Open for 500$"}</span>
          </button>

          {/* Доп контент, чтобы страница не была пустой */}
          <div className="grid grid-cols-3 gap-8 mt-16 w-full text-center">
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                <p className="text-yellow-500 font-bold text-2xl">100+</p>
                <p className="text-gray-500 text-xs uppercase">Users Online</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                <p className="text-yellow-500 font-bold text-2xl">5.2k</p>
                <p className="text-gray-500 text-xs uppercase">Items Dropped</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                <p className="text-yellow-500 font-bold text-2xl">Legendary</p>
                <p className="text-gray-500 text-xs uppercase">Case Type</p>
            </div>
          </div>
        </div>

        {/* МОДАЛКА ВЫИГРЫША */}
        {result && !spinning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
             <div className="text-center p-10 border border-yellow-500/30 rounded-3xl bg-neutral-900 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                <p className="text-yellow-500 tracking-widest uppercase mb-2">Congratulations!</p>
                <h2 className="text-5xl font-black text-white mb-6 italic">{result.title}</h2>
                <img src={result.image_url} className="w-80 mx-auto drop-shadow-[0_20px_30px_rgba(234,179,8,0.5)] mb-8" />
                <button 
                  onClick={() => setResult(null)}
                  className="bg-white text-black px-10 py-3 rounded-lg font-bold uppercase hover:bg-yellow-500 transition-colors"
                >
                  Collect Prize
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
