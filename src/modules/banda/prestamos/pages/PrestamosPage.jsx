import React from 'react';
import usePrestamos from "../hooks/usePrestamos";
import { useAuth } from "../../../../api/useAuth";

// COMPONENTES GLOBALES DEL EQUIPO
import ModuleLayout from "../../../../components/layout/ModuleLayout";
import Sidebar from "../../../../components/layout/Sidebar";
import Header from "../../../../components/layout/Header";
import DataTable from "../../../../components/shared/DataTable";
import SearchBar from "../../../../components/shared/searchBar";
import ActionButtons from "../../../../components/shared/ActionButtons";

// COMPONENTES DEL MÓDULO
import PrestamosSidebar from "../components/PrestamosSidebar";
import Toast from "../../inventario/components/Toast";

// MODALES
import AgregarPrestamoModal from "../components/modals/AgregarPrestamoModal";
import DevolverInstrumentoModal from "../components/modals/DevolverInstrumentoModal";

// ESTILOS UNIFICADOS
import "../../inventario/pages/InventarioPage.css"; 

const PrestamosPage = () => {
  const prestamos = usePrestamos();
  const { user } = useAuth();

  if (prestamos.loading) return <div className="inventario-loading">Cargando...</div>;

  const menuBanda = [
    { label: "Inicio", path: "/banda" },
    { label: "Inventario", path: "/banda/inventario" },
    { label: "Préstamos", path: "/banda/prestamos" },
  ];

  if (user?.roles?.includes("admin") || user?.rol === "admin") {
    menuBanda.push({ label: "Auditoría", path: "/banda/auditoria" });
  }

  // --- COLUMNAS ESTUDIANTES ---
  const columnasEstudiantes = [
    { key: "documento", label: "DOCUMENTO" },
    { key: "nombre", label: "ESTUDIANTE" },
    { 
      key: "paz_y_salvo", 
      label: "ESTADO BANDA",
      render: (val, row) => {
        const listaPrestamos = prestamos.prestamos || [];
        const tienePrestamo = listaPrestamos.some(p => p.id_estudiante === row.id_estudiante && p.estado_entrega === "prestado");
        return (
          <span style={{ 
            color: tienePrestamo ? "var(--color-danger)" : "var(--color-success)",
            fontWeight: "bold",
            fontSize: "11px"
          }}>
            {tienePrestamo ? "● NO CUMPLE REQUISITOS" : "● CUMPLE REQUISITOS"}
          </span>
        );
      }
    },
  ];

  // --- COLUMNAS PRÉSTAMOS ACTIVOS ---
  const columnasActivos = [
    { key: "instrumento_nombre", label: "INSTRUMENTO" },
    { key: "estudiante_nombre", label: "ESTUDIANTE" },
    { key: "fecha_prestamo", label: "FECHA ENTREGA", render: (val) => new Date(val).toLocaleDateString() },
    { 
      key: "estado_entrega", 
      label: "ESTADO",
      render: (val) => <span className="badge--ok">{val.toUpperCase()}</span>
    },
  ];

  return (
    <div className='banda-module-container banda-custom-sidebar'>
      <Header title="GESTIÓN DE PRÉSTAMOS Y ASIGNACIONES" />
      
      {/* ✅ CORRECCIÓN: Quitamos el div con la clase "prestamos-page" que sobraba */}
      <Toast message={prestamos.toast} />
      
      <ModuleLayout
        sidebar={
          <Sidebar
            moduloActual="Préstamos"
            selectedMenu="Préstamos"
            menuItems={menuBanda}
            user={user}
          />
        }
      >
        {/* BUSCADOR */}
        <SearchBar 
          fields={[{ key: "nombre", label: "Buscar Estudiante", type: "text" }]} 
          onSearch={(f) => prestamos.setFiltroNombre(f.nombre)} 
        />

        {/* CONTENEDOR DIVIDIDO */}
        <div className="banda-split-container">
          
          {/* IZQUIERDA: TABLAS */}
          <div className="banda-table-section">
            <h3 style={sectionTitleStyle}>1. ESTUDIANTES DISPONIBLES (SELECCIONE PARA ASIGNAR)</h3>
            <div className="inventario-table-card" style={{ marginBottom: '30px' }}>
              <DataTable 
                columns={columnasEstudiantes} 
                rows={prestamos.estudiantesFiltrados} 
                onRowClick={(row) => {
                  prestamos.setEstudianteSeleccionado(row);
                  prestamos.setForm({ ...prestamos.form, id_estudiante: row?.id_estudiante });
                }} 
                emptyText="No hay estudiantes disponibles" 
              />
            </div>

            <h3 style={sectionTitleStyle}>2. INSTRUMENTOS EN PRÉSTAMO (SELECCIONE PARA DEVOLVER)</h3>
            <div className="inventario-table-card">
              <DataTable 
                 columns={columnasActivos} 
                 rows={prestamos.prestamos} 
                 onRowClick={(row) => prestamos.setPrestamoSeleccionado(row)} 
                 emptyText="No hay préstamos activos" 
              />
            </div>
          </div>

          {/* DERECHA: ACCIONES Y RESUMEN */}
          <div className="banda-actions-section">
            <ActionButtons
              filaSeleccionada={prestamos.estudianteSeleccionado || prestamos.prestamoSeleccionado}
              botones={[
                { label: "Asignar Instrumento", onClick: () => prestamos.setModalAgregar(true), disabled: !prestamos.estudianteSeleccionado, variante: "primary" },
                { label: "Registrar Devolución", onClick: () => prestamos.abrirModalDevolver(prestamos.prestamoSeleccionado), disabled: !prestamos.prestamoSeleccionado, variante: "secondary" },
              ]}
            />
            <PrestamosSidebar estudiantes={prestamos.estudiantes} instrumentos={prestamos.instrumentos} estadisticas={prestamos.estadisticas} />
          </div>
        </div>
      </ModuleLayout>

      {/* MODALES */}
      <AgregarPrestamoModal open={prestamos.modalAgregar} onClose={() => prestamos.setModalAgregar(false)} form={prestamos.form} setForm={prestamos.setForm} instrumentos={prestamos.instrumentos} handleAgregar={prestamos.handleAgregar} />
      <DevolverInstrumentoModal open={prestamos.modalDevolver} onClose={() => prestamos.setModalDevolver(false)} onConfirm={prestamos.handleDevolver} prestamo={prestamos.prestamoSeleccionado} form={prestamos.formDevolucion} setForm={prestamos.setFormDevolucion} errores={prestamos.errores} />
    </div>
  );
};

const sectionTitleStyle = { 
  fontFamily: 'var(--font-display)', 
  fontSize: '14px', 
  marginBottom: '10px', 
  color: 'var(--color-secondary)',
  textTransform: 'uppercase'
};

export default PrestamosPage;