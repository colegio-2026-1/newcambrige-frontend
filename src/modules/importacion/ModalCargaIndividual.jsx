import React, { useState, useEffect } from "react";
import Alert from "../../components/shared/Alert";
import styles from "./ImportacionIndividualPage.module.css";

export default function ModalCargaIndividual({ tipo, modo, datosIniciales, salones, salonMap, onGuardar, onCancelar }) {
  const isEstudiante = tipo === "estudiante";
  const esCrear      = modo === "crear";

  // Grado/Grupo visible:
  // - Estudiante: siempre (crear y editar)
  // - Docente: solo al crear
  const mostrarGradoGrupo = isEstudiante || esCrear;

  const gradosUnicos = [...new Set(salones.map(s => s.grado))].sort();

  const vacioInicial = { codigo: "", nombre: "", apellido: "", grado: "", grupo: "", contacto: "", activo: true };

  const [form, setForm]           = useState(vacioInicial);
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, type: "", message: "" });

  const showAlert  = (type, message) => setAlertInfo({ isOpen: true, type, message });
  const closeAlert = () => setAlertInfo(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    if (datosIniciales) {
      const salon = salonMap?.[datosIniciales.id_salon] || {};
      setForm({
        codigo:   datosIniciales.documento              || "",
        nombre:   datosIniciales.nombre?.split(" ")[0]  || "",
        apellido: datosIniciales.nombre?.split(" ").slice(1).join(" ") || "",
        grado:    salon.grado || "",
        grupo:    salon.grupo || "",
        contacto: datosIniciales.telefono_acudiente || "",
        activo:   datosIniciales.estado ?? true,
      });
    } else {
      setForm(vacioInicial);
    }
  }, [datosIniciales, salonMap]);

  const gruposDelGrado = salones
    .filter(s => s.grado === form.grado)
    .map(s => s.grupo)
    .sort();

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    if (name === "grado") {
      setForm(prev => ({ ...prev, grado: value, grupo: "" }));
      return;
    }

    if (name === "grupo" && value === "__AGREGAR__") {
      if (!form.grado) return;
      let next = "A";
      if (gruposDelGrado.length > 0) {
        const last = gruposDelGrado[gruposDelGrado.length - 1];
        if (/^[a-zA-Z]+$/.test(last)) next = String.fromCharCode(last.charCodeAt(0) + 1);
        else if (!isNaN(last))        next = String(parseInt(last) + 1);
      }
      setForm(prev => ({ ...prev, grupo: next }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: inputType === "checkbox" ? checked : value }));
  };

  const validar = () => {
    if (!form.codigo.trim())   return "El código es obligatorio.";
    if (form.codigo.trim().length > 10) return "El código no puede superar 10 caracteres.";
    if (!form.nombre.trim())   return "El nombre es obligatorio.";
    if (!form.apellido.trim()) return "El apellido es obligatorio.";

    if (mostrarGradoGrupo) {
      if (isEstudiante) {
        if (!form.grado) return "El grado es obligatorio para estudiantes.";
        if (!form.grupo) return "El grupo es obligatorio para estudiantes.";
      } else {
        const tieneGrado = !!form.grado;
        const tieneGrupo = !!form.grupo;
        if (tieneGrado && !tieneGrupo) return "Si ingresa un grado, el grupo también es obligatorio.";
        if (tieneGrupo && !tieneGrado) return "Si ingresa un grupo, el grado también es obligatorio.";
      }
    }

    return null;
  };

  const handleSubmit = () => {
    const error = validar();
    if (error) {
      showAlert("warning", error);
      return;
    }

    const nombreCompleto = `${form.nombre.trim()} ${form.apellido.trim()}`.trim();

    let payload = {};

    if (isEstudiante) {
      // Resolver id_salon a partir de grado + grupo seleccionados
      const salonEncontrado = salones.find(s => s.grado === form.grado && s.grupo === form.grupo);
      payload = {
        documento:          esCrear ? form.codigo.trim() : undefined,
        nombre:             nombreCompleto,
        id_salon:           salonEncontrado?.id_salon ?? null,
        telefono_acudiente: form.contacto.trim() || null,
      };
      if (!esCrear) {
        payload.estado = form.activo;
        delete payload.documento;
      } else {
        // Para crear usamos carga-individual (staging), mandamos grado/curso como strings
        payload = {
          documento:     form.codigo.trim(),
          nombre:        nombreCompleto,
          grado:         form.grado,
          curso:         form.grupo,
          observaciones: form.contacto.trim() || null,
        };
      }
    } else {
      // Docente
      if (esCrear) {
        payload = {
          documento:     form.codigo.trim(),
          nombre:        nombreCompleto,
          grado_titular: form.grado || null,
          curso_titular: form.grupo || null,
        };
      } else {
        // Editar docente: solo nombre, estado (sin grado/grupo)
        payload = {
          nombre: nombreCompleto,
          estado: form.activo,
        };
      }
    }

    onGuardar(payload);
  };

  const titulo = `${esCrear ? "AGREGAR" : "EDITAR"} ${isEstudiante ? "ESTUDIANTE" : "DOCENTE"}`;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onCancelar}>
        <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
          <h3 className={styles.modalTitle}>{titulo}</h3>

          {/* Fila 1: Código, Nombre, Apellido */}
          <div className={styles.modalFila}>
            <div className={styles.modalGrupo}>
              <label>Código</label>
              <input name="codigo" value={form.codigo} onChange={handleChange} maxLength={10} />
            </div>
            <div className={styles.modalGrupo}>
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} />
            </div>
            <div className={styles.modalGrupo}>
              <label>Apellido</label>
              <input name="apellido" value={form.apellido} onChange={handleChange} />
            </div>
          </div>

          {/* Fila 2: Grado, Grupo (si aplica) + Contacto padre (solo estudiante) */}
          <div className={styles.modalFila}>
            {mostrarGradoGrupo && (
              <>
                <div className={styles.modalGrupo}>
                  <label>Grado</label>
                  <select name="grado" value={form.grado} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {gradosUnicos.map((g, i) => <option key={i} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className={styles.modalGrupo}>
                  <label>Grupo</label>
                  <select name="grupo" value={form.grupo} onChange={handleChange} disabled={!form.grado}>
                    <option value="">Seleccione...</option>
                    {form.grupo && !gruposDelGrado.includes(form.grupo) && (
                      <option value={form.grupo}>{form.grupo}</option>
                    )}
                    {gruposDelGrado.map((g, i) => <option key={i} value={g}>{g}</option>)}
                    <option value="__AGREGAR__" className={styles.optionAgregar}>+ Agregar Grupo</option>
                  </select>
                </div>
              </>
            )}
            {isEstudiante && (
              <div className={styles.modalGrupo}>
                <label>Contacto del padre</label>
                <input name="contacto" value={form.contacto} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* Fila 3: Toggle Activo */}
          <div className={styles.modalFila}>
            <div className={styles.modalGrupoToggle}>
              <label>Activo</label>
              <label className={styles.toggle}>
                <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
                <span className={styles.toggleSlider} />
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className={styles.modalAcciones}>
            <button className={styles.btnAceptar}  onClick={handleSubmit}>Aceptar</button>
            <button className={styles.btnCancelar} onClick={onCancelar}>Cancelar</button>
          </div>
        </div>
      </div>
      <Alert {...alertInfo} onClose={closeAlert} />
    </>
  );
}
