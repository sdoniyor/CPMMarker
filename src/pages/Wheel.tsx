// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";

// // ЗАМЕНИ НА РЕАЛЬНЫЙ URL ТВОЕГО API
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
//     try {
//       const res = await fetch(`${API}/wheel`);
//       const data = await res.json();
//       setItems(data);
//     } catch (error) {
//       console.error("Ошибка загрузки колеса:", error);
//     }
//   };

//   const spin = async () => {
//     if (spinning || items.length === 0) return;

//     setSpinning(true);
//     setResult(null);

//     try {
//       const res = await fetch(`${API}/wheel/spin`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user.id }),
//       });

//       const data = await res.json();
//       const index = data.index; 
//       const sectorAngle = 360 / items.length;

//       // РАСЧЕТ УГЛА ОСТАНОВКИ
//       // Учитываем текущий поворот, делаем 6 полных оборотов и докручиваем
//       // до центра нужного сектора под стрелкой (вверху).
//       const currentRotation = rotation;
//       const stopAt = 360 - (index * sectorAngle) - (sectorAngle / 2);
//       const target = currentRotation + (360 * 6) + stopAt;

//       setRotation(target);

//       setTimeout(() => {
//         setResult(data.win);
//         setSpinning(false);
//       }, 4200); 
//     } catch (error) {
//       console.error("Ошибка при вращении:", error);
//       setSpinning(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#05070d] text-white overflow-hidden relative font-sans">
//       <Navbar />

//       {/* BACKGROUND GLOWS - Фоновое свечение */}
//       <div className="absolute w-[800px] h-[800px] bg-yellow-600/10 blur-[180px] -top-40 -left-40 rounded-full z-0" />
//       <div className="absolute w-[600px] h-[600px] bg-blue-600/5 blur-[150px] bottom-0 right-0 rounded-full z-0" />

//       {/* TITLE SECTION - Заголовок */}
//       <div className="text-center pt-16 relative z-10">
//         <h1 className="text-yellow-400 text-4xl font-black tracking-[0.5em] drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
//           WHEEL OF FORTUNE
//         </h1>
//         <div className="flex items-center justify-center gap-4 mt-2">
//           <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/20" />
//           <p className="text-white/40 text-xs uppercase tracking-widest">
//             Spin & Win Exclusive Rewards
//           </p>
//           <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/20" />
//         </div>
//       </div>

//       {/* MAIN WHEEL AREA - Основная область колеса */}
//       <div className="flex justify-center mt-12 relative z-10">
        
//         {/* Внешние декоративные кольца (Орбиты) */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] border border-white/5 rounded-full" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] border border-white/5 rounded-full opacity-50" />
        
//         {/* ARROW - Указатель */}
//         <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 z-30">
//           <div className="w-8 h-8 bg-yellow-500 clip-path-triangle shadow-[0_0_20px_rgba(234,179,8,0.6)]" 
//                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
//         </div>

//         <div className="relative w-[400px] h-[400px]">
          
//           {/* Декоративные точки по кругу (как в казино) */}
//           {[...Array(12)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-2 h-2 bg-yellow-500/40 rounded-full z-20"
//               style={{
//                 top: '50%',
//                 left: '50%',
//                 transform: `rotate(${i * 30}deg) translateY(-210px) translateX(-50%)`,
//               }}
//             />
//           ))}

//           {/* OUTER GLOW - Внешнее свечение колеса */}
//           <div className="absolute inset-[-10px] rounded-full bg-yellow-500/5 blur-2xl" />

//           {/* THE ACTUAL WHEEL - Само колесо */}
//           <div
//             className="w-full h-full rounded-full border-[10px] border-[#1a1d24] 
//             transition-transform duration-[4200ms] cubic-bezier(0.15, 0, 0.15, 1) relative overflow-hidden 
//             shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(0,0,0,0.5)] bg-[#0a0c12]"
//             style={{ 
//               transform: `rotate(${rotation}deg)`,
//               outline: '4px solid #eab30833' 
//             }}
//           >
//             {items.map((item, i) => {
//   const sectorAngle = 360 / items.length;
//   const angle = sectorAngle * i;

//   return (
//     <div
//       key={item.id}
//       className="absolute inset-0 flex items-center justify-center"
//       style={{
//         transform: `rotate(${angle}deg)`,
//       }}
//     >
//       {/* LINE */}
//       <div className="absolute w-[2px] h-1/2 bg-yellow-500/20 origin-bottom" />

//       {/* CONTENT - ИДЕАЛЬНЫЙ РАДИУС */}
//       <div
//         className="flex flex-col items-center"
//         style={{
//           transform: `translateY(-150px) rotate(${-angle - rotation}deg)`,
//           transformOrigin: "center",
//         }}
//       >
//         {/* IMAGE */}
//         {item.image_url && (
//           <img
//             src={item.image_url}
//             className="w-16 h-16 object-contain mb-1"
//             style={{
//               transform: `rotate(${angle + rotation}deg)`,
//             }}
//           />
//         )}

//         {/* TEXT */}
//         <p
//           className="text-[10px] font-bold text-white/60 uppercase whitespace-nowrap"
//           style={{
//             transform: `rotate(${angle + rotation}deg)`,
//           }}
//         >
//           {item.title}
//         </p>
//       </div>
//     </div>
//   );
// })}
//           </div>

//           {/* CENTER HUB & SPIN BUTTON - Центр и кнопка */}
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
//             {/* Декоративная подложка под кнопку */}
//             <div className="absolute inset-[-8px] rounded-full bg-[#05070d] shadow-xl" />
            
//             <button
//               onClick={spin}
//               disabled={spinning}
//               className={`
//                 relative w-24 h-24 rounded-full 
//                 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700
//                 text-black font-black text-lg tracking-tighter
//                 shadow-[0_0_30px_rgba(234,179,8,0.5)]
//                 transition-all duration-300
//                 ${spinning ? 'opacity-80 scale-95' : 'hover:scale-105 hover:shadow-[0_0_50px_rgba(234,179,8,0.8)] active:scale-90'}
//                 flex items-center justify-center flex-col
//               `}
//             >
//               <span className="leading-none">{spinning ? "..." : "SPIN"}</span>
//               {!spinning && <span className="text-[8px] mt-1 opacity-70">READY</span>}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* RESULT DISPLAY - Отображение результата */}
//       <div className="h-24 flex items-center justify-center mt-8 relative z-10">
//         {result && (
//           <div className="text-center animate-[bounce_1s_infinite]">
//             <p className="text-yellow-400 text-sm font-bold tracking-[0.2em] uppercase">
//               Congratulations!
//             </p>
//             <p className="text-white text-3xl font-black mt-1 drop-shadow-lg">
//               {result.title}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

export default function Wheel() {
  const [items, setItems] = useState<any[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

    setSpinning(true);
    setResult(null);

    const res = await fetch(`${API}/wheel/spin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await res.json();
    const index = data.index;

    const sector = 360 / items.length;

    const finalRotation =
      rotation +
      360 * 6 +
      (360 - index * sector - sector / 2);

    setRotation(finalRotation);

    setTimeout(() => {
      setResult(data.win);
      setSpinning(false);
    }, 4200);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <Navbar />

      <h1 className="text-yellow-400 text-3xl font-bold mt-10">
        WHEEL OF FORTUNE
      </h1>

      {/* WHEEL */}
      <div className="relative mt-16 w-[400px] h-[400px]">

        {/* POINTER */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-50">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[25px] border-l-transparent border-r-transparent border-b-yellow-400" />
        </div>

        {/* WHEEL */}
        <div
          className="w-full h-full rounded-full border-4 border-yellow-500 transition-transform duration-[4200ms]"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {items.map((item, i) => {
            const sector = 360 / items.length;

            return (
              <div
                key={item.id}
                className="absolute w-full h-full flex items-start justify-center"
                style={{
                  transform: `rotate(${i * sector}deg)`,
                }}
              >
                {/* LINE */}
                <div className="absolute w-[2px] h-1/2 bg-yellow-500/30" />

                {/* CONTENT */}
                <div
                  className="mt-10 flex flex-col items-center"
                  style={{
                    transform: `rotate(${-i * sector}deg)`,
                  }}
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      className="w-10 h-10 object-contain"
                    />
                  )}

                  <p className="text-[10px] text-white">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* BUTTON */}
        <button
          onClick={spin}
          disabled={spinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-20 h-20 bg-yellow-500 text-black font-bold rounded-full"
        >
          {spinning ? "..." : "SPIN"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-10 text-center">
          <p className="text-yellow-400">YOU WON:</p>
          <h2 className="text-2xl font-bold">{result.title}</h2>
        </div>
      )}
    </div>
  );
}
