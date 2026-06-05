import React from 'react';
import usePrestamos from "../hooks/usePrestamos";
import { useAuth } from "../../../../api/useAuth";

import ModuleLayout from "../../../../components/layout/ModuleLayout";
import Sidebar from "../../../../components/layout/Sidebar";
import Header from "../../../../components/layout/Header";
import DataTable from "../../../../components/shared/DataTable";
import SearchBar from "../../../../components/shared/searchBar";
import ActionButtons from "../../../../components/shared/ActionButtons";

import PrestamosSidebar from "../components/PrestamosSidebar";
import Toast from "../../inventario/components/Toast";
import InventarioPagination from "../../inventario/components/InventarioPagination";

import AgregarPrestamoModal from "../components/modals/AgregarPrestamoModal";
import DevolverInstrumentoModal from "../components/modals/DevolverInstrumentoModal";

import "../../inventario/pages/InventarioPage.css"; 

const PrestamosPage = () => {
  const prestamos = usePrestamos();
  const { user } = useAuth();

  if (prestamos.loading) return <div className="inventario-loading">Cargando...</div>;

  const menuBanda = [
    { label: "Inicio", path: "/banda" },
    { label: "Inventario Banda", path: "/banda/inventario" },
    { label: "Asignaciones", path: "/banda/prestamos" },
  ];

  if (user?.roles?.includes("admin") || user?.rol === "admin") {
    menuBanda.push({ label: "Auditoría", path: "/banda/auditoria" });
  }

  // --- TABLA ÚNICA MAESTRA ---
  const columnasEstudiantes = [
    { key: "documento", label: "CÓDIGO" }, // Documento del estudiante
    { key: "nombre", label: "NOMBRE COMPLETO" },
    { key: "salon_grado", label: "GRADO" },
    { key: "salon_grupo", label: "GRUPO" },
    { 
      key: "instrumento", 
      label: "INSTRUMENTO",
      render: (val, row) => {
        const pActivo = prestamos.prestamos.find(p => p.id_estudiante === row.id_estudiante && p.estado_entrega === "prestado");
        return pActivo ? pActivo.instrumento_nombre : "—";
      }
    },
    { 
      key: "estado", 
      label: "ESTADO",
      render: (val, row) => {
        const tiene = prestamos.prestamos.some(p => p.id_estudiante === row.id_estudiante && p.estado_entrega === "prestado");
        return <span style={{ color: tiene ? "#D97706" : "#059669", fontWeight: "bold" }}>
          {tiene ? "Pendiente" : "Paz y Salvo"}
        </span>;
      }
    },
  ];

  const camposBusqueda = [
    { key: "documento", label: "Código", type: "text" },
    { key: "nombre", label: "Nombre", type: "text" },
    { key: "grado", label: "Grado", type: "select", options: ["6°", "7°", "8°", "9°", "10°", "11°"] },
    { key: "grupo", label: "Grupo", type: "select", options: ["A", "B", "C"] },
    { key: "año", label: "Año", type: "select", options: ["2024", "2025", "2026"] },
  ];

  const estudianteSel = prestamos.estudianteSeleccionado;
  const tienePrestamoActivo = estudianteSel ? (prestamos.prestamos || []).some(p => p.id_estudiante === estudianteSel.id_estudiante && p.estado_entrega === "prestado") : false;

  return (
    <div className='banda-module-container banda-custom-sidebar view-prestamos'>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      
      <div className="inventario-page">
        <Toast message={prestamos.toast} />

        <ModuleLayout
          sidebar={<Sidebar moduloActual="Asignaciones" menuItems={menuBanda} user={user} />}
        >
          {/* SECCIÓN SUPERIOR: FILTROS A TODO EL ANCHO */}
          <div className="banda-filters-fullwidth">
            <SearchBar 
              fields={camposBusqueda} 
              onSearch={(f) => {
                prestamos.setFiltroDocumento(f.documento);
                prestamos.setFiltroNombre(f.nombre);
                prestamos.setFiltroGrado(f.grado);
                prestamos.setFiltroGrupo(f.grupo);
                prestamos.setFiltroAño(f.año);
                prestamos.handleBuscar();
              }} 
            />
          </div>

          {/* SECCIÓN INFERIOR: GRID DIVIDIDO (TABLA | BOTONES) */}
          <div className="banda-main-grid">
            <div className="banda-table-container">
              <div className="inventario-table-card">
                <DataTable 
                  columns={columnasEstudiantes} 
                  rows={prestamos.estudiantesPaginados} 
                  onRowClick={(row) => {
                    prestamos.setEstudianteSeleccionado(row);
                    // Actualizamos el formulario de préstamo con el ID del estudiante clickeado
                    prestamos.setForm({ ...prestamos.form, id_estudiante: row?.id_estudiante });
                  }} 
                  emptyText="No hay estudiantes registrados" 
                />
              </div>
              
              <InventarioPagination 
                paginaActual={prestamos.paginaEstudiantes} 
                totalPaginas={prestamos.totalPaginasEstudiantes} 
                setPagina={prestamos.setPaginaEstudiantes} 
              />
            </div>

            <div className="banda-sidebar-actions">
              <ActionButtons
                filaSeleccionada={estudianteSel}
                botones={[
                  { 
                    label: "Asignar Instrumento", 
                    onClick: () => prestamos.setModalAgregar(true), 
                    disabled: !estudianteSel || tienePrestamoActivo, 
                    variante: "primary" 
                  },
                  { 
                    label: "Registrar Devolución", 
                    onClick: () => prestamos.abrirModalDevolver(estudianteSel), 
                    disabled: !estudianteSel || !tienePrestamoActivo, 
                    variante: "secondary" 
                  },
                ]}
              />
              {/* Aquí ya no van estadísticas, solo los botones de acción */}
            </div>
          </div>
        </ModuleLayout>

        {/* MODALES DE LÓGICA */}
        <AgregarPrestamoModal 
            open={prestamos.modalAgregar} 
            onClose={() => prestamos.setModalAgregar(false)} 
            form={prestamos.form} 
            setForm={prestamos.setForm} 
            instrumentos={prestamos.instrumentos} 
            handleAgregar={prestamos.handleAgregar} 
        />
        
        <DevolverInstrumentoModal 
            open={prestamos.modalDevolver} 
            onClose={() => prestamos.setModalDevolver(false)} 
            onConfirm={prestamos.handleDevolver} 
            prestamo={prestamos.prestamoSeleccionado} 
            form={prestamos.formDevolucion} 
            setForm={prestamos.setFormDevolucion} 
            errores={prestamos.errores} 
        />
      </div>
    </div>
  );
};

export default PrestamosPage;