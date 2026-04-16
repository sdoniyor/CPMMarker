import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://cpmmarker.onrender.com";

/* ================= SAFE FETCH ================= */
const safeFetch = async (url: string, options: any = {}) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const text = await res.text();

    if (!text || text.startsWith("<!DOCTYPE")) return null;

    return JSON.parse(text);
  } catch {
    return null;
  }
};

export default function Market() {
  const [cars, setCars] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [onlyPremium, setOnlyPremium] = useState(false);

  const navigate = useNavigate();

  /* ================= LOAD USER ================= */
  const loadUser = async () => {
    const data = await safeFetch(`${API}/profile/me`);
    if (data?.id) setUser(data);
  };

  /* ================= LOAD CARS ================= */
  const loadCars = async () => {
    const data = await safeFetch(`${API}/market/cars`);
    if (Array.isArray(data)) setCars(data);
  };

  useEffect(() => {
    loadCars();
    loadUser();
  }, []);

  /* ================= CHECK PROMO ACCESS ================= */
    const hasPromoAccess = (car: any) => {
    if (!user?.promo_car_ids) return false;

    let ids: number[] = [];

    try {
      if (typeof user.promo_car_ids === "string") {
        ids = user.promo_car_ids.split(",").map(Number);
      } else if (Array.isArray(user.promo_car_ids)) {
        ids = user.promo_car_ids.map(Number);
      }
    } catch {
      return false;
    }

    return ids.includes(car.id);
  };
  /* ================= PRICE ================= */
const getPrice = (car: any) => {
  const base = Number(car.price) || 0;

  const discount = Number(user?.discount) || 0;

  if (!hasPromoAccess(car) || discount <= 0) {
    return { old: null, new: base };
  }

  const newPrice = Math.floor(base - (base * discount) / 100);

  return {
    old: base,
    new: newPrice,
  };
};

  /* ================= FILTER ================= */
  const filteredCars = (cars || [])
    .filter((car) => {
      const s = search.toLowerCase();
      return (
        car?.name?.toLowerCase().includes(s) ||
        car?.brand?.toLowerCase().includes(s)
      );
    })
    .filter((car) => (onlyPremium ? car?.premium : true));

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050608] text-white">

      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-5xl font-black">
              AUTO <span className="text-yellow-400">MARKET</span>
            </h1>
            <p className="text-white/40 text-sm">
              Choose your car
            </p>
          </div>

          <div className="flex gap-3">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl"
            />

            <button
              onClick={() => setOnlyPremium(!onlyPremium)}
              className={`px-4 py-2 rounded-xl ${
                onlyPremium
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10"
              }`}
            >
              👑 Premium
            </button>

          </div>
        </div>

        {/* CARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {filteredCars.map((car) => {
            const price = getPrice(car);

            return (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="bg-[#0c0c0c] p-4 rounded-2xl cursor-pointer border border-transparent hover:border-yellow-400 transition"
              >

                <img
                  src={car.image_url}
                  className="w-full h-40 object-contain"
                />

                <h2 className="text-xl font-bold mt-2">
                  {car.brand} {car.name}
                </h2>

                {/* PRICE */}
                <div className="mt-2 flex items-center gap-2">

                  {price.old && (
                    <span className="text-white/40 line-through">
                      ${price.old}
                    </span>
                  )}

                  <span className="text-green-400 font-bold text-lg">
                    ${price.new}
                  </span>

                </div>

                {/* BADGE */}
                {hasPromoAccess(car) && user?.discount > 0 && (
                  <div className="mt-2 text-xs text-yellow-400">
                    🔥 Promo active -{user.discount}%
                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* EMPTY */}
        {filteredCars.length === 0 && (
          <div className="text-center mt-20 text-white/30">
            No cars found
          </div>
        )}

      </div>
    </div>
  );
}