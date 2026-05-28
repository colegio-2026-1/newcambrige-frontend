import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../api/useAuth";

import "./BandaUserCard.css";

const BandaUserCard = () => {

  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/");
  };

  return (

    <div className="banda-usercard">

      <div className="banda-usercard__info">

        {/* AVATAR */}

        <div className="banda-usercard__avatar">

          {
            user?.nombre
              ?.charAt(0)
              ?.toUpperCase()
              ?? "U"
          }

        </div>

        {/* INFO */}

        <div>

          <p className="banda-usercard__role">
            TITULAR
          </p>

          <p className="banda-usercard__name">
            {user?.nombre ?? "Usuario"}
          </p>

        </div>

      </div>

      <button
        onClick={handleLogout}
        className="banda-usercard__button"
      >
        Cerrar sesión
      </button>

    </div>
  );
};

export default BandaUserCard;