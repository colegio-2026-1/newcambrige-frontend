import { useNavigate } from "react-router-dom";
import bandaSvg from "../../assets/Banda/banda.svg";

const BandaHomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      backgroundColor: "#FFFFFF"
    }}>
      <div
        onClick={() => navigate("/banda/inventario")}
        style={{
          width: "320px",
          padding: "40px",
          backgroundColor: "#F5F5F5",
          borderRadius: "12px",
          boxShadow: "4px 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer",
          textAlign: "center",
          border: "2px solid #8E2A25",
          transition: "transform 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <p style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#333333",
          marginBottom: "20px"
        }}>
          Banda
        </p>
        <img src={bandaSvg} alt="Banda" style={{ width: "100px" }} />
      </div>
    </div>
  );
};

export default BandaHomePage;