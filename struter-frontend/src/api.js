// src/api.js

export const API_BASE = process.env.REACT_APP_API_BASE;

if (!API_BASE) {
  console.error("❌ REACT_APP_API_BASE tanımlı değil (.env kontrol et)");
}

export const apiFetch = async (path, options = {}) => {
  const url = `${API_BASE}${path}`;
  return fetch(url, options);
};
