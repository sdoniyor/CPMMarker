import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AuthPage />} />

        <Route path="/market" element={<MarketPage />} />

        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </BrowserRouter>
  );
}