import React, { useMemo } from 'react';
import "./InventarioPage.css";
import useInventario from "../hooks/useInventario";
import { useAuth } from "../../../../api/useAuth";

import Icon from '@mdi/react';
import { mdiHome, mdiAccountMusic, mdiPiano } from '@mdi/js';
import { Home, LayoutList, ClipboardCheck } from "lucide-react";

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
  const { user, roles } = useAuth();

  const primerRol = roles?.[0];
  const rolTexto = typeof primerRol === 'object' ? primerRol.nombre : (primerRol || "Banda");

  if (inventario.loading) return <div className="inventario-loading">Cargando...</div>;

  const menuBanda = [
    { label: "Inicio", path: "/banda", icon: <Home size={18} /> },
    { label: "Inventario", path: "/banda/inventario", icon: <LayoutList size={18} /> },
    { label: "Asignaciones", path: "/banda/prestamos", icon: <ClipboardCheck size={18} /> }
  ];


  const columnas = [
    { key: "id_instrumento", label: "Código" },
    { key: "nombre", label: "Instrumento" },
    { key: "categoria_nombre", label: "Tipo de Instrumento" },
    { key: "estado", label: "Estado", render: (val, row) => <EstadoBadge estado={val} disponible={row.cantidad_disponible > 0} /> },
    { key: "cantidad_disponible", label: "Cantidad Disponible" },
  ];


  return (
    <div className='banda-module-container view-inventario'>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIGDE SCHOOL" />
      
      <ModuleLayout
        sidebar={<Sidebar selectedMenu="Inventario" menuItems={menuBanda} user={{nombre: user?.nombre, rol: rolTexto}} logout={() => {}} />}
        actions={
          <ActionButtons
            filaSeleccionada={inventario.seleccionado}
            botones={[
              { label: "Agregar Instrumento", onClick: inventario.abrirAgregar, siempreActivo: true, variante: "primary" },
              { label: "Editar Instrumento", onClick: () => inventario.abrirEditar(inventario.seleccionado), variante: "secondary" },
              { label: "Eliminar Instrumento", onClick: inventario.abrirEliminar, variante: "danger" },
            ]}
          />
        }
      >
        <div className="banda-content-wrapper" style={{ width: '100%' }}>
          <Toast message={inventario.toast} />
           <div className="banda-filters-fullwidth"></div>
          <SearchBar 
            fields={[
              { key: "id_instrumento", label: "Código", type: "text" },
              { key: "nombre", label: "Instrumento", type: "text" },
              { key: "id_categoria", label: "Tipo", type: "select", options: inventario.categorias?.map(c => c.nombre) || [] }
            ]} 
            onSearch={(f) => {
              inventario.setFiltroId(f.id_instrumento);
              inventario.setFiltroNombre(f.nombre);
              inventario.setFiltroCategoria(f.id_categoria);
              inventario.handleBuscar();
            }} 
          />
          <div className="inventario-table-card">
            <DataTable columns={columnas} rows={inventario.paginados} onRowClick={inventario.setSeleccionado} emptyText="No hay instrumentos registrados" />
          </div>
          {/*PAGINACIÓN AGREGADA DEBAJO DE LA TABLA */}
          <InventarioPagination 
            paginaActual={inventario.pagina} 
            totalPaginas={inventario.totalPaginas} 
            setPagina={inventario.setPagina} 
          />
        </div>
      </ModuleLayout>

      {/* MODALES */}
      <AgregarInstrumentoModal open={inventario.modalAgregar} onClose={() => inventario.setModalAgregar(false)} onSave={inventario.handleAgregar} form={inventario.form} setForm={inventario.setForm} categorias={inventario.categorias} ubicaciones={inventario.ubicaciones} />
      <EditarInstrumentoModal open={inventario.modalEditar} onClose={() => inventario.setModalEditar(false)} onSave={inventario.handleEditar} form={inventario.form} setForm={inventario.setForm} categorias={inventario.categorias} ubicaciones={inventario.ubicaciones} />
      <EliminarInstrumentoModal open={inventario.modalEliminar} onClose={() => inventario.setModalEliminar(false)} onConfirm={inventario.handleEliminar} instrumento={inventario.seleccionado} />
      <ErrorEliminarModal open={inventario.modalErrorEliminar} onClose={() => inventario.setModalErrorEliminar(false)} />
      <AdvertenciaModal open={inventario.modalAdvertencia} onClose={() => inventario.setModalAdvertencia(false)} onConfirm={inventario.ejecutarEdicion} />
    </div>
  );
};

export default InventarioPage;