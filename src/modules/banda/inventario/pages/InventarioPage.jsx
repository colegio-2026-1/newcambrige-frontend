import useInventario from "../hooks/useInventario";

import Toast from "../components/Toast";

import InventarioFiltros from "../components/InventarioFiltros";

import InventarioTable from "../components/InventarioTable";

import AgregarInstrumentoModal from "../components/modals/AgregarInstrumentoModal";

import EditarInstrumentoModal from "../components/modals/EditarInstrumentoModal";

import EliminarInstrumentoModal from "../components/modals/EliminarInstrumentoModal";

import ErrorEliminarModal from "../components/modals/ErrorEliminarModal";

import AdvertenciaModal from "../components/modals/AdvertenciaModal";

import InventarioPagination from "../components/InventarioPagination";

import InventarioStats from "../components/InventarioStats";

const InventarioPage = () => {

  const inventario =
    useInventario();

  if (inventario.loading) {

    return (
      <p
        style={{
          padding: "20px",
        }}
      >
        Cargando inventario...
      </p>
    );
  }

  return (

    <div
      style={{
        position: "relative",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >

      <Toast
        message={inventario.toast}
      />

      {/* ================================================= */}
      {/* COLUMNA IZQUIERDA */}
      {/* ================================================= */}

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >

        <InventarioFiltros

          filtroNombre={
            inventario.filtroNombre
          }

          setFiltroNombre={
            inventario.setFiltroNombre
          }

          filtroCategoria={
            inventario.filtroCategoria
          }

          setFiltroCategoria={
            inventario.setFiltroCategoria
          }

          categorias={
            inventario.categorias
          }

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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >

          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              color: "#333333",
              fontWeight: "700",
            }}
          >
            Inventario Banda
          </h2>

          <p
            style={{
              fontSize: "13px",
              color: "#666",
              margin: 0,
            }}
          >

            <strong>
              {inventario.filtrados.length}
            </strong>

            {" "}instrumento
            {inventario.filtrados.length !== 1
              ? "s"
              : ""
            }

          </p>

        </div>

        {/* TABLA */}

        <div
          style={{
            backgroundColor: "#E9E9E7",
            borderRadius: "18px",
            padding: "18px",
            border: "1px solid #D6D3D1",
            overflowX: "auto",
            minHeight: "520px",
          }}
        >

          <InventarioTable

            paginados={
              inventario.paginados
            }

            abrirEditar={
              inventario.abrirEditar
            }

            abrirEliminar={
              inventario.abrirEliminar
            }

          />

        </div>

        <InventarioPagination

          paginaActual={
            inventario.paginaActual
          }

          totalPaginas={
            inventario.totalPaginas
          }

          setPagina={
            inventario.setPagina
          }

        />

      </div>

      {/* ================================================= */}
      {/* SIDEBAR DERECHA */}
      {/* ================================================= */}

      <div
        style={{
          width: "320px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >

        {/* ESTADISTICAS */}

        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            padding: "20px",
            boxShadow:
              "0 4px 14px rgba(0,0,0,0.08)",
            border:
              "1px solid #ECECEC",
          }}
        >

          <h3
            style={{
              marginTop: 0,
              marginBottom: "18px",
              color: "#333333",
              fontSize: "18px",
            }}
          >
            Estadísticas rápidas
          </h3>

          <InventarioStats
            instrumentos={
              inventario.instrumentos
            }
          />

          {/* GRAFICO VISUAL */}

          <div
            style={{
              marginTop: "20px",
            }}
          >

            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#555",
                marginBottom: "10px",
              }}
            >
              Estado general
            </p>

            <div
              style={{
                display: "flex",
                height: "14px",
                borderRadius: "999px",
                overflow: "hidden",
                backgroundColor: "#E5E7EB",
              }}
            >

              <div
                style={{
                  width: "65%",
                  backgroundColor: "#15803D",
                }}
              />

              <div
                style={{
                  width: "20%",
                  backgroundColor: "#CA8A04",
                }}
              />

              <div
                style={{
                  width: "15%",
                  backgroundColor: "#6B7280",
                }}
              />

            </div>

            <div
              style={{
                marginTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "12px",
                color: "#555",
              }}
            >

              <span>
                🟢 Disponibles
              </span>

              <span>
                🟡 Mantenimiento
              </span>

              <span>
                ⚫ Inactivos
              </span>

            </div>

          </div>

        </div>

        {/* ACCIONES */}

        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            padding: "20px",
            boxShadow:
              "0 4px 14px rgba(0,0,0,0.08)",
            border:
              "1px solid #ECECEC",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >

          <h3
            style={{
              margin: 0,
              color: "#333333",
              fontSize: "18px",
            }}
          >
            Acciones rápidas
          </h3>

          <button
            style={{
              backgroundColor: "#DCD4BE",
              color: "#333333",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Asignar Instrumento
          </button>

          <button
            style={{
              backgroundColor: "#2E5FA7",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Devolver Instrumento
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* MODALES */}
      {/* ================================================= */}

      <AgregarInstrumentoModal

        open={
          inventario.modalAgregar
        }

        onClose={() =>
          inventario.setModalAgregar(false)
        }

        onSave={
          inventario.handleAgregar
        }

        form={inventario.form}

        setForm={
          inventario.setForm
        }

        errores={
          inventario.errores
        }

        categorias={
          inventario.categorias
        }

        ubicaciones={
          inventario.ubicaciones
        }

      />

      <EditarInstrumentoModal

        open={
          inventario.modalEditar
        }

        onClose={() =>
          inventario.setModalEditar(false)
        }

        onSave={
          inventario.handleEditar
        }

        form={inventario.form}

        setForm={
          inventario.setForm
        }

        errores={
          inventario.errores
        }

        categorias={
          inventario.categorias
        }

        ubicaciones={
          inventario.ubicaciones
        }

      />

      <EliminarInstrumentoModal

        open={
          inventario.modalEliminar
        }

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

      <ErrorEliminarModal

        open={
          inventario.modalErrorEliminar
        }

        onClose={() =>
          inventario.setModalErrorEliminar(false)
        }

      />

      <AdvertenciaModal

        open={
          inventario.modalAdvertencia
        }

        onClose={() =>
          inventario.setModalAdvertencia(false)
        }

        onConfirm={
          inventario.ejecutarEdicion
        }

      />

    </div>
  );
};

export default InventarioPage;