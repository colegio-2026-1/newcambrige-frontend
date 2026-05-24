import { useState, useEffect } from "react";
import { getPupitresRequest } from "../../api/endpoints";

import Header from "../../components/layout/Header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";

import SearchBar from "../../components/shared/SearchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";

export default function PupitrePage() {
  const [fila, setFila] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  const columns = [
    { key: "codigo", label: "CÓDIGO" },
    { key: "nombre", label: "NOMBRE COMPLETO" },
    { key: "grado", label: "GRADO" },
    { key: "grupo", label: "GRUPO" },
    { key: "estado", label: "PAGO" },
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

        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);

        // SIN DATOS MOCK: solo backend
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerPupitres();
  }, []);

  const handleSearch = (filtros) => {
    console.log("Filtros:", filtros);
    // aquí luego puedes conectar backend si tienes endpoint de búsqueda
  };

  const handleRowClick = (f) => {
    setFila(f);
  };

  const handleModalOpen = () => {
    if (!fila) {
      alert("Debes seleccionar una fila");
      return;
    }
    setModal(true);
  };

  if (loading) return <div>Cargando pupitres...</div>;

  if (error) return <div>Error cargando datos: {error}</div>;

  return (
    <div>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={[{ label: "Inicio", path: "/home" }]}
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
              paddingRight: "1rem",
              marginTop: "0.4rem",
            }}
          >
            <ActionButtons
              filaSeleccionada={fila}
              botones={[
                {
                  label: "Validar Pago",
                  onClick: handleModalOpen,
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
              options: ["6", "7", "8", "9", "10", "11"],
            },
            {
              key: "grupo",
              label: "Grupo",
              type: "select",
              options: ["1", "2", "3"],
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
          <DataTable
            columns={columns}
            rows={rows}
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
        onAccept={() => {
          console.log("Pago validado para:", fila);
          setModal(false);
        }}
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