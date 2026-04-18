import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";
import CarDetail from "./pages/CarDetail";

import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* 🔥 DEFAULT */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* ================= AUTH ================= */}
        <Route path="/auth" element={<AuthPage />} />

        {/* ================= PROTECTED ================= */}
        <Route
          path="/market"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <MarketPage />
              </>
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <ProfilePage />
              </>
            </RequireAuth>
          }
        />

        <Route
          path="/car/:id"
          element={
            <RequireAuth>
              <>
                <Navbar />
                <CarDetail />
              </>
            </RequireAuth>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}