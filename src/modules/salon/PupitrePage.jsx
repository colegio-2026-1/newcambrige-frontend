import { useState, useEffect } from "react";


import Header from "../../components/layout/Header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";

import SearchBar from "../../components/shared/SearchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";

import userIcon from "../../assets/Login/usuario_login.svg";

export default function PupitrePage() {

  const [fila, setFila] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  // COLUMNAS
  const columns = [
    { key: "codigo", label: "CÓDIGO" },
    { key: "nombre", label: "NOMBRE COMPLETO" },
    { key: "grado", label: "GRADO" },
    { key: "grupo", label: "GRUPO" },
    { key: "pago", label: "PAGO" },
    { key: "fecha_pago", label: "FECHA DE PAGO" },
  ];

  // ✅ TRAER DATOS DEL API
  useEffect(() => {
    const obtenerPupitres = async () => {
      try {
        setLoading(true);
        const response = await getPupitresRequest();
        setRows(response.data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        // Si hay error, mantén los datos de ejemplo
        setRows([
          {
            id: 1,
            codigo: "5311",
            nombre: "Nombre Gomez Somel",
            grado: "10",
            grupo: "A",
            pago: "Pendiente",
            fecha_pago: "",
          },
          {
            id: 2,
            codigo: "5312",
            nombre: "Juan Pérez",
            grado: "9",
            grupo: "B",
            pago: "Pendiente",
            fecha_pago: "",
          },
          {
            id: 3,
            codigo: "5313",
            nombre: "Laura Gómez",
            grado: "11",
            grupo: "A",
            pago: "Pagado",
            fecha_pago: "12/05/2026",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    obtenerPupitres();
  }, []);

  const handleSearch = (filtros) => {
    console.log(filtros);

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // DEBUG: Log cada vez que fila cambia
  const handleRowClick = (f) => {
    console.log("Fila clickeada:", f);
    setFila(f);
  };

  // DEBUG: Log cuando se abre/cierra modal
  const handleModalOpen = () => {
    console.log("Modal abierto, fila actual:", fila);
    setModal(true);
  };

  if (loading) return <div>Cargando pupitres...</div>;

  return (
    <div>

      <style>
        {`
    .action-btn--primary:hover{
      background: #2E5FA7 !important;
      transform: translateY(2px);
    }

    .datatable-row--selected td{
      background: #E8E3E3 !important;
    }

    .datatable-row--selected .datatable-td-check{
      background: #E8E3E3 !important;
    }

    .datatable-check{
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem !important;
      font-weight: bold;
      width: 100%;
      color: #2E5FA7 !important;
    }

    .datatable-td-check{
      width: 50px !important;
      min-width: 50px !important;
      max-width: 50px !important;
      text-align: center !important;
      padding: 0.75rem !important;
      background: #FFFFFF;
    }

    .datatable-row--selected .datatable-td-check {
      background: #E8E3E3 !important;
    }

    .datatable-row--clickable{
      cursor: pointer;
    }

    .datatable-row--clickable:hover {
      background-color: #F5F5F5 !important;
    }
  `}
      </style>

      {/* HEADER */}
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      {/* LAYOUT */}
      <ModuleLayout
        sidebar={
          <Sidebar
            moduloActual=""
            modulos={[]}
            usuario={{
              nombre: "Nombre usuario",
              rol: "Titular",
            }}
            userIcon={userIcon}
            onLogout={() => console.log("logout")}
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

        {/* SEARCHBAR */}
        <SearchBar
          loading={loading}
          onSearch={handleSearch}
          fields={[
            {
              key: "codigo",
              label: "Código",
              type: "text",
            },
            {
              key: "nombre",
              label: "Nombre",
              type: "text",
            },
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

        {/* TABLA */}
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
            emptyText=""
            onRowClick={handleRowClick}
          />
        </div>

      </ModuleLayout>

      {/* MODAL */}
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
          <strong>[{fila?.nombre ? fila.nombre.toUpperCase() : "SIN SELECCIONAR"}]</strong>
          <br />
          HA CUMPLIDO CON EL PAGO DEL
          <br />
          CONCEPTO DE PUPITRES?
          <br />
          {/* DEBUG: Mostrar el objeto fila */}
          <div style={{fontSize: "0.8rem", marginTop: "1rem", color: "#666"}}>
            DEBUG: {fila ? JSON.stringify(fila) : "No hay fila seleccionada"}
          </div>
        </div>
      </Modal>
    </div>
  );
}