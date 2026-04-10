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
