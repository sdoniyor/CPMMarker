import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState<any>(null);

  const loadCar = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();

    const found = data.find((c: any) => c.id == id);
    setCar(found);
  };

  useEffect(() => {
    loadCar();
  }, []);

  if (!car) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/market")}
          className="mb-4 text-yellow-400"
        >
          ← BACK
        </button>

        {/* CARD */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">

          <img
            src={car.image}
            className="w-full h-[300px] object-cover"
          />

          <div className="p-6">

            <h1 className="text-3xl font-bold text-yellow-400">
              {car.name}
            </h1>

            <p className="text-white/60 mb-4">{car.brand}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
              <p>⚡ Power: {car.power}</p>
              <p>🏎 Speed: {car.speed}</p>
              <p>🔧 Engine: {car.engine}</p>
              <p className="text-yellow-400 font-bold">
                💰 ${car.price}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
