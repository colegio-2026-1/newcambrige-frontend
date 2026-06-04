import DataTable from "../../../components/shared/DataTable";

// Se extrae la configuración fuera del componente para que se cree UNA sola vez en memoria
const COLUMNS = [
  {
    key: "codigo",
    label: "CÓDIGO"
  },
  {
    key: "nombre_completo",
    label: "NOMBRE COMPLETO"
  },
  {
    key: "grado",
    label: "GRADO"
  },
  {
    key: "grupo",
    label: "GRUPO"
  },
  {
    key: "prenda",
    label: "PRENDA"
  },
  {
    key: "fecha_entrega",
    label: "FECHA ENTREGA"
  },
  {
    key: "estado",
    label: "ESTADO",
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
        <span className={clase}>
          {val || "—"}
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