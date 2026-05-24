import { useState, useEffect } from "react";
import { Home } from "lucide-react";

import { getPruebasRequest } from "../../api/endpoints";

import Header from "../../components/layout/Header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";

import SearchBar from "../../components/shared/SearchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";

export default function PruebasPage() {

  const [fila, setFila] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  const menuItems = [
    {
      label: "Inicio",
      icon: <Home />,
      path: "/home",
    },
  ];

  // =========================
  // COLUMNAS
  // =========================
  const columns = [
    { key: "codigo", label: "CÓDIGO" },
    { key: "nombre", label: "NOMBRE COMPLETO" },
    { key: "grado", label: "GRADO" },
    { key: "grupo", label: "GRUPO" },
    { key: "tipo_prueba", label: "TIPO DE PRUEBA" },

    {
      key: "estado",
      label: "PAGO",
      render: (val) => (
        <span className={val ? "badge--ok" : "badge--warning"}>
          {val ? "✓" : "–"}
        </span>
      ),
    },

    {
      key: "fecha_pago",
      label: "FECHA DE PAGO",
      render: (val) => val ? val : "—",
    },
  ];

  // =========================
  // TRAER DATOS
  // =========================
  useEffect(() => {

    const obtenerPruebas = async () => {

      try {
        setLoading(true);

        const response = await getPruebasRequest();
        const data = response.data;

        // 🔥 NORMALIZACIÓN CRÍTICA
        const clean = Array.isArray(data)
          ? data.map((p) => ({
              ...p,

              // asegura boolean real
              estado: Boolean(p.estado),

              // asegura fecha consistente
              fecha_pago: p.fecha_pago ?? null,
            }))
          : [];

        setRows(clean);

      } catch (error) {
        console.error(error);
        setError(error.message);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerPruebas();

  }, []);

  // =========================
  // VALIDAR PAGO
  // =========================
  const handleValidarPago = () => {

    if (!fila) {
      alert("Debes seleccionar una fila");
      return;
    }

    // 🔥 CORREGIDO: estado es boolean
    if (fila.estado === true) {
      alert(
        `EL ESTUDIANTE [${fila.nombre}] YA TIENE PAGO REGISTRADO.`
      );
      return;
    }

    setModal(true);
  };

  if (loading) return <div>Cargando pruebas...</div>;

  return (
    <div>

      <style>{`
        .badge--ok {
          padding: 0.4rem 0.8rem;
          background: #D4EDDA;
          color: #155724;
          border-radius: 0.4rem;
          font-weight: 600;
        }

        .badge--warning {
          padding: 0.4rem 0.8rem;
          background: #FFF3CD;
          color: #856404;
          border-radius: 0.4rem;
          font-weight: 600;
        }
      `}</style>

      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu={"Inicio"}
            setSelectedMenu={() => {}}
            user="Nombre usuario"
            logout={() => console.log("logout")}
          />
        }
        actions={
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
        }
      >

        <div style={{ marginTop: "1rem" }}>
          <DataTable
            columns={columns}
            rows={rows}
            emptyText="No hay datos"
            onRowClick={(f) => setFila(f)}
          />
        </div>

      </ModuleLayout>

      <Modal
        title="CONFIRMACIÓN"
        isOpen={modal}
        fields={[]}
        values={{}}
        onChange={() => {}}
        onAccept={() => {
          console.log("Pago validado");
          setModal(false);
        }}
        onCancel={() => setModal(false)}
      >

        <div style={{ textAlign: "center", fontSize: "1.2rem" }}>
          ¿Confirmas pago del estudiante <b>{fila?.nombre}</b>?
        </div>

      </Modal>

    </div>
  );
}