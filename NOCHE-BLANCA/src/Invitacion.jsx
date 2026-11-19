import { useState } from "react";
import Marco from "./Marco";

export default function Invitacion({ onVolver, onSi }) {
  const [respondioNo, setRespondioNo] = useState(false);

  return (
    <Marco onVolver={onVolver}>
      {!respondioNo ? (
        <>
          <p className="pregunta">¿Confirmas tu asistencia?</p>
          <div className="botones">
            <button onClick={onSi}>Sí, asistiré</button>
            <button className="contorno" onClick={() => setRespondioNo(true)}>No podré</button>
          </div>
        </>
      ) : (
        <>
          <p className="pregunta">Gracias por avisarnos.</p>
          <button type="button" className="enlace" onClick={() => setRespondioNo(false)}>
            Cambiar respuesta
          </button>
        </>
      )}
    </Marco>
  );
}