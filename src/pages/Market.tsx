import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

export default function Market() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [cars, setCars] = useState<any[]>([]);

  const loadCars = async () => {
    try {
      const res = await fetch(`${API}/cars`);
      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.log("Error loading cars", err);
    }
  };

  const buyCar = async (carId: number) => {
    try {
      await fetch(`${API}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          carId,
        }),
      });

      loadCars();
    } catch (err) {
      console.log("Buy error", err);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050a10] to-black text-white">

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="p-6">

        <h1 className="text-3xl font-extrabold text-yellow-400 tracking-widest mb-6">
          CAR MARKET
        </h1>

        {/* CARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {cars.map((car: any) => (
            <div
              key={car.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10
              bg-white/5 hover:bg-white/10 transition shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >

              {/* IMAGE */}
              <div className="h-40 overflow-hidden">
                <img
                  src={car.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* INFO */}
              <div className="p-4">

                <h2 className="text-lg font-bold text-yellow-400">
                  {car.name}
                </h2>

                <p className="text-sm text-white/60">
                  {car.brand}
                </p>

                {/* STATS */}
                <div className="mt-2 text-xs text-white/70 space-y-1">
                  <p>⚡ Power: {car.power}</p>
                  <p>🏎 Speed: {car.speed}</p>
                  <p>🔧 Engine: {car.engine}</p>
                </div>

                {/* PRICE + BUY */}
                <div className="flex items-center justify-between mt-4">

                  <p className="text-yellow-400 font-bold text-lg">
                    ${car.price}
                  </p>

                  <button
                    onClick={() => buyCar(car.id)}
                    className="px-4 py-1 rounded-lg bg-yellow-500 text-black font-bold
                    hover:bg-yellow-400 transition"
                  >
                    BUY
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}