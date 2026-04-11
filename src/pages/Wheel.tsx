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
    const res = await fetch(`${API}/wheel`);
    const data = await res.json();
    setItems(data || []);
  };

  const spin = async () => {
    if (spinning || items.length === 0) return;

    if (!user?.id) {
      alert("Ты не залогинен");
      return;
    }

    setSpinning(true);
    setResult(null);

    const res = await fetch(`${API}/wheel/spin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await res.json();

    console.log("SPIN:", data);

    if (!data.success || typeof data.index !== "number") {
      console.error("INDEX ERROR", data);
      setSpinning(false);
      return;
    }

    const winIndex = data.index;

    const iterations = 8;
    const fullWidth = items.length * (itemWidth + gap);

    const randomOffset = Math.floor(Math.random() * (itemWidth * 0.8));

    const finalOffset =
      iterations * fullWidth +
      winIndex * (itemWidth + gap) -
      containerWidth / 2 +
      itemWidth / 2 +
      randomOffset;

    // 💥 фикс анимации
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
  };

  const renderItems = Array(20).fill(items).flat();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <Navbar />

      <h1 className="text-4xl mt-10 mb-6">Roulette</h1>

      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-yellow-400 z-50" />

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
                <img
                  src={item.image_url}
                  className="w-24 h-16 object-contain"
                />
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

      {result && !spinning && (
        <div className="mt-6 text-center">
          <h2>You won:</h2>
          <img src={result.image_url} className="w-40 mx-auto" />
          <p>{result.title}</p>
        </div>
      )}
    </div>
  );
}
