const chispas = [
  { x: "42%", d: "0s" },
  { x: "48%", d: "0.8s" },
  { x: "53%", d: "1.6s" },
  { x: "58%", d: "0.4s" },
  { x: "46%", d: "2.2s" },
];

export default function Marco({ onVolver, children }) {
  return (
    <div className="invitacion">
      <div className="fogata" aria-hidden="true">
        <div className="brasas" />
        <div className="llama llama-1" />
        <div className="llama llama-2" />
        <div className="llama llama-3" />
        <div className="llama llama-4" />
        <div className="llama llama-5" />
        {chispas.map((c, i) => (
          <span key={i} className="chispa" style={{ "--x": c.x, "--d": c.d }} />
        ))}
      </div>

      <button className="volver" onClick={onVolver}>← Volver</button>

      <article className="tarjeta">
        <div className="contenido">
          <section className="info">
            <p className="celebramos">Celebramos</p>
            <h1 className="titulo">Noche<br />Blanca</h1>

            <div className="divisor"><span>◆</span></div>

            <div className="fecha">
              <span>Noviembre</span>
              <span className="numero">27</span>
              <span>6 p.m.</span>
            </div>

            <p className="mensaje">
              Bajo el resplandor de una noche vestida de blanco, queremos compartir un momento agradable y cómodo. Ven y acompáñanos.
            </p>
          </section>

          <section className="respuesta">{children}</section>
        </div>
      </article>
    </div>
  );
}