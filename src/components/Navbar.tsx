import { apiFetch } from "../api/api";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch("/profile/me");
      setUser(data);
    };

    load();
  }, []);

  return (
    <div>
      <span>{user?.name || "Guest"}</span>
    </div>
  );
}