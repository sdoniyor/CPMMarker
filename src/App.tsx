import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";

export default function App() {
  return (
    <BrowserRouter>

      {/* Navbar только тут */}
      <Navbar />
      <div className="pt-[80px] min-h-screen bg-[#050608]">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
      

    </BrowserRouter>
  );
}