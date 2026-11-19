import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Admin() {
  const [clave, setClave] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError("");
    const { data, error } = await supabase
      .from("confirmaciones")
      .select("*")
      .eq("asistira", true)
      .order("created_at");
    setCargando(false);
    if (error) return setError("No se pudieron cargar los datos: " + error.message);
    setDatos(data);
  }

  useEffect(() => {
    if (autorizado) cargar();
  }, [autorizado]);

  function entrar(e) {
    e.preventDefault();
    if (clave === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAutorizado(true);
    } else {
      setError("Contraseña incorrecta");
    }
  }

  if (!autorizado) {
    return (
      <div className="admin">
        <h2>Panel de administración</h2>
        <form onSubmit={entrar} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300 }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="admin">
      <h2>Confirmaciones Noche Blanca</h2>
      <p><strong>Total de personas: {datos.length}</strong></p>
      <button onClick={cargar} disabled={cargando}>
        {cargando ? "Cargando..." : "Actualizar"}
      </button>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Grupo</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((c, i) => (
            <tr key={c.id}>
              <td>{i + 1}</td>
              <td>{c.nombre}</td>
              <td>{c.tipo}</td>
              <td>{c.grupo ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {datos.length === 0 && !error && !cargando && <p>Todavía no hay confirmaciones.</p>}
    </div>
  );
}