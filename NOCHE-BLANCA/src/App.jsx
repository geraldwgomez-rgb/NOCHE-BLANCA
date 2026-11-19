import { useEffect, useState } from "react";
import Invitacion from "./Invitacion";
import Confirmacion from "./Confirmacion";
import Admin from "./Admin";
import "./App.css";

// Rosa dibujada con SVG. La clase define la esquina donde va.
function Rosa({ className }) {
  return (
    <svg className={`rosa ${className}`} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M60 88 C40 96 22 92 12 80 C30 74 46 78 60 88Z" fill="#2f5a2a" />
      <path d="M60 88 C80 96 98 92 108 80 C90 74 74 78 60 88Z" fill="#3c6b34" />
      <path d="M60 92 C52 108 44 112 34 112 C40 102 48 96 60 92Z" fill="#2a4f25" />
      <path d="M60 14 C86 14 102 36 100 60 C98 84 80 98 60 98 C40 98 22 84 20 60 C18 36 34 14 60 14Z" fill="#6e0c1c" />
      <path d="M60 24 C78 24 90 40 88 58 C86 76 74 88 60 88 C46 88 34 76 32 58 C30 40 42 24 60 24Z" fill="#9a1a2c" />
      <path d="M44 40 C56 32 72 36 74 50 C76 64 66 74 54 72 C42 70 36 56 44 40Z" fill="#c02e42" />
      <path d="M60 46 C68 46 72 52 70 58 C68 64 62 66 58 64 C52 62 50 52 60 46Z" fill="#e0606e" />
      <circle cx="60" cy="56" r="4" fill="#ffd0c0" opacity="0.5" />
    </svg>
  );
}

export default function App() {
  // Pantallas: "sobre" | "invitacion" | "confirmacion"
  const [pantalla, setPantalla] = useState("sobre");
  const [ruta, setRuta] = useState(window.location.hash);

  useEffect(() => {
    const cambiarRuta = () => setRuta(window.location.hash);
    window.addEventListener("hashchange", cambiarRuta);
    return () => window.removeEventListener("hashchange", cambiarRuta);
  }, []);

  // Panel de administración: tu-sitio.vercel.app/#admin
  if (ruta === "#admin") return <Admin />;

  if (pantalla === "invitacion") {
    return (
      <Invitacion
        onVolver={() => setPantalla("sobre")}
        onSi={() => setPantalla("confirmacion")}
      />
    );
  }

  if (pantalla === "confirmacion") {
    return <Confirmacion onVolver={() => setPantalla("invitacion")} />;
  }

  return (
    <button className="sobre" onClick={() => setPantalla("invitacion")} aria-label="Abrir invitación">
      <div className="sobre-cuerpo">
        <div className="solapa solapa-superior" />
        <div className="solapa solapa-izquierda" />
        <div className="solapa solapa-derecha" />
        <div className="solapa solapa-inferior" />

        <Rosa className="rosa-tl" />
        <Rosa className="rosa-tr" />
        <Rosa className="rosa-bl" />
        <Rosa className="rosa-br" />

        <span className="titulo-sobre">Invitación</span>
        <div className="sello"><span>NB</span></div>
        <span className="pista">Toca para abrir</span>
      </div>
    </button>
  );
}