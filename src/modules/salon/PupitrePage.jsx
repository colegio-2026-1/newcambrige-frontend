import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPupitresRequest, updatePupitreRequest } from "../../api/endpoints";

import Header from "../../components/layout/Header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";

import SearchBar from "../../components/shared/SearchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";

export default function PupitrePage() {
  const navigate = useNavigate();
  const [fila, setFila] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsFiltered, setRowsFiltered] = useState([]);
  const [error, setError] = useState(null);

  const columns = [
    { key: "codigo", label: "CÓDIGO" },
    { key: "nombre", label: "NOMBRE COMPLETO" },
    { key: "grado", label: "GRADO" },
    { key: "grupo", label: "GRUPO" },
    {
      key: "estado",
      label: "PAGO",
      render: (val, row) => (
        <span
          className={val ? "badge--ok" : "badge--warning"}
          style={{ cursor: "pointer" }}
          onClick={() => handleToggleEstado(row)}
          title="Click para cambiar estado"
        >
          {val ? "✓" : "–"}
        </span>
      ),
    },
    { key: "fecha_pago", label: "FECHA DE PAGO" },
  ];

  // TRAER DATOS SOLO BACKEND
  useEffect(() => {
    const obtenerPupitres = async () => {
      try {
        setLoading(true);

        const response = await getPupitresRequest();

        console.log("Respuesta API pupitres:", response.data);

        const data = response.data;

        setRows(Array.isArray(data) ? data : []);
        setRowsFiltered(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setRows([]);
        setRowsFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerPupitres();
  }, []);

  // CAMBIAR ESTADO INDIVIDUAL
  const handleToggleEstado = async (row) => {
    try {
      const nuevoEstado = !row.estado;
      
      // Actualizar en BD
      await updatePupitreRequest(row.id_mantenimiento, { estado: nuevoEstado });

      // Actualizar en el estado local
      const rowsActualizados = rows.map((r) =>
        r.id_mantenimiento === row.id_mantenimiento
          ? { 
              ...r, 
              estado: nuevoEstado,
              fecha_pago: nuevoEstado ? new Date().toLocaleDateString('es-ES') : ""
            }
          : r
      );

      setRows(rowsActualizados);
      setRowsFiltered(rowsActualizados);
      setFila(null);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado");
    }
  };

  // VALIDAR PAGO (abre modal de confirmación)
  const handleValidarPago = () => {
    if (!fila) {
      alert("Debes seleccionar una fila");
      return;
    }
    setModal(true);
  };

  // CONFIRMAR VALIDACIÓN DE PAGO
  const handleConfirmarPago = async () => {
    try {
      const nuevoEstado = true; // Marcar como pagado
      
      // Actualizar en BD
      await updatePupitreRequest(fila.id_mantenimiento, { estado: nuevoEstado });

      // Actualizar en el estado local
      const rowsActualizados = rows.map((r) =>
        r.id_mantenimiento === fila.id_mantenimiento
          ? { 
              ...r, 
              estado: nuevoEstado,
              fecha_pago: new Date().toLocaleDateString('es-ES')
            }
          : r
      );

      setRows(rowsActualizados);
      setRowsFiltered(rowsActualizados);
      setFila(null);
      setModal(false);
      
      alert("Pago validado correctamente");
    } catch (error) {
      console.error("Error al validar pago:", error);
      alert("Error al validar el pago");
    }
  };

  // MARCAR TODO
  const handleMarcarTodo = () => {
    const cantidad = rowsFiltered.length;
    const confirmacion = window.confirm(
      `¿Confirmas marcar como pagado a los ${cantidad} estudiantes?`
    );

    if (!confirmacion) return;

    const fechaHoy = new Date().toLocaleDateString('es-ES');
    const rowsActualizados = rows.map((r) => ({ 
      ...r, 
      estado: true,
      fecha_pago: fechaHoy
    }));
    
    setRows(rowsActualizados);
    setRowsFiltered(rowsActualizados);
  };

  // DESMARCAR TODO
  const handleDesmarcarTodo = () => {
    const cantidad = rowsFiltered.length;
    const confirmacion = window.confirm(
      `¿Confirmas marcar como pendiente a los ${cantidad} estudiantes?`
    );

    if (!confirmacion) return;

    const rowsActualizados = rows.map((r) => ({ 
      ...r, 
      estado: false,
      fecha_pago: ""
    }));
    
    setRows(rowsActualizados);
    setRowsFiltered(rowsActualizados);
  };

  // BUSCAR
  const handleSearch = (filtros) => {
    console.log("Filtros:", filtros);

    // Filtrar por los criterios que vienen del SearchBar
    let filtered = rows;

    if (filtros.codigo) {
      filtered = filtered.filter((r) =>
        r.codigo?.toLowerCase().includes(filtros.codigo.toLowerCase())
      );
    }

    if (filtros.nombre) {
      filtered = filtered.filter((r) =>
        r.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase())
      );
    }

    if (filtros.grado) {
      filtered = filtered.filter((r) => r.grado?.toString() === filtros.grado);
    }

    if (filtros.grupo) {
      filtered = filtered.filter((r) => r.grupo?.toString() === filtros.grupo);
    }

    setRowsFiltered(filtered);
  };

  const handleRowClick = (f) => {
    setFila(f);
  };

  if (loading) return <div>Cargando pupitres...</div>;

  if (error) return <div>Error cargando datos: {error}</div>;

  return (
    <div>
      <style>
        {`
          .badge--ok {
            display: inline-block;
            padding: 0.4rem 0.8rem;
            background: #D4EDDA;
            color: #155724;
            border-radius: 0.4rem;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .badge--ok:hover {
            background: #28a745;
            color: white;
          }

          .badge--warning {
            display: inline-block;
            padding: 0.4rem 0.8rem;
            background: #FFF3CD;
            color: #856404;
            border-radius: 0.4rem;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .badge--warning:hover {
            background: #ffc107;
            color: white;
          }
        `}
      </style>

      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={[{ label: "Inicio", path: "/salon" }]}
            selectedMenu={"Inicio"}
            setSelectedMenu={() => {}}
            user="Nombre usuario"
            logout={() => console.log("logout")}
          />
        }
        actions={
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              paddingRight: "1rem",
              marginTop: "0.4rem",
            }}
          >
            <ActionButtons
              filaSeleccionada={fila}
              botones={[
            {
              label: "Validar Pago",
              onClick: handleValidarPago,
              variante: "primary",
             },
            ]}
          />
          </div>
        }
      >
        <SearchBar
          loading={loading}
          onSearch={handleSearch}
          fields={[
            { key: "codigo", label: "Código", type: "text" },
            { key: "nombre", label: "Nombre", type: "text" },
            {
              key: "grado",
              label: "Grado",
              type: "select",
              options: ["6", "7", "8", "9", "10", "16"],
            },
            {
              key: "grupo",
              label: "Grupo",
              type: "select",
              options: ["A", "B", "C"],
            },
            {
              key: "anio",
              label: "Año",
              type: "select",
              options: ["2025", "2026"],
            },
          ]}
        />

        <div
          style={{
            marginTop: "1rem",
            background: "#FFFFFF",
            borderRadius: "0.8rem",
            overflow: "hidden",
            border: "1px solid #D9D9D9",
          }}
        >
          <div
            style={{
              padding: "0.5rem 1rem",
              background: "#f5f5f5",
              borderBottom: "1px solid #D9D9D9",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            {rowsFiltered.length} estudiantes
          </div>

          <DataTable
            columns={columns}
            rows={rowsFiltered}
            emptyText="No hay datos disponibles"
            onRowClick={handleRowClick}
          />
        </div>
      </ModuleLayout>

      <Modal
        title="CONFIRMACIÓN"
        isOpen={modal}
        fields={[]}
        values={{}}
        onChange={() => {}}
        onAccept={handleConfirmarPago}
        onCancel={() => setModal(false)}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "1.4rem",
            lineHeight: 1.5,
            padding: "1rem",
          }}
        >
          ¿CONFIRMAS QUE EL ESTUDIANTE
          <br />
          <strong>
            [{fila?.nombre?.toUpperCase() || "SIN SELECCIONAR"}]
          </strong>
          <br />
          HA CUMPLIDO CON EL PAGO DEL
          <br />
          CONCEPTO DE PUPITRES?
        </div>
      </Modal>
    </div>
  );
}