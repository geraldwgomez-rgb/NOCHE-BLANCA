import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

const GRUPOS = ["11-1", "11-2", "11-3"];

export default function Admin() {
  const [clave, setClave] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState(""); // "" = todos

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

  async function eliminar(id, nombre) {
    if (!window.confirm(`¿Eliminar la confirmación de ${nombre}?`)) return;
    const { error } = await supabase.from("confirmaciones").delete().eq("id", id);
    if (error) return setError("No se pudo eliminar: " + error.message);
    setDatos((prev) => prev.filter((c) => c.id !== id));
  }

  useEffect(() => {
    if (autorizado) cargar();
  }, [autorizado]);

  const visibles = useMemo(() => {
    const n = filtroNombre.trim().toLowerCase();
    return datos.filter(
      (c) =>
        (c.nombre || "").toLowerCase().includes(n) &&
        (filtroGrupo === "" || c.grupo === filtroGrupo)
    );
  }, [datos, filtroNombre, filtroGrupo]);

  const conteo = (g) => datos.filter((c) => c.grupo === g).length;

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
      <p>
        <strong>Total de personas: {datos.length}</strong> · Mostrando: {visibles.length}
      </p>

      <div className="filtros">
        <input
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <button
          type="button"
          onClick={() => { setFiltroNombre(""); setFiltroGrupo(""); }}
        >
          Limpiar
        </button>
      </div>

      <div className="chips">
        {["", ...GRUPOS].map((g) => (
          <button
            key={g || "todos"}
            type="button"
            className={filtroGrupo === g ? "chip activo" : "chip"}
            onClick={() => setFiltroGrupo(g)}
          >
            {g === "" ? `Todos (${datos.length})` : `${g} (${conteo(g)})`}
          </button>
        ))}
      </div>

      <div className="acciones">
        <button onClick={cargar} disabled={cargando}>
          {cargando ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Grupo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visibles.map((c, i) => (
            <tr key={c.id}>
              <td>{i + 1}</td>
              <td>{c.nombre}</td>
              <td>{c.tipo}</td>
              <td>{c.grupo ?? "—"}</td>
              <td>
                <button className="eliminar" onClick={() => eliminar(c.id, c.nombre)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {visibles.length === 0 && !error && !cargando && (
        <p>No hay confirmaciones que coincidan con el filtro.</p>
      )}
    </div>
  );
}