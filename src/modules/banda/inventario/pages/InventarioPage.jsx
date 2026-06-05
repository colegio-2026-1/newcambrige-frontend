import React from 'react';
import "./InventarioPage.css";
import useInventario from "../hooks/useInventario";
import { useAuth } from "../../../../api/useAuth";

import ModuleLayout from "../../../../components/layout/ModuleLayout";
import Sidebar from "../../../../components/layout/Sidebar";
import Header from "../../../../components/layout/Header";
import DataTable from "../../../../components/shared/DataTable";
import SearchBar from "../../../../components/shared/searchBar";
import ActionButtons from "../../../../components/shared/ActionButtons";
import Toast from "../components/Toast";
import EstadoBadge from "../components/EstadoBadge";
import InventarioPagination from "../components/InventarioPagination";

import AgregarInstrumentoModal from "../components/modals/AgregarInstrumentoModal";
import EditarInstrumentoModal from "../components/modals/EditarInstrumentoModal";
import EliminarInstrumentoModal from "../components/modals/EliminarInstrumentoModal";
import ErrorEliminarModal from "../components/modals/ErrorEliminarModal";
import AdvertenciaModal from "../components/modals/AdvertenciaModal";

const InventarioPage = () => {
  const inventario = useInventario();
  const { user, loading: authLoading } = useAuth();

  if (authLoading || inventario.loading) return <div className="inventario-loading">Cargando...</div>;

  const menuBanda = [
    { label: "Inicio", path: "/banda" },
    { label: "Inventario Banda", path: "/banda/inventario" },
    { label: "Asignaciones", path: "/banda/prestamos" },
  ];

  const columnas = [
    { key: "id_instrumento", label: "Código" },
    { key: "nombre", label: "Instrumento" },
    { key: "categoria_nombre", label: "Tipo de Instrumento" },
    { key: "estado", label: "Estado", render: (val, row) => <EstadoBadge estado={val} disponible={row.cantidad_disponible > 0} /> },
    { key: "cantidad_disponible", label: "Cantidad Disponible" },
  ];

  const camposBusqueda = [
    { key: "id_instrumento", label: "Código", type: "text" },
    { key: "nombre", label: "Instrumento", type: "text" },
    { 
      key: "id_categoria", 
      label: "Tipo de Instrumento", 
      type: "select", 
      options: inventario.categorias?.map(c => c.nombre) || [] 
    }
  ];

  return (
    <div className='banda-module-container banda-custom-sidebar view-inventario'>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIGDE SCHOOL" />
      
      <div className="inventario-page">
        <Toast message={inventario.toast} />

        <ModuleLayout
          sidebar={<Sidebar moduloActual="Inventario Banda" menuItems={menuBanda} user={user} />}
        >
          {/* 1. SECCIÓN SUPERIOR: FILTROS (Ancho total) */}
          <div className="banda-filters-fullwidth">
            <SearchBar 
              fields={camposBusqueda} 
              onSearch={(filtros) => {
                inventario.setFiltroId(filtros.id_instrumento);
                inventario.setFiltroNombre(filtros.nombre);
                inventario.setFiltroCategoria(filtros.id_categoria);
                inventario.handleBuscar();
              }} 
            />
          </div>

          {/* 2. SECCIÓN INFERIOR: TABLA (Izquierda) + BOTONES (Derecha) */}
          <div className="banda-main-grid">
            <div className="banda-table-container">
              <div className="inventario-table-card">
                <DataTable 
                  columns={columnas} 
                  rows={inventario.paginados} 
                  onRowClick={inventario.setSeleccionado} 
                  emptyText="No hay instrumentos registrados" 
                />
              </div>
              <InventarioPagination paginaActual={inventario.pagina} totalPaginas={inventario.totalPaginas} setPagina={inventario.setPagina} />
            </div>

            <div className="banda-sidebar-actions">
              <ActionButtons
                filaSeleccionada={inventario.seleccionado}
                botones={[
                  { label: "Agregar Instrumento", onClick: inventario.abrirAgregar, siempreActivo: true, variante: "primary" },
                  { label: "Editar Instrumento", onClick: () => inventario.abrirEditar(inventario.seleccionado), variante: "secondary" },
                  { label: "Eliminar Instrumento", onClick: inventario.abrirEliminar, variante: "danger" },
                ]}
              />
            </div>
          </div>
        </ModuleLayout>

        {/* MODALES */}
        <AgregarInstrumentoModal open={inventario.modalAgregar} onClose={() => inventario.setModalAgregar(false)} onSave={inventario.handleAgregar} form={inventario.form} setForm={inventario.setForm} categorias={inventario.categorias} ubicaciones={inventario.ubicaciones} validaciones={inventario.validaciones} />
        <EditarInstrumentoModal open={inventario.modalEditar} onClose={() => inventario.setModalEditar(false)} onSave={inventario.handleEditar} form={inventario.form} setForm={inventario.setForm} categorias={inventario.categorias} ubicaciones={inventario.ubicaciones} validaciones={inventario.validaciones} />
        <EliminarInstrumentoModal open={inventario.modalEliminar} onClose={() => inventario.setModalEliminar(false)} onConfirm={inventario.handleEliminar} instrumento={inventario.seleccionado} />
        <ErrorEliminarModal open={inventario.modalErrorEliminar} onClose={() => inventario.setModalErrorEliminar(false)} />
        <AdvertenciaModal open={inventario.modalAdvertencia} onClose={() => inventario.setModalAdvertencia(false)} onConfirm={inventario.ejecutarEdicion} />
      </div>
    </div>
  );
};

export default InventarioPage;