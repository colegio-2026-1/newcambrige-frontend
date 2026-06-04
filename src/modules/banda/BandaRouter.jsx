import React from "react";
import { Routes, Route } from "react-router-dom";

// Importamos solo las páginas de Banda
import BandaHomePage from "./BandaHomePage";
import InventarioPage from "./inventario/pages/InventarioPage";
import PrestamosPage from "./prestamos/pages/PrestamosPage";
import AuditoriaBandaPage from "./inventario/pages/AuditoriaBandaPage";

const BandaRouter = () => {
  return (
    <Routes>
      {/* La ruta base "/" aquí equivale a "/banda" en el navegador */}
      <Route path="/" element={<BandaHomePage />} />
      <Route path="inventario" element={<InventarioPage />} />
      <Route path="prestamos" element={<PrestamosPage />} />
      <Route path="auditoria" element={<AuditoriaBandaPage />} />
    </Routes>
  );
};

export default BandaRouter;