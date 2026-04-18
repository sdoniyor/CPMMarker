import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";
import CarDetail from "./pages/CarDetail";

/* ================= LAYOUT ================= */
function Layout() {
  const location = useLocation();

  const token = localStorage.getItem("token");

  // скрываем navbar только на auth
  const hideNavbar =
    location.pathname === "/auth" || location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className={!hideNavbar ? "pt-20" : ""}>
        <Routes>

          {/* ================= AUTH ================= */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* ================= PROTECTED ================= */}
          <Route
            path="/market"
            element={token ? <MarketPage /> : <Navigate to="/auth" replace />}
          />

          <Route
            path="/profile"
            element={token ? <ProfilePage /> : <Navigate to="/auth" replace />}
          />

          <Route
            path="/car/:id"
            element={token ? <CarDetail /> : <Navigate to="/auth" replace />}
          />

        </Routes>
      </div>
    </>
  );
}

/* ================= APP ================= */
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}