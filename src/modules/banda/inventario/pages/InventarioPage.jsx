import "./InventarioPage.css";

import useInventario from "../hooks/useInventario";

import Toast from "../components/Toast";
import InventarioFiltros from "../components/InventarioFiltros";
import InventarioTable from "../components/InventarioTable";
import InventarioPagination from "../components/InventarioPagination";
import InventarioStats from "../components/InventarioStats";

import AgregarInstrumentoModal from "../components/modals/AgregarInstrumentoModal";
import EditarInstrumentoModal from "../components/modals/EditarInstrumentoModal";
import EliminarInstrumentoModal from "../components/modals/EliminarInstrumentoModal";
import ErrorEliminarModal from "../components/modals/ErrorEliminarModal";
import AdvertenciaModal from "../components/modals/AdvertenciaModal";

const InventarioPage = () => {

  const inventario = useInventario();

  // =====================================================
  // LOADING
  // =====================================================

  if (inventario.loading) {

    return (

      <div className="inventario-loading">
        Cargando inventario...
      </div>

    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="inventario-page">

      {/* TOAST GLOBAL */}

      <Toast message={inventario.toast} />

      <div className="inventario-grid">

        {/* ====================================== */}
        {/* CONTENIDO CENTRAL */}
        {/* ====================================== */}

        <section className="inventario-main">

          {/* 
            FUTURO:
            Aqui conviviran:
            - Inventario instrumentos
            - Estudiantes banda
          */}

          <InventarioFiltros
            filtroNombre={inventario.filtroNombre}
            setFiltroNombre={
              inventario.setFiltroNombre
            }
            filtroCategoria={
              inventario.filtroCategoria
            }
            setFiltroCategoria={
              inventario.setFiltroCategoria
            }
            categorias={inventario.categorias}
            handleBuscar={
              inventario.handleBuscar
            }
            handleLimpiar={
              inventario.handleLimpiar
            }
            abrirAgregar={
              inventario.abrirAgregar
            }
          />

          {/* TABLA */}

          <div className="inventario-table-card">

            <InventarioTable
              paginados={inventario.paginados}
              abrirEditar={
                inventario.abrirEditar
              }
              abrirEliminar={
                inventario.abrirEliminar
              }
            />

          </div>

          {/* PAGINACION */}

          <InventarioPagination
            paginaActual={inventario.pagina}
            totalPaginas={
              inventario.totalPaginas
            }
            setPagina={inventario.setPagina}
          />

        </section>

        {/* ====================================== */}
        {/* PANEL DERECHO */}
        {/* ====================================== */}

        <aside className="inventario-sidebar">

          <div className="inventario-sidebar-card">

            <h3 className="sidebar-title">
              Panel Banda
            </h3>

            {/* 
              FUTURO:
              Los botones laterales navegaran a:
              - estudiantes banda
              - devoluciones
              - inventario
            */}

            <InventarioStats
              instrumentos={
                inventario.instrumentos
              }
            />

          </div>

        </aside>

      </div>

      {/* ====================================== */}
      {/* MODALES */}
      {/* ====================================== */}

      {/* AGREGAR */}

      <AgregarInstrumentoModal
        open={inventario.modalAgregar}
        onClose={() =>
          inventario.setModalAgregar(false)
        }
        onSave={inventario.handleAgregar}
        form={inventario.form}
        setForm={inventario.setForm}
        errores={inventario.errores}
        categorias={inventario.categorias}
        ubicaciones={inventario.ubicaciones}
      />

      {/* EDITAR */}

      <EditarInstrumentoModal
        open={inventario.modalEditar}
        onClose={() =>
          inventario.setModalEditar(false)
        }
        onSave={inventario.handleEditar}
        form={inventario.form}
        setForm={inventario.setForm}
        errores={inventario.errores}
        categorias={inventario.categorias}
        ubicaciones={inventario.ubicaciones}
      />

      {/* ELIMINAR */}

      <EliminarInstrumentoModal
        open={inventario.modalEliminar}
        onClose={() =>
          inventario.setModalEliminar(false)
        }
        onConfirm={
          inventario.handleEliminar
        }
        instrumento={
          inventario.seleccionado
        }
      />

      {/* ERROR ELIMINAR */}

      <ErrorEliminarModal
        open={
          inventario.modalErrorEliminar
        }
        onClose={() =>
          inventario.setModalErrorEliminar(
            false
          )
        }
      />

      {/* ADVERTENCIA */}

      <AdvertenciaModal
        open={
          inventario.modalAdvertencia
        }
        onClose={() =>
          inventario.setModalAdvertencia(
            false
          )
        }
        onConfirm={
          inventario.ejecutarEdicion
        }
      />

    </div>

  );
};

export default InventarioPage;
