import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  const load = async () => {
    const data = await apiFetch("/profile/me");
    setUser(data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}