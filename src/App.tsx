import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";
import CarDetail from "./pages/CarDetail";

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({ children }: any) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

/* ================= LAYOUT ================= */
function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/auth" || location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className={!hideNavbar ? "pt-20" : ""}>
        <Routes>

          {/* ================= ROOT ================= */}
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* ================= AUTH ================= */}
          <Route path="/auth" element={<AuthPage />} />

          {/* ================= PROTECTED ================= */}
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <MarketPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/car/:id"
            element={
              <ProtectedRoute>
                <CarDetail />
              </ProtectedRoute>
            }
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