import "./InventarioPage.css";
import useInventario from "../hooks/useInventario";
import useAuthStore from "../../../../stores/useAuthStore";

// Componentes de Layout del Equipo
import ModuleLayout from "../../../../components/layout/ModuleLayout";
import Sidebar from "../../../../components/layout/Sidebar";
import ActionButtons from "../../../../components/shared/ActionButtons";

// Componentes del Módulo
import Toast from "../components/Toast";
import InventarioFiltros from "../components/InventarioFiltros";
import InventarioTable from "../components/InventarioTable";
import InventarioPagination from "../components/InventarioPagination";
import InventarioStats from "../components/InventarioStats";

// Modales
import AgregarInstrumentoModal from "../components/modals/AgregarInstrumentoModal";
import EditarInstrumentoModal from "../components/modals/EditarInstrumentoModal";
import EliminarInstrumentoModal from "../components/modals/EliminarInstrumentoModal";
import ErrorEliminarModal from "../components/modals/ErrorEliminarModal";
import AdvertenciaModal from "../components/modals/AdvertenciaModal";

const InventarioPage = () => {
  const inventario = useInventario();
  const { user } = useAuthStore(); // <--- Obtener el usuario real logueado

  if (inventario.loading) return <div className="inventario-loading">Cargando...</div>;

  return (
    <div className="inventario-page">
      <Toast message={inventario.toast} />

      <ModuleLayout
        sidebar={
          <Sidebar
            moduloActual="Inventario Banda"
            modulos={[
              { label: "Inicio", path: "/home" },
              { label: "Préstamos", path: "/banda/prestamos" },
              { label: "Inventario", path: "/banda/inventario" },
            ]}
            usuario={{ nombre: "Titular Banda", rol: "Titular" }}
          />
        }
        actions={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ActionButtons
              filaSeleccionada={inventario.seleccionado}
              botones={[
                { 
                  label: "Agregar Item", 
                  onClick: inventario.abrirAgregar, 
                  siempreActivo: true, 
                  variante: "primary" 
                },
                { 
                  label: "Editar Item", 
                  onClick: () => inventario.abrirEditar(inventario.seleccionado), 
                  variante: "secondary" 
                },
                { 
                  label: "Eliminar Item", 
                  onClick: () => inventario.abrirEliminar(inventario.seleccionado), 
                  variante: "danger" 
                },
              ]}
            />
            <InventarioStats instrumentos={inventario.instrumentos} />
          </div>
        }
      >
        {/* CONTENIDO PRINCIPAL */}
        <InventarioFiltros
          filtroNombre={inventario.filtroNombre}
          setFiltroNombre={inventario.setFiltroNombre}
          filtroCategoria={inventario.filtroCategoria}
          setFiltroCategoria={inventario.setFiltroCategoria}
          categorias={inventario.categorias}
          handleBuscar={inventario.handleBuscar}
          handleLimpiar={inventario.handleLimpiar}
        />

        <div className="inventario-table-card">
          <InventarioTable
            paginados={inventario.paginados}
            onRowClick={inventario.setSeleccionado} // Para que ActionButtons sepa qué fila hay
            seleccionado={inventario.seleccionado}
          />
        </div>

        <InventarioPagination
          paginaActual={inventario.pagina}
          totalPaginas={inventario.totalPaginas}
          setPagina={inventario.setPagina}
        />
      </ModuleLayout>

      {/* MODALES CON VALIDACIONES PASADAS */}
      <AgregarInstrumentoModal
        open={inventario.modalAgregar}
        onClose={() => inventario.setModalAgregar(false)}
        onSave={inventario.handleAgregar}
        form={inventario.form}
        setForm={inventario.setForm}
        errores={inventario.errores}
        categorias={inventario.categorias}
        ubicaciones={inventario.ubicaciones}
        validaciones={inventario.validaciones} // <--- IMPORTANTE
      />

      <EditarInstrumentoModal
        open={inventario.modalEditar}
        onClose={() => inventario.setModalEditar(false)}
        onSave={inventario.handleEditar}
        form={inventario.form}
        setForm={inventario.setForm}
        errores={inventario.errores}
        categorias={inventario.categorias}
        ubicaciones={inventario.ubicaciones}
        validaciones={inventario.validaciones} // <--- IMPORTANTE
      />

      <EliminarInstrumentoModal
        open={inventario.modalEliminar}
        onClose={() => inventario.setModalEliminar(false)}
        onConfirm={inventario.handleEliminar}
        instrumento={inventario.seleccionado}
      />

      <ErrorEliminarModal
        open={inventario.modalErrorEliminar}
        onClose={() => inventario.setModalErrorEliminar(false)}
      />

      <AdvertenciaModal
        open={inventario.modalAdvertencia}
        onClose={() => inventario.setModalAdvertencia(false)}
        onConfirm={inventario.ejecutarEdicion}
      />
    </div>
  );
};

export default InventarioPage;