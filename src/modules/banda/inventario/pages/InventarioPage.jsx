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
import InventarioStats from "../components/InventarioStats";
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

  if (user?.roles?.includes("admin") || user?.rol === "admin") {
    menuBanda.push({ label: "Auditoría", path: "/banda/auditoria" });
  }

  // ✅ COLUMNAS EXACTAS SEGÚN REQUERIMIENTO BR366
  const columnas = [
    { key: "codigo", label: "CÓDIGO" },
    { key: "nombre", label: "NOMBRE" },
    { key: "categoria_nombre", label: "CATEGORÍA" },
    { key: "ubicacion_nombre", label: "UBICACIÓN" },
    { 
      key: "cantidad_disponible", 
      label: "STOCK (T/D)",
      render: (val, row) => (
        <span>
          {row.cantidad_total} / <b style={{ color: val > 0 ? "var(--color-success)" : "var(--color-danger)" }}>{val}</b>
        </span>
      )
    },
    { key: "estado", label: "ESTADO", render: (val, row) => <EstadoBadge estado={val} disponible={row.cantidad_disponible > 0} /> },
  ];

  // ✅ FILTROS EXACTOS SEGÚN REQUERIMIENTO BR267
  const camposBusqueda = [
    { key: "codigo", label: "Código", type: "text" },
    { key: "nombre", label: "Nombre del Instrumento", type: "text" },
    { 
      key: "id_categoria", 
      label: "Categoría", 
      type: "select", 
      options: inventario.categorias?.map(c => c.nombre) || [] 
    }
  ];

  return (
    <div className='banda-module-container banda-custom-sidebar'>
      <Header title="INVENTARIO DE INSTRUMENTOS - BANDA" />
      
      <div className="inventario-page">
        <Toast message={inventario.toast} />

        <ModuleLayout
          sidebar={<Sidebar moduloActual="Inventario Banda" menuItems={menuBanda} user={user} />}
        >
          <SearchBar 
            fields={camposBusqueda} 
            onSearch={(filtros) => {
              inventario.setFiltroNombre(filtros.nombre);
              inventario.setFiltroCategoria(filtros.id_categoria);
              inventario.handleBuscar();
            }} 
          />

          <div className="banda-split-container">
            <div className="banda-table-section">
              <div className="inventario-table-card">
                <DataTable columns={columnas} rows={inventario.paginados} onRowClick={inventario.setSeleccionado} emptyText="No hay instrumentos registrados" />
              </div>
              <InventarioPagination paginaActual={inventario.pagina} totalPaginas={inventario.totalPaginas} setPagina={inventario.setPagina} />
            </div>

            <div className="banda-actions-section">
              <ActionButtons
                filaSeleccionada={inventario.seleccionado}
                botones={[
                  { label: "Agregar instrumento", onClick: inventario.abrirAgregar, siempreActivo: true, variante: "primary" },
                  { label: "Editar instrumento", onClick: () => inventario.abrirEditar(inventario.seleccionado), variante: "secondary" },
                  { label: "Eliminar instrumento", onClick: inventario.abrirEliminar, variante: "danger" },
                ]}
              />
              <InventarioStats instrumentos={inventario.instrumentos} />
            </div>
          </div>
        </ModuleLayout>

        {/* MODALES */}
        <AgregarInstrumentoModal open={inventario.modalAgregar} onClose={() => inventario.setModalAgregar(false)} onSave={inventario.handleAgregar} form={inventario.form} setForm={inventario.setForm} errores={inventario.errores} categorias={inventario.categorias} ubicaciones={inventario.ubicaciones} validaciones={inventario.validaciones} />
        <EditarInstrumentoModal open={inventario.modalEditar} onClose={() => inventario.setModalEditar(false)} onSave={inventario.handleEditar} form={inventario.form} setForm={inventario.setForm} errores={inventario.errores} categorias={inventario.categorias} ubicaciones={inventario.ubicaciones} validaciones={inventario.validaciones} />
        <EliminarInstrumentoModal open={inventario.modalEliminar} onClose={() => inventario.setModalEliminar(false)} onConfirm={inventario.handleEliminar} instrumento={inventario.seleccionado} />
        <ErrorEliminarModal open={inventario.modalErrorEliminar} onClose={() => inventario.setModalErrorEliminar(false)} />
        <AdvertenciaModal open={inventario.modalAdvertencia} onClose={() => inventario.setModalAdvertencia(false)} onConfirm={inventario.ejecutarEdicion} />
      </div>
    </div>
  );
};

export default InventarioPage;