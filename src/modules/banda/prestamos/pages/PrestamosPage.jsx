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
    { key: "documento", label: "CÓDIGO" },
    { key: "nombre", label: "NOMBRE COMPLETO" },
    { 
      key: "instrumento", 
      label: "INSTRUMENTO ASIGNADO",
      render: (val, row) => {
        const prestamoActivo = (prestamos.prestamos || []).find(p => p.id_estudiante === row.id_estudiante && p.estado_entrega === "prestado");
        return prestamoActivo ? <b style={{color: "var(--color-primary)"}}>{prestamoActivo.instrumento_nombre}</b> : "—";
      }
    },
    { 
      key: "paz_y_salvo", 
      label: "PAZ Y SALVO",
      render: (val, row) => {
        const tienePrestamo = (prestamos.prestamos || []).some(p => p.id_estudiante === row.id_estudiante && p.estado_entrega === "prestado");
        return (
          <span style={{ color: tienePrestamo ? "#D97706" : "var(--color-success)", fontWeight: "bold", fontSize: "12px" }}>
            {tienePrestamo ? "Pendiente" : "Completo"}
          </span>
        );
      }
    },
  ];

  // Lógica para habilitar/deshabilitar botones
  const estudianteSel = prestamos.estudianteSeleccionado;
  const tienePrestamoActivo = estudianteSel ? (prestamos.prestamos || []).some(p => p.id_estudiante === estudianteSel.id_estudiante && p.estado_entrega === "prestado") : false;

  return (
    <div className='banda-module-container banda-custom-sidebar'>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      
      <div className="prestamos-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Toast message={prestamos.toast} />

        <ModuleLayout
          sidebar={
            <Sidebar moduloActual="Préstamos" selectedMenu="Asignaciones" menuItems={menuBanda} user={user} />
          }
        >
          <SearchBar 
            fields={[{ key: "nombre", label: "Buscar Estudiante", type: "text" }]} 
            onSearch={(f) => {
              prestamos.setFiltroNombre(f.nombre);
              prestamos.setPaginaEstudiantes(1);
            }} 
          />

          <div className="banda-split-container">
            <div className="banda-table-section" style={{ overflowY: 'auto', paddingRight: '10px' }}>
              
              {/* TABLA ÚNICA */}
              <div className="inventario-table-card">
                <DataTable 
                  columns={columnasEstudiantes} 
                  rows={prestamos.estudiantesPaginados} 
                  onRowClick={(row) => {
                    prestamos.setEstudianteSeleccionado(row);
                    prestamos.setForm({ ...prestamos.form, id_estudiante: row?.id_estudiante });
                  }} 
                  emptyText="No hay estudiantes disponibles" 
                />
              </div>
              
              {/* PAGINACIÓN CON FLECHAS AZULES */}
              <InventarioPagination 
                paginaActual={prestamos.paginaEstudiantes} 
                totalPaginas={prestamos.totalPaginasEstudiantes} 
                setPagina={prestamos.setPaginaEstudiantes} 
              />

            </div>

            <div className="banda-actions-section">
              <ActionButtons
                filaSeleccionada={estudianteSel}
                botones={[
                  { 
                    label: "Asignar Instrumento", 
                    onClick: () => prestamos.setModalAgregar(true), 
                    disabled: !estudianteSel || tienePrestamoActivo, // Se bloquea si ya tiene uno
                    variante: "primary" 
                  },
                  { 
                    label: "Registrar Devolución", 
                    onClick: () => prestamos.abrirModalDevolver(estudianteSel), 
                    disabled: !estudianteSel || !tienePrestamoActivo, // Se bloquea si NO tiene uno
                    variante: "secondary" 
                  },
                ]}
              />
              <PrestamosSidebar estudiantes={prestamos.estudiantes} instrumentos={prestamos.instrumentos} estadisticas={prestamos.estadisticas} />
            </div>
          </div>
        </ModuleLayout>

        <AgregarPrestamoModal open={prestamos.modalAgregar} onClose={() => prestamos.setModalAgregar(false)} form={prestamos.form} setForm={prestamos.setForm} instrumentos={prestamos.instrumentos} handleAgregar={prestamos.handleAgregar} />
        <DevolverInstrumentoModal open={prestamos.modalDevolver} onClose={() => prestamos.setModalDevolver(false)} onConfirm={prestamos.handleDevolver} prestamo={prestamos.prestamoSeleccionado} form={prestamos.formDevolucion} setForm={prestamos.setFormDevolucion} errores={prestamos.errores} />
      </div>
    </div>
  );
};

export default PrestamosPage;