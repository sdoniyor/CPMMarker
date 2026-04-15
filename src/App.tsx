import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";

/* Layout wrapper */
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH без navbar */}
        <Route path="/" element={<AuthPage />} />

        {/* MARKET с navbar */}
        <Route
          path="/market"
          element={
            <Layout>
              <MarketPage />
            </Layout>
          }
        />

        {/* PROFILE с navbar */}
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}