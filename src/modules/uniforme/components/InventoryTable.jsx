import DataTable from "../../../components/shared/DataTable";

export default function InventoryTable({
  inventario = [],
  setSelectedRow
}) {

  const columns = [
    {
      key: "id_objeto",
      label: "CODIGO"
    },
    {
    key: "nombre",
    label: "NOMBRE"
    },
    {
      key: "tipo",
      label: "CATEGORIA",
      render: (val) => {
        return val || "—";
      }
    },
    {
      key: "cantidad_disponible",
      label: "DISPONIBILIDAD",

      render: (val) => {
        return Number(val) > 0
          ? "Activo"
          : "Inactivo";
      }
    },

    {
      key: "estado_fisico",
      label: "ESTADO FÍSICO",
      render: (val) => {
        
        return val || "—";
      }
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