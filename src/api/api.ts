const API = "https://cpmmarker.onrender.com";

export const apiFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();

  if (data?.error === "No token") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return data;
};