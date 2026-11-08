import { useEffect, useState } from "react";

// Igual ao useState, mas guarda o valor no localStorage.
// try/catch: o localStorage pode estar bloqueado (aba anônima, por exemplo).
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // sem persistência, mas o app continua funcionando
    }
  }, [key, value]);

  return [value, setValue];
}
