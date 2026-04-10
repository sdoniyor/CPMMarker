import { useEffect, useState } from "react";

export default function Garage() {
  const [cars, setCars] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`http://localhost:5000/garage/${user.id}`)
      .then(res => res.json())
      .then(data => setCars(data));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        🚗 YOUR GARAGE
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cars.map((car: any) => (
          <div
            key={car.id}
            className="bg-white/5 border border-white/10 p-4 rounded-xl"
          >
            <img
              src={car.image}
              className="w-full h-32 object-cover rounded-lg"
            />

            <h2 className="text-xl font-bold mt-2">
              {car.brand} {car.name}
            </h2>

            <p className="text-gray-400">{car.engine}</p>

            <div className="text-sm mt-2 space-y-1">
              <p>⚡ {car.speed} km/h</p>
              <p>🔥 {car.power} HP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}