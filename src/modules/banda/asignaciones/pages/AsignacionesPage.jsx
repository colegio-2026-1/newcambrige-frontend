import { useState, useEffect } from "react";
import { bandaService } from "../../../../api/bandaService";

// ─── Estilos base ────────────────────────────────────────────────────────────

const btn = (bg, disabled = false) => ({
  padding: "6px 16px",
  backgroundColor: disabled ? "#ccc" : bg,
  color: "#fff",
  border: "none",
  borderRadius: "20px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "bold",
  fontSize: "12px",
  opacity: disabled ? 0.6 : 1,
  whiteSpace: "nowrap",
});

const inputStyle = (hasError = false) => ({
  padding: "6px 10px",
  border: `1px solid ${hasError ? "#DC2626" : "#ccc"}`,
  borderRadius: "4px",
  fontSize: "13px",
  width: "100%",
  boxSizing: "border-box",
});

const readonlyInput = {
  padding: "6px 10px",
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  fontSize: "13px",
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "#f5f5f5",
  color: "#666",
};

const errorMsg = { color: "#DC2626", fontSize: "11px", marginTop: "3px" };

const modalOverlay = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
};

const modalBox = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "32px",
  width: "560px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
  position: "relative",
  maxHeight: "90vh",
  overflowY: "auto",
};

// ─── Badges de estado ────────────────────────────────────────────────────────

const ESTADO_BADGE = {
  "Activo":           { bg: "#DCFCE7", color: "#15803D" },
  "Inactivo":         { bg: "#F3F4F6", color: "#6B7280" },
  "En mantenimiento": { bg: "#FEF9C3", color: "#CA8A04" },
};

const EstadoBadge = ({ estado }) => {
  const s = ESTADO_BADGE[estado] ?? { bg: "#F3F4F6", color: "#6B7280" };
  return (
    <span style={{
      padding: "3px 10px", borderRadius: "12px", fontSize: "11px",
      fontWeight: "600", backgroundColor: s.bg, color: s.color,
      whiteSpace: "nowrap",
    }}>
      {estado ?? "—"}
    </span>
  );
};

// ─── Constantes ───────────────────────────────────────────────────────────────

const ESTADOS_INSTRUMENTO = ["Activo", "Inactivo", "En mantenimiento"];
const POR_PAGINA = 10;

const FORM_VACIO = {
  codigo: "",
  nombre: "",
  id_categoria: "",
  cantidad_total: "",
  id_ubicacion: "",
  estado: "Activo",
};

const ERRORES_VACIO = {
  codigo: "",
  nombre: "",
  id_categoria: "",
  cantidad_total: "",
};

// ─── Componente principal ─────────────────────────────────────────────────────

