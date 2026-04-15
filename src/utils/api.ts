const API = "https://cpmmarker.onrender.com";

const safeFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  return res.json();
};

export default safeFetch;