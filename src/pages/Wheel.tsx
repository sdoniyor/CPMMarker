import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

export default function Roulette() {
  const [items, setItems] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Реф для прямого доступа к ленте (решает проблему с анимацией)
  const trackRef = useRef<HTMLDivElement>(null);

  const itemWidth = 160; 
  const gap = 12;
  const containerWidth = 600;

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
      console.error("Ошибка загрузки данных", e);
    }
  };

  const spin = async () => {
    if (spinning || items.length === 0 || !trackRef.current) return;

    setSpinning(true);
    setResult(null);

    // 1. Мгновенно сбрасываем рулетку в 0 БЕЗ анимации
    trackRef.current.style.transition = "none";
    trackRef.current.style.transform = "translateX(0px)";
    
    // ПРИНУДИТЕЛЬНЫЙ REFOW (Магия для браузера)
    // Эта строчка заставляет браузер "заметить" сброс в ноль
    trackRef.current.offsetHeight; 

    try {
      const res = await fetch(`${API}/wheel/spin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id || 1 }),
      });

      const data = await res.json();
      const winIndex = data.index;

      const iterations = 8; 
      const fullListWidth = items.length * (itemWidth + gap);
      
      const finalOffset = 
        (iterations * fullListWidth) + 
        (winIndex * (itemWidth + gap)) - 
        (containerWidth / 2) + (itemWidth / 2);

      // 2. Запускаем анимацию
      trackRef.current.style.transition = "transform 5s cubic-bezier(0.15, 0, 0.05, 1)";
      trackRef.current.style.transform = `translateX(-${finalOffset}px)`;

      setTimeout(() => {
        setResult(data.win);
        setSpinning(false);
      }, 5100);

    } catch (e) {
      setSpinning(false);
      alert("Ошибка сервера");
    }
  };

  // Делаем ленту очень длинной
  const renderItems = Array(25).fill(items).flat();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center overflow-x-hidden">
      <Navbar />

      {/* ФОНОВЫЙ ЭФФЕКТ */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center mt-20">
        <h1 className="text-5xl font-black italic text-yellow-500 mb-10 tracking-tighter shadow-yellow-500/20 drop-shadow-lg">
          ELITE MARKET
        </h1>

        {/* ОСНОВНОЙ ВИДЖЕТ */}
        <div className="relative">
          {/* СЕЛЕКТОР (ЛИНИЯ) */}
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-50 w-1 h-[200px] bg-yellow-400 shadow-[0_0_20px_#facc15]" />
          
          {/* ОКНО ПРОСМОТРА */}
          <div 
            className="relative h-[180px] bg-neutral-900/80 backdrop-blur-md border-y-2 border-white/5 overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"
            style={{ width: `${containerWidth}px` }}
          >
            {/* ГРАДИЕНТЫ ЗАТЕМНЕНИЯ */}
            <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-r from-black via-transparent to-black opacity-90" />

            {/* ТРЕК (ЛЕНТА) */}
            <div
              ref={trackRef}
              className="flex items-center h-full"
              style={{ gap: `${gap}px`, paddingLeft: "10px" }}
            >
              {renderItems.map((item, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[160px] h-[150px] bg-neutral-800/50 border border-white/10 rounded-2xl flex flex-col items-center justify-center group"
                >
                  <img 
                    src={item.image_url} 
                    className="w-28 h-20 object-contain transition-transform group-hover:scale-110 duration-500" 
                  />
                  <p className="text-[10px] mt-2 font-black text-gray-400 uppercase tracking-widest">{item.title}</p>
                  <div className="absolute bottom-0 w-full h-1 bg-yellow-500/20 group-hover:bg-yellow-500/50 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* КНОПКА */}
        <button
          onClick={spin}
          disabled={spinning}
          className={`mt-12 px-16 py-5 rounded-2xl font-black text-2xl uppercase transition-all duration-300 transform active:scale-90 ${
            spinning 
            ? "bg-neutral-700 text-gray-500 cursor-not-allowed" 
            : "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.5)] shadow-lg"
          }`}
        >
          {spinning ? "Rolling..." : "Open Case"}
        </button>

        {/* НИЖНЯЯ СТАТИСТИКА */}
        <div className="flex gap-10 mt-20 opacity-40 uppercase font-bold text-xs tracking-[0.2em]">
            <div className="flex flex-col items-center italic"><span>Provably Fair</span></div>
            <div className="flex flex-col items-center italic"><span>Instant Delivery</span></div>
            <div className="flex flex-col items-center italic"><span>Secure</span></div>
        </div>
      </div>

      {/* МОДАЛКА ВЫИГРЫША */}
      {result && !spinning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in zoom-in duration-300">
           <div className="text-center">
              <p className="text-yellow-500 text-xl font-bold mb-4 animate-pulse uppercase tracking-widest">New Win!</p>
              <h2 className="text-6xl font-black text-white italic mb-10">{result.title}</h2>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-yellow-500 blur-[100px] opacity-20" />
                <img src={result.image_url} className="w-[500px] relative z-10" />
              </div>
              <button 
                onClick={() => setResult(null)}
                className="mt-10 px-12 py-4 border-2 border-yellow-500 text-yellow-500 rounded-full font-bold hover:bg-yellow-500 hover:text-black transition-all uppercase"
              >
                Close
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