const InventarioPage = () => {
  const [instrumentos, setInstrumentos]     = useState([]);
  const [categorias, setCategorias]         = useState([]);
  const [ubicaciones, setUbicaciones]       = useState([]);
  const [loading, setLoading]               = useState(true);

  // Filtros de búsqueda
  const [filtroCodigo, setFiltroCodigo]     = useState("");
  const [filtroNombre, setFiltroNombre]     = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  // Paginación
  const [pagina, setPagina]                 = useState(1);

  // Modales
  const [modalAgregar, setModalAgregar]       = useState(false);
  const [modalEditar, setModalEditar]         = useState(false);
  const [modalEliminar, setModalEliminar]     = useState(false);
  const [modalErrorEliminar, setModalErrorEliminar] = useState(false);
  const [modalAdvertencia, setModalAdvertencia]     = useState(false);

  // Instrumento seleccionado para editar/eliminar
  const [seleccionado, setSeleccionado]     = useState(null);

  // Formulario y errores
  const [form, setForm]     = useState(FORM_VACIO);
  const [errores, setErrores] = useState(ERRORES_VACIO);

  // Toast
  const [toast, setToast]   = useState(null);

  // ── Carga de datos ──────────────────────────────────────────────────────────
  const cargarDatos = async () => {
    try {
      const [instRes, catRes, ubiRes] = await Promise.all([
        bandaService.getInstrumentos(),
        bandaService.getCategorias(),
        bandaService.getUbicaciones(),
      ]);
      setInstrumentos(instRes.data);
      setCategorias(catRes.data);
      setUbicaciones(ubiRes.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // ── Toast ───────────────────────────────────────────────────────────────────
  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(null), 3500);
  };

  // ── Validación del formulario ───────────────────────────────────────────────
  const validarForm = (esEdicion = false) => {
    const nuevoErrores = { ...ERRORES_VACIO };
    let valido = true;

    if (!esEdicion && !form.codigo.trim()) {
      nuevoErrores.codigo = "El código del instrumento es obligatorio.";
      valido = false;
    } else if (!esEdicion && !/^\d{1,6}$/.test(form.codigo.trim())) {
      nuevoErrores.codigo = "El código debe ser un número entero de 1 a 6 dígitos.";
      valido = false;
    } else if (!esEdicion) {
      const existe = instrumentos.some(i => String(i.codigo) === form.codigo.trim());
      if (existe) {
        nuevoErrores.codigo = "El código del instrumento ya se encuentra registrado.";
        valido = false;
      }
    }

    if (!form.nombre.trim()) {
      nuevoErrores.nombre = "El nombre del instrumento es obligatorio.";
      valido = false;
    } else if (form.nombre.trim().length < 3 || form.nombre.trim().length > 100) {
      nuevoErrores.nombre = "El nombre debe tener entre 3 y 100 caracteres.";
      valido = false;
    } else {
      const idActual = esEdicion ? seleccionado?.id_instrumento : null;
      const duplicado = instrumentos.some(
        i => i.nombre.toLowerCase() === form.nombre.trim().toLowerCase()
             && i.id_instrumento !== idActual
      );
      if (duplicado) {
        nuevoErrores.nombre = "Ya existe un instrumento con este nombre.";
        valido = false;
      }
    }

    if (!form.id_categoria) {
      nuevoErrores.id_categoria = "Debe seleccionar un tipo de instrumento.";
      valido = false;
    }

    if (!form.cantidad_total || isNaN(form.cantidad_total) || parseInt(form.cantidad_total) < 1) {
      nuevoErrores.cantidad_total = "La cantidad total debe ser un número entero mayor a 0.";
      valido = false;
    }

    setErrores(nuevoErrores);
    return valido;
  };

  // ── Acciones CRUD ───────────────────────────────────────────────────────────
  const handleAgregar = async () => {
    if (!validarForm(false)) return;
    try {
      await bandaService.crearInstrumento({
        codigo:        form.codigo.trim(),
        nombre:        form.nombre.trim(),
        id_categoria:  parseInt(form.id_categoria),
        cantidad_total: parseInt(form.cantidad_total),
        id_ubicacion:  form.id_ubicacion ? parseInt(form.id_ubicacion) : null,
        estado:        form.estado,
      });
      setModalAgregar(false);
      setForm(FORM_VACIO);
      setErrores(ERRORES_VACIO);
      setPagina(1);
      cargarDatos();
      mostrarToast("Los cambios han sido guardados correctamente.");
    } catch (err) {
      console.error("Error creando instrumento:", err);
    }
  };

  const handleEditar = async () => {
    if (!validarForm(true)) return;

    // Advertencia si tiene asignaciones activas y se cambia a Inactivo/En mantenimiento
    const estadoAnterior = seleccionado?.estado;
    const tieneAsignaciones = (seleccionado?.asignados ?? 0) > 0;
    const cambiaANoDisponible = ["Inactivo", "En mantenimiento"].includes(form.estado);
    if (tieneAsignaciones && cambiaANoDisponible && estadoAnterior === "Activo") {
      setModalAdvertencia(true);
      return;
    }

    await ejecutarEdicion();
  };

  const ejecutarEdicion = async () => {
    try {
      await bandaService.editarInstrumento(seleccionado.id_instrumento, {
        nombre:        form.nombre.trim(),
        id_categoria:  parseInt(form.id_categoria),
        cantidad_total: parseInt(form.cantidad_total),
        id_ubicacion:  form.id_ubicacion ? parseInt(form.id_ubicacion) : null,
        estado:        form.estado,
      });
      setModalEditar(false);
      setModalAdvertencia(false);
      setErrores(ERRORES_VACIO);
      cargarDatos();
      mostrarToast("Los cambios han sido guardados correctamente.");
    } catch (err) {
      console.error("Error editando instrumento:", err);
    }
  };

  const handleEliminar = async () => {
    try {
      await bandaService.eliminarInstrumento(seleccionado.id_instrumento);
      setModalEliminar(false);
      cargarDatos();
      mostrarToast("Instrumento eliminado correctamente.");
    } catch (err) {
      if (err.response?.status === 400) {
        setModalEliminar(false);
        setModalErrorEliminar(true);
      }
    }
  };

  // ── Abrir modales ───────────────────────────────────────────────────────────
  const abrirAgregar = () => {
    setForm(FORM_VACIO);
    setErrores(ERRORES_VACIO);
    setModalAgregar(true);
  };

  const abrirEditar = (inst) => {
    setSeleccionado(inst);
    setForm({
      codigo:        inst.codigo ?? "",
      nombre:        inst.nombre ?? "",
      id_categoria:  inst.id_categoria ?? "",
      cantidad_total: inst.cantidad_total ?? inst.total ?? "",
      id_ubicacion:  inst.id_ubicacion ?? "",
      estado:        inst.estado ?? "Activo",
    });
    setErrores(ERRORES_VACIO);
    setModalEditar(true);
  };

  const abrirEliminar = (inst) => {
    setSeleccionado(inst);
    setModalEliminar(true);
  };

  // ── Filtrado y paginación ───────────────────────────────────────────────────
  const filtrados = instrumentos.filter(i => {
    const matchCodigo    = !filtroCodigo    || String(i.codigo ?? "").includes(filtroCodigo);
    const matchNombre    = !filtroNombre    || i.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const matchCategoria = !filtroCategoria || String(i.id_categoria) === filtroCategoria;
    return matchCodigo && matchNombre && matchCategoria;
  });

  const totalPaginas  = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual  = Math.min(pagina, totalPaginas);
  const paginados     = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const handleBuscar = () => setPagina(1);
  const handleLimpiar = () => {
    setFiltroCodigo(""); setFiltroNombre(""); setFiltroCategoria(""); setPagina(1);
  };

  // ── Campo compartido Agregar / Editar ──────────────────────────────────────
  const CamposForm = ({ esEdicion }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

      {/* Código — solo lectura en edición */}
      <div>
        <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>
          Código del instrumento <span style={{ color: "#DC2626" }}>*</span>
        </label>
        {esEdicion ? (
          <input style={readonlyInput} value={form.codigo} readOnly />
        ) : (
          <>
            <input
              style={inputStyle(!!errores.codigo)}
              value={form.codigo}
              placeholder="Ej: 1, 42, 100"
              onChange={e => setForm({ ...form, codigo: e.target.value.replace(/\D/g, "").slice(0, 6) })}
            />
            {errores.codigo && <p style={errorMsg}>{errores.codigo}</p>}
          </>
        )}
      </div>

      {/* Nombre */}
      <div>
        <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>
          Nombre del instrumento <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <input
          style={inputStyle(!!errores.nombre)}
          value={form.nombre}
          placeholder="Ej: Trompeta, Clarinete"
          onChange={e => setForm({ ...form, nombre: e.target.value })}
        />
        {errores.nombre && <p style={errorMsg}>{errores.nombre}</p>}
      </div>

      {/* Categoría */}
      <div>
        <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>
          Tipo / Categoría <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <select
          style={inputStyle(!!errores.id_categoria)}
          value={form.id_categoria}
          onChange={e => setForm({ ...form, id_categoria: e.target.value })}
        >
          <option value="">Seleccionar...</option>
          {categorias.map(c => (
            <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
          ))}
        </select>
        {errores.id_categoria && <p style={errorMsg}>{errores.id_categoria}</p>}
      </div>

      {/* Cantidad total */}
      <div>
        <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>
          Cantidad total <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <input
          type="number"
          min="1"
          style={inputStyle(!!errores.cantidad_total)}
          value={form.cantidad_total}
          placeholder="Ej: 5"
          onChange={e => setForm({ ...form, cantidad_total: e.target.value })}
        />
        {errores.cantidad_total && <p style={errorMsg}>{errores.cantidad_total}</p>}
      </div>

      {/* Ubicación */}
      <div>
        <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>
          Ubicación
        </label>
        <select
          style={inputStyle()}
          value={form.id_ubicacion}
          onChange={e => setForm({ ...form, id_ubicacion: e.target.value })}
        >
          <option value="">Seleccionar...</option>
          {ubicaciones.map(u => (
            <option key={u.id_ubicacion} value={u.id_ubicacion}>{u.nombre}</option>
          ))}
        </select>
      </div>

      {/* Estado */}
      <div>
        <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "4px" }}>
          Estado <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <select
          style={inputStyle()}
          value={form.estado}
          onChange={e => setForm({ ...form, estado: e.target.value })}
        >
          {ESTADOS_INSTRUMENTO.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) return <p style={{ padding: "20px" }}>Cargando inventario...</p>;

  return (
    <div style={{ position: "relative" }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: "80px", right: "24px", zIndex: 2000,
          backgroundColor: "#166534", color: "#fff",
          padding: "12px 20px", borderRadius: "8px", fontSize: "13px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "8px",
        }}>
          ✓ {toast}
        </div>
      )}

      {/* ── Buscador ── */}
      <div style={{
        display: "flex", gap: "10px", marginBottom: "16px",
        alignItems: "flex-end", flexWrap: "wrap",
        backgroundColor: "#F9F9F9", padding: "14px 16px",
        borderRadius: "8px", border: "1px solid #e5e7eb",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", color: "#555", fontWeight: "600" }}>Nombre</label>
          <input
            style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", width: "180px" }}
            placeholder="Nombre del instrumento"
            value={filtroNombre}
            onChange={e => setFiltroNombre(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleBuscar()}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", color: "#555", fontWeight: "600" }}>Categoría</label>
          <select
            style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", width: "160px" }}
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <button style={btn("#8E2A25")} onClick={handleBuscar}>Buscar</button>
        {(filtroNombre || filtroCategoria || filtroCodigo) && (
          <button
            style={{ ...btn("#6B7280"), marginLeft: "4px" }}
            onClick={handleLimpiar}
          >
            Limpiar filtros
          </button>
        )}

        {/* Botón Agregar — esquina derecha de la barra */}
        <button
          style={{ ...btn("#8E2A25"), marginLeft: "auto" }}
          onClick={abrirAgregar}
        >
          + Agregar instrumento
        </button>
      </div>

      {/* ── Contador ── */}
      <p style={{ fontSize: "13px", color: "#555", marginBottom: "8px" }}>
        <strong>{filtrados.length}</strong> instrumento{filtrados.length !== 1 ? "s" : ""}
      </p>

      {/* ── Tabla ── */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ backgroundColor: "#8E2A25", color: "#fff" }}>
            {["CÓDIGO","NOMBRE","TIPO / CATEGORÍA","TOTAL","DISPONIBLE","ASIGNADOS","ESTADO","ACCIONES"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: "600", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginados.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ padding: "24px", textAlign: "center", color: "#999" }}>
                No se encontraron instrumentos con el criterio de búsqueda ingresado.
              </td>
            </tr>
          ) : (
            paginados.map((inst, idx) => {
              const disponible = inst.disponible ?? inst.cantidad_disponible ?? 0;
              const total      = inst.total ?? inst.cantidad_total ?? 0;
              const asignados  = inst.asignados ?? (total - disponible) ?? 0;

              return (
                <tr
                  key={inst.id_instrumento}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#F9FAFB",
                    borderBottom: "1px solid #F0F0F0",
                  }}
                >
                  <td style={{ padding: "10px 12px" }}>{inst.codigo ?? inst.id_instrumento}</td>
                  <td style={{ padding: "10px 12px", fontWeight: "500" }}>{inst.nombre}</td>
                  <td style={{ padding: "10px 12px" }}>{inst.categoria_nombre ?? "—"}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>{total}</td>

                  {/* Disponible: verde si > 0, rojo si = 0 */}
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <span style={{
                      fontWeight: "700",
                      color: disponible > 0 ? "#16A34A" : "#DC2626",
                    }}>
                      {disponible}
                    </span>
                    {disponible === 0 && (
                      <span style={{
                        display: "block", fontSize: "10px", color: "#DC2626",
                        marginTop: "1px", whiteSpace: "nowrap",
                      }}>
                        Sin unidades
                      </span>
                    )}
                  </td>

                  <td style={{ padding: "10px 12px", textAlign: "center" }}>{asignados}</td>

                  {/* Estado con badge */}
                  <td style={{ padding: "10px 12px" }}>
                    <EstadoBadge estado={inst.estado} />
                  </td>

                  {/* Acciones por fila */}
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        style={btn("#2E5FA7")}
                        onClick={() => abrirEditar(inst)}
                        title="Editar instrumento"
                      >
                        Editar
                      </button>
                      <button
                        style={btn("#8E2A25")}
                        onClick={() => abrirEliminar(inst)}
                        title="Eliminar instrumento"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* ── Paginación ── */}
      {totalPaginas > 1 && (
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: "8px", marginTop: "20px",
        }}>
          <button
            style={btn("#8E2A25", paginaActual === 1)}
            disabled={paginaActual === 1}
            onClick={() => setPagina(1)}
          >«</button>
          <button
            style={btn("#8E2A25", paginaActual === 1)}
            disabled={paginaActual === 1}
            onClick={() => setPagina(p => p - 1)}
          >‹</button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPagina(p)}
              style={{
                padding: "6px 12px", borderRadius: "4px", fontSize: "13px",
                border: p === paginaActual ? "2px solid #8E2A25" : "1px solid #ccc",
                backgroundColor: p === paginaActual ? "#8E2A25" : "#fff",
                color: p === paginaActual ? "#fff" : "#333",
                cursor: "pointer", fontWeight: p === paginaActual ? "700" : "400",
              }}
            >{p}</button>
          ))}
          <button
            style={btn("#8E2A25", paginaActual === totalPaginas)}
            disabled={paginaActual === totalPaginas}
            onClick={() => setPagina(p => p + 1)}
          >›</button>
          <button
            style={btn("#8E2A25", paginaActual === totalPaginas)}
            disabled={paginaActual === totalPaginas}
            onClick={() => setPagina(totalPaginas)}
          >»</button>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════════════
          MODAL — AGREGAR INSTRUMENTO
      ══════════════════════════════════════════════════════════════ */}
      {modalAgregar && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <button
              onClick={() => setModalAgregar(false)}
              style={{ position: "absolute", top: "14px", right: "18px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666" }}
            >✕</button>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "24px", fontSize: "16px", letterSpacing: "1px" }}>
              AGREGAR INSTRUMENTO
            </h2>
            <CamposForm esEdicion={false} />
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "28px" }}>
              <button style={btn("#2E5FA7")} onClick={handleAgregar}>Guardar</button>
              <button style={btn("#6B7280")} onClick={() => setModalAgregar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════════════
          MODAL — EDITAR INSTRUMENTO
      ══════════════════════════════════════════════════════════════ */}
      {modalEditar && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <button
              onClick={() => setModalEditar(false)}
              style={{ position: "absolute", top: "14px", right: "18px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666" }}
            >✕</button>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "24px", fontSize: "16px", letterSpacing: "1px" }}>
              EDITAR INSTRUMENTO
            </h2>
            <CamposForm esEdicion={true} />
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "28px" }}>
              <button style={btn("#2E5FA7")} onClick={handleEditar}>Guardar cambios</button>
              <button style={btn("#6B7280")} onClick={() => setModalEditar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════════════
          MODAL — ADVERTENCIA: instrumento con asignaciones activas
          Se muestra al intentar cambiar estado a Inactivo/Mantenimiento
      ══════════════════════════════════════════════════════════════ */}
      {modalAdvertencia && (
        <div style={modalOverlay}>
          <div style={{ ...modalBox, width: "400px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <p style={{ fontSize: "14px", color: "#333", marginBottom: "8px", fontWeight: "600" }}>
              Instrumento con asignaciones activas
            </p>
            <p style={{ fontSize: "13px", color: "#555", marginBottom: "24px", lineHeight: "1.5" }}>
              Este instrumento tiene <strong>{seleccionado?.asignados ?? "N"}</strong> asignación(es) activa(s).
              ¿Desea continuar? Las asignaciones existentes no se cancelarán automáticamente.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <button style={btn("#2E5FA7")} onClick={ejecutarEdicion}>Continuar</button>
              <button style={btn("#6B7280")} onClick={() => setModalAdvertencia(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════════════
          MODAL — CONFIRMAR ELIMINAR
      ══════════════════════════════════════════════════════════════ */}
      {modalEliminar && (
        <div style={modalOverlay}>
          <div style={{ ...modalBox, width: "380px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🗑️</div>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "#333", marginBottom: "8px" }}>
              ¿Está seguro de eliminar este instrumento?
            </p>
            <p style={{ fontSize: "13px", color: "#8E2A25", fontWeight: "600", marginBottom: "24px" }}>
              {seleccionado?.nombre}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <button style={btn("#8E2A25")} onClick={handleEliminar}>Confirmar</button>
              <button style={btn("#6B7280")} onClick={() => setModalEliminar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════════════
          MODAL — ERROR: no se puede eliminar (tiene préstamo activo)
      ══════════════════════════════════════════════════════════════ */}
      {modalErrorEliminar && (
        <div style={modalOverlay}>
          <div style={{ ...modalBox, width: "400px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🚫</div>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "8px" }}>
              No es posible eliminar este instrumento
            </p>
            <p style={{ fontSize: "13px", color: "#555", marginBottom: "24px" }}>
              Tiene asignaciones activas. Debe registrar la devolución antes de eliminar el instrumento.
            </p>
            <button style={btn("#8E2A25")} onClick={() => setModalErrorEliminar(false)}>
              Aceptar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventarioPage;