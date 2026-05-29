import usePrestamos
from "../hooks/usePrestamos";

import PrestamosHeader
from "../components/PrestamosHeader";

import PrestamosTable
from "../components/PrestamosTable";

import PrestamosActivosTable
from "../components/PrestamosActivosTable";

import PrestamosSidebar
from "../components/PrestamosSidebar";

import AgregarPrestamoModal
from "../components/modals/AgregarPrestamoModal";

const PrestamosPage = () => {

  const prestamos =
    usePrestamos();

  if (prestamos.loading) {

    return (
      <div>
        Cargando préstamos...
      </div>
    );
  }

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "1fr 320px",
        gap: "24px",
      }}
    >

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >

        <PrestamosHeader
          filtroNombre={
            prestamos.filtroNombre
          }
          setFiltroNombre={
            prestamos.setFiltroNombre
          }
        />

        <PrestamosTable
          estudiantes={
            prestamos.estudiantesFiltrados
          }
          setForm={
            prestamos.setForm
          }
          form={prestamos.form}
          setModalAgregar={
            prestamos.setModalAgregar
          }
        />

        <PrestamosActivosTable
          prestamos={
            prestamos.prestamos
          }
          devolverInstrumento={
            prestamos.devolverInstrumento
          }
        />

      </section>

      <PrestamosSidebar
        estudiantes={
          prestamos.estudiantes
        }
        instrumentos={
          prestamos.instrumentos
        }
        estadisticas={
          prestamos.estadisticas
        }
      />

      {
        prestamos.modalAgregar && (

          <AgregarPrestamoModal
            form={prestamos.form}
            setForm={
              prestamos.setForm
            }
            instrumentos={
              prestamos.instrumentos
            }
            setModalAgregar={
              prestamos.setModalAgregar
            }
            handleAgregar={
              prestamos.handleAgregar
            }
          />
        )
      }

    </div>
  );
};

export default PrestamosPage;