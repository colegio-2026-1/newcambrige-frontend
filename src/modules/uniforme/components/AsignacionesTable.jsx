import DataTable from "../../../components/shared/DataTable";

// Paso 1. Crear la función utilitaria para capitalizar textos de forma segura
const capitalizar = (texto) =>
  texto
    ? texto.charAt(0).toUpperCase() +
      texto.slice(1).toLowerCase()
    : "—";

// Se extrae la configuración fuera del componente para que se cree UNA sola vez en memoria
const COLUMNS = [
  {
    key: "codigo",
    label: "Código"
  },
  {
    key: "nombre_completo",
    label: "Nombre completo"
  },
  {
    key: "grado",
    label: "Grado"
  },
  {
    key: "grupo",
    label: "Grupo"
  },
  {
    key: "prenda",
    label: "Prenda",
    // Paso 2. Aplicar capitalizar a la columna PRENDA
    render: (val) => capitalizar(val)
  },
  {
    key: "fecha_entrega",
    label: "Fecha Entrega",
    render: (_, row) =>
      row.fecha_entrega
        ? new Date(row.fecha_entrega)
            .toLocaleDateString("es-CO")
        : "—"
  },
  {
    key: "estado",
    label: "Estado",
    render: (val) => {
      const estado = val?.toLowerCase();
      let clase = "badge--default";

      if (estado === "prestado") {
        clase = "badge--warn";
      } else if (estado === "bueno") {
        clase = "badge--good";
      } else if (estado === "regular") {
        clase = "badge--regular";
      } else if (estado === "malo") {
        clase = "badge--bad";
      } else if (estado === "sin asignar") {
        clase = "badge--no";
      }

      return (
        // Paso 3. Aplicar capitalizar dentro del span del ESTADO
        <span className={clase}>
          {capitalizar(val)}
        </span>
      );
    }
  }
];

export default function AsignacionesTable({ asignaciones = [], loading = false, setSelectedRow }) {
  return (
    <DataTable
      columns={COLUMNS}
      rows={asignaciones}
      onRowClick={setSelectedRow}
      pageSize={10}
      emptyText={
        loading
          ? "Cargando asignaciones..."
          : "No hay asignaciones registradas"
      }
    />
  );
}