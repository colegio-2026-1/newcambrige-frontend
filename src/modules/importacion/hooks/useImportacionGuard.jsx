import { useEffect } from "react";
import { cancelarScrapingRequest } from "../../../api/importacionService";

export function useImportacionGuard({ isExecuting, ejecucionId, tipo, onCancelCallback }) {
  const handleBeforeNavigate = async () => {
    if (isExecuting) {
       const confirmar = window.confirm("Hay un proceso en curso o datos sin guardar. Si cambias de vista, la ejecución se cancelará y los datos se descartarán. ¿Continuar?");
       if (!confirmar) return false;

       // Si confirma, intentamos truncar (solo si hay ID de ejecución)
       if (ejecucionId && tipo) {
           try {
               await cancelarScrapingRequest(ejecucionId, tipo);
           } catch (e) {
               console.error("Error al cancelar la ejecución en backend:", e);
           }
       }
       
       if (onCancelCallback) {
           onCancelCallback();
       }
       return true;
    }
    return true; 
  };

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (isExecuting) {
        e.preventDefault();
        e.returnValue = "Hay un proceso en curso o datos sin guardar. ¿Seguro que quieres salir?";
      }
    };

    const onUnload = () => {
       if (isExecuting && ejecucionId && tipo) {
           const token = localStorage.getItem("access_token");
           const url = `${import.meta.env.VITE_API_URL || ""}/api/importacion/scraping/cancelar/${ejecucionId}?tipo=${tipo}`;
           
           const headers = new Headers();
           if (token) {
               headers.append('Authorization', `Bearer ${token}`);
           }

           fetch(url, {
              method: 'DELETE',
              headers: headers,
              keepalive: true
           }).catch(() => {});
       }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("unload", onUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("unload", onUnload);
    };
  }, [isExecuting, ejecucionId, tipo]);

  return { handleBeforeNavigate };
}
