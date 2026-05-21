import { useEffect } from "react";
import "./ModuleLayout.css";
import { checkSessionRequest } from "../../api/authService";

/**
 * ModuleLayout — layout base reutilizable para todos los módulos
 *
 * Props:
 *  sidebar  {JSX} — componente Sidebar ya configurado
 *  actions  {JSX} — componente ActionButtons ya configurado
 *  children {JSX} — contenido del módulo (SearchBar + DataTable)
 *
 * Ejemplo de uso completo — BibliotecaPage:
 *
 *  export default function BibliotecaPage() {
 *    const [fila, setFila]         = useState(null);
 *    const [modal, setModal]       = useState(false);
 *    const [resultados, setResultados] = useState([]);
 *
 *    return (
 *      <div>
 *        <Header title="INVENTARIO DE LIBROS" />
 *        <ModuleLayout
 *          sidebar={
 *            <Sidebar
 *              moduloActual="Inventario Libros"
 *              modulos={[
 *                { label: "Uniformes",    path: "/uniformes" },
 *                { label: "Instrumentos", path: "/instrumentos" },
 *              ]}
 *              usuario={{ nombre: "Juan Pérez", rol: "Titular" }}
 *              userIcon={userIcon}
 *              onLogout={handleLogout}
 *            />
 *          }
 *          actions={
 *            <ActionButtons
 *              filaSeleccionada={fila}
 *              botones={[
 *                { label: "Agregar Libro",  onClick: () => setModal(true), siempreActivo: true, variante: "primary" },
 *                { label: "Editar Libro",   onClick: (f) => editarLibro(f),                    variante: "secondary" },
 *                { label: "Eliminar Libro", onClick: (f) => eliminarLibro(f),                  variante: "danger" },
 *              ]}
 *            />
 *          }
 *        >
 *          <SearchBar fields={[...]} onSearch={buscar} />
 *          <DataTable columns={[...]} rows={resultados} onRowClick={setFila} />
 *        </ModuleLayout>
 *      </div>
 *    );
 *  }
 */

export default function ModuleLayout({ sidebar, actions, children }) {

  // VALIDACIÓN DE SESIÓN (aqui se cambia el tiempo de cada cuanto se manda el checkeo)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await checkSessionRequest();
      } catch (error) {
        console.log("Sesión expirada");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="module-layout">
      {/* SIDEBAR IZQUIERDO */}
      <div className="module-sidebar">{sidebar}</div>

      {/* CONTENIDO CENTRAL */}
      <div className="module-content">{children}</div>

      {/* BOTONES DERECHA */}

      <div className="module-actions">{actions}</div>

    </div>
  );
}