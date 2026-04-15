import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

/* ================= GET TOKEN ================= */
const getToken = () => localStorage.getItem("token");

/* ================= SAFE FETCH ================= */
const safeFetch = async (url: string, options: any = {}) => {
  try {
    const token = getToken();

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const text = await res.text();

    if (!text || text.startsWith("<!DOCTYPE")) {
      console.log("❌ NOT JSON:", text);
      return null;
    }

    return JSON.parse(text);
  } catch (e) {
    console.log("FETCH ERROR:", e);
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

    if (data?.id) {
      setUser(data);
    }
  };

  /* ================= LOAD CARS ================= */
  const loadCars = async () => {
    const data = await safeFetch(`${API}/market/cars`);

    if (Array.isArray(data)) {
      setCars(data);
    } else {
      setCars([]);
    }
  };

  useEffect(() => {
    loadCars();
    loadUser();
  }, []);

  /* ================= PRICE LOGIC ================= */
  const getPrice = (car: any) => {
    const discount = user?.discount || 0;

    if (!discount) return car.price;

    return Math.floor(
      car.price - (car.price * discount) / 100
    );
  };

  /* ================= SAFE FILTER ================= */
  const filteredCars = (cars || [])
    .filter((car) => {
      const name = car?.name?.toLowerCase() || "";
      const brand = car?.brand?.toLowerCase() || "";
      const s = search.toLowerCase();

      return name.includes(s) || brand.includes(s);
    })
    .filter((car) => (onlyPremium ? car?.premium : true));

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050608] text-white">

      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">

          <div>
            <h1 className="text-5xl font-black">
              AUTO <span className="text-yellow-400">MARKET</span>
            </h1>
            <p className="text-white/40 text-sm">
              Choose your car
            </p>
          </div>

          <div className="flex gap-4">

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

          {filteredCars.map((car) => (
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
                {car?.brand} {car?.name}
              </h2>

              <div className="mt-2 text-green-400 font-bold text-lg">
                ${getPrice(car)}
              </div>

            </div>
          ))}

        </div>

        {/* EMPTY STATE */}
        {filteredCars.length === 0 && (
          <div className="text-center mt-20 text-white/30">
            Loading cars...
          </div>
        )}

      </div>
    </div>
  );
}