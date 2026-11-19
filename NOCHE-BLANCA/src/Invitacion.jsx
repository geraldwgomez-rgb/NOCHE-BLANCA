import { useState } from "react";
import { supabase } from "./supabaseClient";
import Marco from "./Marco";

const inicial = { nombre: "", tipo: "estudiante", grupo: "" };

export default function Invitacion({ onVolver }) {
  const [paso, setPaso] = useState("pregunta"); // pregunta | formulario | gracias | no
  const [form, setForm] = useState(inicial);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const esEstudiante = form.tipo === "estudiante";

  async function confirmar(e) {
    e.preventDefault();
    setError("");

    if (!form.nombre.trim()) return setError("Escribe tu nombre");
    if (esEstudiante && !form.grupo.trim()) return setError("Escribe tu grupo");

    setEnviando(true);
    const { error } = await supabase.from("confirmaciones").insert({
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      grupo: esEstudiante ? form.grupo.trim() : null,
      asistira: true,
    });
    setEnviando(false);

    if (error) return setError("No se pudo guardar. Intenta de nuevo.");
    setForm(inicial);
    setPaso("gracias");
  }

  return (
    <Marco onVolver={onVolver}>
      {paso === "pregunta" && (
        <>
          <p className="pregunta">¿Confirmas tu asistencia?</p>
          <div className="botones">
            <button onClick={() => setPaso("formulario")}>Sí, asistiré</button>
            <button className="contorno" onClick={() => setPaso("no")}>No podré</button>
          </div>
        </>
      )}

      {paso === "formulario" && (
        <form className="formulario" onSubmit={confirmar}>
          <p className="pregunta">Confirma tu asistencia</p>

          <input
            className="campo"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <div className="tipo">
            {["estudiante", "profesor"].map((t) => (
              <button
                type="button"
                key={t}
                className={form.tipo === t ? "opcion activa" : "opcion"}
                onClick={() => setForm({ ...form, tipo: t })}
              >
                {t === "estudiante" ? "Estudiante" : "Profesor"}
              </button>
            ))}
          </div>

          {esEstudiante && (
            <input
              className="campo"
              placeholder="Tu grupo"
              value={form.grupo}
              onChange={(e) => setForm({ ...form, grupo: e.target.value })}
            />
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={enviando}>
            {enviando ? "Guardando..." : "Confirmar asistencia"}
          </button>
          <button type="button" className="enlace" onClick={() => { setError(""); setPaso("pregunta"); }}>
            Cambiar respuesta
          </button>
        </form>
      )}

      {paso === "gracias" && (
        <>
          <p className="pregunta">¡Gracias! Tu asistencia quedó confirmada.</p>
          <p className="detalle">Te esperamos el 27 de noviembre a las 6 p.m.</p>
          <button type="button" className="enlace" onClick={() => setPaso("pregunta")}>
            Cambiar respuesta
          </button>
        </>
      )}

      {paso === "no" && (
        <>
          <p className="pregunta">Gracias por avisarnos.</p>
          <button type="button" className="enlace" onClick={() => setPaso("pregunta")}>
            Cambiar respuesta
          </button>
        </>
      )}
    </Marco>
  );
}