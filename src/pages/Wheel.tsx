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
  
  // Реф для прямого доступа к DOM (самый надежный способ для анимаций)
  const trackRef = useRef<HTMLDivElement>(null);

  const itemWidth = 160; 
  const gap = 12;
  const containerWidth = 600;

  useEffect(() => {
    loadWheel();
  }, []);

  const loadWheel = async () => {
    const res = await fetch(`${API}/wheel`);
    const data = await res.json();
    setItems(data);
  };

  const spin = async () => {
    if (spinning || items.length === 0) return;

    // 1. Сбрасываем всё в начальное состояние БЕЗ анимации
    setSpinning(true);
    setResult(null);
    setOffset(0);

    // Ждем один фрейм, чтобы браузер применил offset: 0
    requestAnimationFrame(async () => {
      const res = await fetch(`${API}/wheel/spin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1 }), // Замени на user.id
      });

      const data = await res.json();
      const winIndex = data.index;

      const iterations = 6; 
      const fullListWidth = items.length * (itemWidth + gap);
      
      // Вычисляем финальную точку
      const finalPoint = 
        (iterations * fullListWidth) + 
        (winIndex * (itemWidth + gap)) - 
        (containerWidth / 2) + (itemWidth / 2);

      // 2. Запускаем анимацию в следующем фрейме
      requestAnimationFrame(() => {
        setOffset(finalPoint);
      });

      // 3. Показываем результат после завершения (5 секунд)
      setTimeout(() => {
        setResult(data.win);
        setSpinning(false);
      }, 5100);
    });
  };

  const renderItems = Array(15).fill(items).flat();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center">
      <Navbar />

      <div className="mt-20 flex flex-col items-center">
        <h1 className="text-4xl font-black mb-10 text-yellow-500 italic">CAR MARKET ROULETTE</h1>

        {/* КОНТЕЙНЕР */}
        <div className="relative border-y-2 border-yellow-500/20 bg-neutral-900/50 shadow-2xl overflow-hidden" 
             style={{ width: `${containerWidth}px`, height: '180px' }}>
          
          {/* УКАЗАТЕЛЬ (Линия по центру) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-1 h-full bg-yellow-400 shadow-[0_0_15px_#facc15]" />
          
          {/* ТЕНИ ПО БОКАМ */}
          <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

          {/* ЛЕНТА — ТУТ ГЛАВНЫЕ ИЗМЕНЕНИЯ */}
          <div
            ref={trackRef}
            className="flex items-center h-full"
            style={{
              // Мы не используем классы Tailwind для транзишена, пишем напрямую:
              transition: spinning ? 'transform 5s cubic-bezier(0.1, 0, 0.1, 1)' : 'none',
              transform: `translateX(-${offset}px)`,
              gap: `${gap}px`,
              paddingLeft: '20px'
            }}
          >
            {renderItems.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[160px] h-[140px] bg-neutral-800 border border-white/5 rounded-xl flex flex-col items-center justify-center"
              >
                <img src={item.image_url} alt="" className="w-24 h-16 object-contain" />
                <p className="text-[10px] mt-2 text-gray-400 font-bold uppercase">{item.title}</p>
                <div className="absolute bottom-0 w-full h-1 bg-yellow-600/30" />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className="mt-12 px-20 py-4 bg-yellow-500 text-black font-black text-xl rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {spinning ? "ROLLING..." : "START SPIN"}
        </button>

        {result && !spinning && (
          <div className="mt-10 p-6 bg-yellow-500/10 border border-yellow-500 rounded-2xl text-center animate-bounce">
            <p className="text-yellow-500 text-sm">YOU WON:</p>
            <h2 className="text-4xl font-bold italic uppercase">{result.title}</h2>
          </div>
        )}
      </div>
    </div>
  );
}
