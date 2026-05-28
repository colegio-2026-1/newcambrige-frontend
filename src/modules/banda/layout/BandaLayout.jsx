import { Outlet } from "react-router-dom";

import BandaHeader from "./BandaHeader";
import BandaSidebar from "./BandaSidebar";

import "./BandaLayout.css";

const BandaLayout = () => {

  return (

    <div className="banda-layout">

      {/* SIDEBAR */}

      <BandaSidebar />

      {/* CONTENIDO */}

      <div className="banda-layout__content">

        {/* HEADER */}

        <BandaHeader />

        {/* MAIN */}

        <main className="banda-layout__main">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default BandaLayout;