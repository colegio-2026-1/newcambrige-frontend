import React, { useMemo } from 'react';
import "./InventarioPage.css";
import useInventario from "../hooks/useInventario";
import { useAuth } from "../../../../api/useAuth";

import Icon from '../../../../components/common/Icon';
import { mdiHome, mdiAccountMusic, mdiPiano } from '@mdi/js';
import { Home, LayoutList, ClipboardCheck } from "lucide-react";

import ModuleLayout from "../../../../components/layout/ModuleLayout";
import Sidebar from "../../../../components/layout/Sidebar";
import Header from "../../../../components/layout/header";
import DataTable from "../../../../components/shared/DataTable";
import SearchBar from "../../../../components/shared/searchBar";
import ActionButtons from "../../../../components/shared/ActionButtons";
import Alert from "../../../../components/shared/Alert";
import EstadoBadge from "../components/EstadoBadge";

import AgregarInstrumentoModal from "../components/modals/AgregarInstrumentoModal";
import EditarInstrumentoModal from "../components/modals/EditarInstrumentoModal";


const InventarioPage = () => {
  const inventario = useInventario();
  const { user, roles } = useAuth();

  const primerRol = roles?.[0];
  const rolTexto = typeof primerRol === 'object' ? primerRol.nombre : (primerRol || "Banda");

  if (inventario.loading) return <div className="inventario-loading">Cargando...</div>;

  const menuBanda = [
    { label: "Inicio", path: "/banda", icon: <Home size={18} /> },
    { label: "Inventario", path: "/banda/inventario", icon: <Icon icon={mdiPiano} size={18} /> },
    { label: "Asignaciones", path: "/banda/prestamos", icon: <Icon icon={mdiAccountMusic} size={18} /> }
  ];


  const columnas = [
    { key: "id_instrumento", label: "Código",
      render: (val) => <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>{val}</span>
     },
    { key: "nombre", label: "Instrumento" },
    { key: "categoria_nombre", label: "Tipo de Instrumento" },
    { key: "estado", label: "Estado", render: (val, row) => <EstadoBadge estado={val} disponible={row.cantidad_disponible > 0} /> },
    //{ key: "cantidad_total", label: "Cantidad Total" },
    { key: "cantidad_disponible", label: "Cantidad Disponible" },
  ];


  return (
    <div className='banda-module-container view-inventario'>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIGDE SCHOOL" />

      <ModuleLayout
        sidebar={<Sidebar selectedMenu="Inventario" menuItems={menuBanda} user={{ nombre: user?.nombre, rol: rolTexto }} logout={() => { }} />}
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
          <Alert
          {...inventario.alert} 
            onClose={inventario.alert.onClose} 
            onCancel={inventario.alert.onCancel} 
          />
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
            <DataTable 
              columns={columnas} 
              rows={inventario.filtrados} 
              pageSize={10} 
              onRowClick={inventario.setSeleccionado} 
              emptyText="No hay instrumentos registrados" 
              />
              </div>      
        </div>
      </ModuleLayout>

      {/* MODALES */}
      <AgregarInstrumentoModal open={inventario.modalAgregar} onClose={() => inventario.setModalAgregar(false)} onSave={inventario.handleAgregar} form={inventario.form} setForm={inventario.setForm} categorias={inventario.categorias} />
      <EditarInstrumentoModal open={inventario.modalEditar} onClose={() => inventario.setModalEditar(false)} onSave={inventario.handleEditar} form={inventario.form} setForm={inventario.setForm} categorias={inventario.categorias} />
    </div>
  );
};

export default InventarioPage;