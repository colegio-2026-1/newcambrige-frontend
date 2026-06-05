import DataTable from "../../../components/shared/DataTable";

// Función utilitaria agregada para formatear los textos de forma segura
const capitalizar = (texto) =>
  texto
    ? texto.charAt(0).toUpperCase() +
      texto.slice(1).toLowerCase()
    : "—";

export default function InventoryTable({
  inventario = [],
  setSelectedRow
}) {

  const columns = [
    {
      key: "id_objeto",
      label: "Código"
    },
    {
      key: "nombre",
      label: "Nombre",
      // Cambiado por la renderización capitalizada
      render: (val) => capitalizar(val)
    },
    {
      key: "tipo",
      label: "Categoría",
      // Cambiado por la renderización capitalizada
      render: (val) => capitalizar(val)
    },
    {
      key: "cantidad_disponible",
      label: "Disponibilidad",
      render: (val) => {
        return Number(val) > 0
          ? "Activo"
          : "Inactivo";
      }
    },
    {
      key: "estado_fisico",
      label: "Estado físico",
      // Cambiado por la renderización capitalizada
      render: (val) => capitalizar(val)
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={inventario}
      onRowClick={setSelectedRow}
      pageSize={10}
      emptyText={
        "No se encontraron prendas con el criterio de búsqueda ingresado."
      }
    />
  );
}