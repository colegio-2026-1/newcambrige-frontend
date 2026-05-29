import { Outlet } from "react-router-dom";

import BandaHeader from "./BandaHeader";
import BandaSidebar from "./BandaSidebar";

import "./BandaLayout.css";

const BandaLayout = () => {
  return (
    <div className="banda-layout">

      {/* SIDEBAR PERSISTENTE */}
      <BandaSidebar />

      {/* CONTENIDO */}
      <div className="banda-layout__content">

        {/* HEADER */}
        <BandaHeader />

        {/* MAIN */}
        <main className="banda-layout__main">
          <div className="banda-layout__container">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default BandaLayout;