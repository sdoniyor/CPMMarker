import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Market from "./pages/Market";
import Profile from "./pages/Profile";
import Wheel from "./pages/Wheel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* старт — регистрация/логин */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Auth />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wheel" element={<Wheel />} />
        
        <div style={{ color: "white", fontSize: 30 }}>
          APP WORKS
        </div>
      </Routes>
    </BrowserRouter>
  );
}


