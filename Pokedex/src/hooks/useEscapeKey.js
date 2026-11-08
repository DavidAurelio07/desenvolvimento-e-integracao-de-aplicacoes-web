import { useEffect } from "react";

// Chama `onEscape` quando o usuário aperta Esc.
// O listener é removido na função de limpeza do efeito.
export default function useEscapeKey(onEscape) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onEscape();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEscape]);
}
