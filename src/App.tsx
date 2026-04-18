import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";
import CarDetail from "./pages/CarDetail";

function Layout() {
  const location = useLocation();

  // navbar НЕ показываем только на auth
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className={!hideNavbar ? "pt-20" : ""}>
        <Routes>
          {/* AUTH */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} /> {/* FIX */}

          {/* MAIN */}
          <Route path="/market" element={<MarketPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/car/:id" element={<CarDetail />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}