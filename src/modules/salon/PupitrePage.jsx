import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axiosClient from "../../api/axiosClient";

import {
  getPupitresRequest,
  updatePupitreRequest,
  allsalonesRequest,
  allaniosacademicosRequest,
} from "../../api/endpoints";

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

  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  const [loading, setLoading] = useState(true);

  const [rows, setRows] = useState([]);
  const [rowsFiltered, setRowsFiltered] = useState([]);

  const [salones, setSalones] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  const [error, setError] = useState(null);

  // =========================
  // MAPS RELACIONALES
  // =========================

  const salonesMap = {};

  salones.forEach((s) => {
    salonesMap[s.id_salon] = s;
  });

  const periodosMap = {};

  periodos.forEach((p) => {
    periodosMap[p.id_periodo] = p;
  });

  // =========================
  // COLUMNAS TABLA
  // =========================

  const columns = [
    { key: "codigo", label: "CÓDIGO" },

    { key: "nombre", label: "NOMBRE COMPLETO" },

    {
      key: "grado",
      label: "GRADO",

      render: (_, row) => (
        <span>
          {salonesMap[row.id_salon]?.grado ||
            row.grado}
        </span>
      ),
    },

    {
      key: "grupo",
      label: "GRUPO",

      render: (_, row) => (
        <span>
          {salonesMap[row.id_salon]?.grupo ||
            row.grupo}
        </span>
      ),
    },

    {
      key: "estado",
      label: "PAGO",

      render: (val) => (
        <span
          className={
            val === "visto"
              ? "badge--ok"
              : "badge--warning"
          }
        >
          {val === "visto" ? "✓" : "–"}
        </span>
      ),
    },

    {
      key: "fecha_pago",
      label: "FECHA DE PAGO",

      render: (val) => {
    if (!val || val === "") return <span>---</span>;
    return <span>{val}</span>;  // 👈 Solo esto, ya viene formateada
  },
},
  ];

  // =========================
  // CARGAR PUPITRES
  // =========================

  const cargarPupitres = async () => {
    try {
      const response = await getPupitresRequest();

      const data = response.data || [];

      setRows(data);

      setRowsFiltered(data);
    } catch (error) {
      console.error(
        "Error cargando pupitres:",
        error
      );

      setError(error.message);
    }
  };

  // =========================
  // CARGAR SALONES
  // =========================

  const cargarSalones = async () => {
    try {
      const response = await allsalonesRequest();

      setSalones(response.data || []);
    } catch (error) {
      console.error(
        "Error cargando salones:",
        error
      );
    }
  };

  // =========================
  // CARGAR PERIODOS (USANDO ENDPOINT)
  // =========================

  const cargarPeriodos = async () => {
    try {
      const response = await allaniosacademicosRequest();

      setPeriodos(response.data || []);

      console.log(
        "Periodos cargados:",
        response.data
      );
    } catch (error) {
      console.error(
        "Error cargando periodos:",
        error
      );
    }
  };

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        setLoading(true);

        await Promise.all([
          cargarPupitres(),
          cargarSalones(),
          cargarPeriodos(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
  }, []);

  // =========================
  // FILTRAR
  // =========================

  const FiltrarEstudiantes = (filtros) => {
    let filtered = rows;

    // CÓDIGO
    if (filtros.documento) {
      filtered = filtered.filter((r) =>
        r.codigo
          ?.toString()
          .includes(filtros.documento)
      );
    }

    // NOMBRE
    if (filtros.nombre) {
      filtered = filtered.filter((r) =>
        r.nombre
          ?.toLowerCase()
          .includes(
            filtros.nombre.toLowerCase()
          )
      );
    }

    // GRADO
    if (filtros.Grado) {
      filtered = filtered.filter(
        (r) =>
          (
            salonesMap[r.id_salon]?.grado ||
            r.grado
          )?.toString() ===
          filtros.Grado.toString()
      );
    }

    // GRUPO
    if (filtros.Grupo) {
      filtered = filtered.filter(
        (r) =>
          (
            salonesMap[r.id_salon]?.grupo ||
            r.grupo
          )?.toString() ===
          filtros.Grupo.toString()
      );
    }

    // PERIODO
    if (filtros.Periodo) {
      filtered = filtered.filter((r) => {
        const salon =
          salonesMap[r.id_salon];

        const periodo =
          periodosMap[salon?.id_periodo];

        return (
          periodo?.nombre?.toString() ===
          filtros.Periodo.toString()
        );
      });
    }

    setRowsFiltered(filtered);
  };

  // =========================
  // CLICK FILA
  // =========================

  const handleRowClick = (f) => {
    console.log(
      "Fila seleccionada:",
      f
    );

    setFila(f);

    setMensajeConfirmacion("");
  };

  // =========================
  // VALIDAR PAGO
  // =========================

  const handleValidarPago = () => {
    if (!fila) {
      alert(
        "Debes seleccionar una fila"
      );

      return;
    }

    setMensajeConfirmacion("");

    setModal(true);
  };

  // =========================
  // CONFIRMAR PAGO
  // =========================

  const handleConfirmarPago = async () => {
    try {
      const nuevoEstado = "visto";

      const fechaActual = new Date()
        .toISOString()
        .split("T")[0];

      // Realizar la actualización en el servidor
      await updatePupitreRequest(
        fila.id_mantenimiento,
        {
          estado: nuevoEstado,
          fecha_pago: fechaActual,
        }
      );

      // Actualizar el estado local con la fecha correcta
      const rowsActualizados = rows.map(
        (r) =>
          r.id_mantenimiento ===
          fila.id_mantenimiento
            ? {
                ...r,
                estado: nuevoEstado,
                fecha_pago: fechaActual,
              }
            : r
      );

      setRows(rowsActualizados);
      setRowsFiltered(rowsActualizados);

      // Actualizar fila seleccionada para que refleje cambios
      setFila({
        ...fila,
        estado: nuevoEstado,
        fecha_pago: fechaActual,
      });

      // Mostrar mensaje de confirmación
      setMensajeConfirmacion(
        `El pago de ${fila.nombre} fue validado correctamente`
      );

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setModal(false);
        setMensajeConfirmacion("");
        setFila(null);
      }, 2000);
    } catch (error) {
      console.error(
        "Error al validar pago:",
        error.response?.data || error
      );

      setMensajeConfirmacion(
        "Error al validar el pago. Por favor, intenta de nuevo."
      );

      // Cerrar modal después de 3 segundos en caso de error
      setTimeout(() => {
        setModal(false);
        setMensajeConfirmacion("");
      }, 3000);
    }
  };

  // =========================
  // LOADING / ERROR
  // =========================

  if (loading)
    return (
      <div>
        Cargando pupitres...
      </div>
    );

  if (error)
    return (
      <div>
        Error cargando datos:
        {error}
      </div>
    );

  // =========================
  // RENDER
  // =========================

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
          }

          .badge--warning {
            display: inline-block;
            padding: 0.4rem 0.8rem;
            background: #FFF3CD;
            color: #856404;
            border-radius: 0.4rem;
            font-weight: 600;
            font-size: 0.9rem;
          }
        `}
      </style>

      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={[
              {
                label: "Inicio",
                path: "/salon",
              },
            ]}
            selectedMenu={"Inicio"}
            setSelectedMenu={() => {}}
            user="Nombre usuario"
            logout={() =>
              console.log("logout")
            }
          />
        }
        actions={
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent:
                "flex-end",
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

                  onClick:
                    handleValidarPago,
                  disabled: !fila || fila?.estado === "visto",  //  Agrega esto
                  variante: "primary",
                },
              ]}
            />
          </div>
        }
      >
        <SearchBar
          fields={[
            {
              key: "documento",
              label: "Código",
              type: "text",
            },

            {
              key: "nombre",
              label: "Nombre",
              type: "text",
            },

            {
              key: "Grado",
              label: "Grado",
              type: "select",

              options: Array.from(
                new Set(
                  Object.values(
                    salonesMap
                  )
                    .map((s) => s.grado)
                    .filter(Boolean)
                )
              ),
            },

            {
              key: "Grupo",
              label: "Grupo",
              type: "select",

              options: Array.from(
                new Set(
                  Object.values(
                    salonesMap
                  )
                    .map((s) => s.grupo)
                    .filter(Boolean)
                )
              ),
            },

            {
              key: "Periodo",
              label: "Periodo",
              type: "select",

              options: Array.from(
                new Set(
                  Object.values(
                    periodosMap
                  )
                    .map((p) => p.nombre)
                    .filter(Boolean)
                )
              ),
            },
          ]}
          onSearch={(f) => {
            FiltrarEstudiantes(f);

            console.log(f);
          }}
        />

        <div
          style={{
            marginTop: "1rem",
            background: "#FFFFFF",
            borderRadius: "0.8rem",
            overflow: "hidden",
            border:
              "1px solid #D9D9D9",
          }}
        >
          <div
            style={{
              padding: "0.5rem 1rem",
              background: "#f5f5f5",
              borderBottom:
                "1px solid #D9D9D9",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            {rowsFiltered.length}{" "}
            estudiantes
          </div>

          <DataTable
            columns={columns}
            rows={rowsFiltered}
            emptyText="No hay datos disponibles"
            onRowClick={
              handleRowClick
            }
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
  onCancel={() => {
    setModal(false);
    setMensajeConfirmacion("");
  }}
>
  <div
    style={{
      textAlign: "center",
      fontSize: "1.2rem",
      lineHeight: 1.6,
      padding: "2rem 1rem",
      minHeight: "150px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {!mensajeConfirmacion ? (
      <div>
        <p>¿CONFIRMAS QUE EL ESTUDIANTE</p>
        <strong style={{ fontSize: "1.4rem", color: "#1976d2", display: "block", margin: "1rem 0" }}>
          {fila?.nombre || "SIN ESTUDIANTE"}
        </strong>
        <p>HA CUMPLIDO CON EL PAGO DEL CONCEPTO DE PUPITRES?</p>
      </div>
    ) : (
      <strong
        style={{
          fontSize: "1.3rem",
          color: mensajeConfirmacion.includes("Error") ? "#d32f2f" : "#388e3c",
        }}
      >
        {mensajeConfirmacion}
      </strong>
    )}
  </div>
</Modal>
    </div>
  );
}