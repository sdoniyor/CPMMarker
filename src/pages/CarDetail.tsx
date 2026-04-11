import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://cpmmarker.onrender.com";

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState<any>(null);

  // Состояния для конфигуратора (выбранные опции)
  const [selectedHp, setSelectedHp] = useState<string>("300hp");
  const [selectedTuning, setSelectedTuning] = useState<string>("Kolodka xrom");
  const [selectedDiska, setSelectedDiska] = useState<string>("Standart");

  const loadCar = async () => {
    const res = await fetch(`${API}/cars`);
    const data = await res.json();

    const found = data.find((c: any) => c.id == id);
    // Для примера добавим недостающие поля, если их нет в API
    if (found) {
        if (!found.fullSpecs) found.fullSpecs = {
            motor: found.engine || "4.4L Twin Turbo",
            power: "300hp",
            acceleration: "1.2s",
            maxSpeed: "440 kmh",
            design: "Venom vinil"
        };
        if (!found.priceInMingSom) found.priceInMingSom = 60000;
        if (!found.bottomTuning) found.bottomTuning = "Fara va Kolodka xrom qilingan";
        if (!found.sound) found.sound = "Popkorn vixlop";
        if (!found.rating) found.rating = "10/10";
    }
    setCar(found);
  };

  useEffect(() => {
    loadCar();
  }, []);

  if (!car) {
    return <div className="text-white p-10">Loading...</div>;
  }

  // Вспомогательные компоненты для характеристик и конфигуратора
  const SpecItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
    <div className="flex items-center gap-3 text-white/80 text-base">
      <span className="text-lg">{icon}</span>
      <span className="font-light">{label}</span>
      <span className="text-white font-medium ml-1">{value}</span>
    </div>
  );

  const ConfigOption = ({ label, options, selected, onSelect }: { label: string, options: string[], selected: string, onSelect: (opt: string) => void }) => (
    <div className="mb-4">
      <p className="text-xs text-white/60 mb-1.5">{label}</p>
      <div className="flex gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-3 py-1.5 border rounded-md text-sm transition-all duration-150 ${
              selected === opt
                ? 'bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'bg-zinc-800 border-zinc-700 text-white/70 hover:border-zinc-500'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">

      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/market")}
          className="mb-8 text-white hover:text-white/80 flex items-center gap-2 text-sm"
        >
          ← BACK TO MARKET
        </button>

        {/* MAIN TITLE & SUBTITLE */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white tracking-tight">
            {car.name}
          </h1>
          <p className="text-lg text-white/80 font-light mt-1 uppercase tracking-wider">
            {car.brand || car.brandAndModelSub || "M Power Edition"}
          </p>
        </div>

        {/* MAIN CONTAINER: CHARACTERISTICS + CAR + CONFIGURATOR */}
        <div className="grid grid-cols-[300px_1fr_300px] gap-8 items-start">

          {/* LEFT: CHARACTERISTICS */}
          <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
            <h2 className="text-white/50 text-sm mb-5 font-light">CHARACTERISTICS</h2>
            <SpecItem icon="🏁" label="Brend:" value={car.brand} />
            <SpecItem icon="⚙️" label="Dvigatel:" value={car.fullSpecs?.motor || car.engine} />
            <SpecItem icon="🔥" label="Ot kuchi (HP):" value={car.fullSpecs?.power || car.power} />
            <SpecItem icon="🚀" label="0-100 km/h:" value={car.fullSpecs?.acceleration || car.speed} />
            <SpecItem icon="🏎" label="Maksimal tezlik:" value={car.fullSpecs?.maxSpeed || "N/A"} />
            <SpecItem icon="🎨" label="Dizayn:" value={car.fullSpecs?.design || "Standard"} />
          </div>

          {/* CENTER: CAR IMAGE & SHADOW */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-[16/10] max-h-[500px] flex items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/5 shadow-2xl overflow-hidden mb-6">
                <img
                    src={car.image}
                    className="object-contain w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                    alt={car.name}
                />
            </div>
             {/* BOTTOM STRIP INFO */}
            <div className="w-full flex justify-center gap-10 text-white/70 text-sm mt-2 font-light border-t border-white/10 pt-4">
                <span>🔧 Tuning: {car.bottomTuning}</span>
                <span>🔊 Ovozi: {car.sound}</span>
                <span>⭐ Reyting: {car.rating}</span>
            </div>
          </div>

          {/* RIGHT: CONFIGURATOR & BUY BUTTON */}
          <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 shadow-xl">
            <h2 className="text-white/50 text-sm mb-5 font-light">TANLASH VA SOZLACH:</h2>

            <ConfigOption
                label=""
                options={["630HP", "300HP"]}
                selected={selectedHp}
                onSelect={setSelectedHp}
            />

            <ConfigOption
                label="Tuning: [Kolodka xrom qilingan] [Fara]"
                options={["Kolodka xrom", "Fara XROM"]}
                selected={selectedTuning}
                onSelect={setSelectedTuning}
            />

            <ConfigOption
                label="Diska:"
                options={["Standart", "Diska XROM"]}
                selected={selectedDiska}
                onSelect={setSelectedDiska}
            />

            {/* BUY BUTTON AND INFO */}
            <div className="mt-10 border border-white/5 bg-zinc-800 rounded-xl overflow-hidden p-3 shadow-inner">
                <button
                    className="w-full bg-[#1db954] text-white font-bold text-xl py-3 rounded-lg hover:bg-[#1ed760] transition-colors shadow-[0_4px_10px_rgba(29,185,84,0.3)] uppercase"
                >
                    SOTIB OLISH
                </button>
                <div className="mt-3 text-xs text-white/70 space-y-1.5 font-light">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-lime-900/30 text-lime-400 border border-lime-800 px-1.5 py-0.5 rounded-md font-mono">SOTIB OLISH</span>
                        💰 Narxi: {car.priceInMingSom?.toLocaleString()} ming som
                    </div>
                    <div>
                        🔒 Qanday ochiladi: Serverda tashlab beriladi
                    </div>
                </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
