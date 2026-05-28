import { ESTADO_BADGE } from "../utils/inventarioConstants";

const EstadoBadge = ({ estado }) => {

  const s =
    ESTADO_BADGE[estado] ?? {
      bg: "#F3F4F6",
      color: "#6B7280",
    };

  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "600",
        backgroundColor: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      {estado ?? "—"}
    </span>
  );
};

export default EstadoBadge;