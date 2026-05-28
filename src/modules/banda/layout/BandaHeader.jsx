import escudoNCS from "../../../assets/Escudos/NCS.svg";
import escudoUP from "../../../assets/Escudos/UP.svg";

import "./BandaHeader.css";

const BandaHeader = () => {

  return (

    <header className="banda-header">

      {/* IZQUIERDA */}

      <div className="banda-header__logos">

        <img
          src={escudoNCS}
          alt="NCS"
          className="banda-header__logo"
        />

        <div className="banda-header__separator">
          ⇄
        </div>

        <img
          src={escudoUP}
          alt="UP"
          className="banda-header__logo"
        />

      </div>

      {/* TITULO */}

      <div className="banda-header__info">

        <h1 className="banda-header__title">
          SISTEMA DE PAZ Y SALVO
        </h1>

        <p className="banda-header__subtitle">
          NEW CAMBRIDGE SCHOOL
        </p>

      </div>

    </header>
  );
};

export default BandaHeader;