import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

export default function Roulette() {
  const [items, setItems] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);

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
      setItems(data || []);
    } catch (e) {
      console.error("Ошибка загрузки:", e);
    }
  };

  const spin = async () => {
    if (spinning || items.length === 0) return;

    setSpinning(true);
    setResult(null);

    try {
      // получаем результат
      const res = await fetch(`${API}/wheel/spin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (typeof data.index !== "number") {
        console.error("Неверный индекс:", data);
        setSpinning(false);
        return;
      }

      const winIndex = data.index;

      const iterations = 8;
      const fullListWidth = items.length * (itemWidth + gap);

      const randomInCard = Math.floor(Math.random() * (itemWidth * 0.8));

      const finalOffset =
        iterations * fullListWidth +
        winIndex * (itemWidth + gap) -
        containerWidth / 2 +
        itemWidth / 2 +
        randomInCard;

      // 👉 СБРОС + ГАРАНТИРОВАННЫЙ СТАРТ АНИМАЦИИ
      setOffset(0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOffset(finalOffset);
        });
      });

      setTimeout(() => {
        setResult(data.win);
        setSpinning(false);
      }, 5000);
    } catch (e) {
      console.error("Ошибка спина:", e);
      setSpinning(false);
    }
  };

  const renderItems = Array(20).fill(items).flat();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center font-sans">
      <Navbar />

      <div className="z-10 flex flex-col items-center w-full max-w-5xl px-4">
        <h1 className="text-4xl font-bold mt-10 mb-6">Roulette</h1>

        <div className="relative">
          {/* указатель */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-yellow-400 z-50" />

          {/* окно */}
          <div
            className="overflow-hidden border border-white/10"
            style={{ width: containerWidth, height: 200 }}
          >
            <div
              className="flex items-center h-full transition-transform duration-[5000ms] ease-out"
              style={{
                transform: `translateX(-${offset}px)`,
                gap: `${gap}px`,
              }}
            >
              {renderItems.map((item, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 bg-neutral-800 rounded-lg flex flex-col items-center justify-center"
                  style={{ width: itemWidth, height: 160 }}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt=""
                      className="w-24 h-16 object-contain"
                    />
                  ) : (
                    <div className="w-24 h-16 bg-gray-600" />
                  )}

                  <p className="text-xs mt-2">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className="mt-10 px-10 py-3 bg-yellow-400 text-black font-bold rounded"
        >
          {spinning ? "Rolling..." : "SPIN"}
        </button>

        {/* результат */}
        {result && !spinning && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl mb-4">You won:</h2>
            <img
              src={result.image_url}
              className="w-40 mx-auto mb-4"
            />
            <p>{result.title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
