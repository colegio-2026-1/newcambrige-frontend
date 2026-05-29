const EstadoBadge = ({ disponible }) => {

  const styles = disponible
    ? {
        bg: "#DCFCE7",
        color: "#15803D",
        text: "Disponible",
      }
    : {
        bg: "#FEE2E2",
        color: "#B91C1C",
        text: "Prestado",
      };

  return (

    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        minWidth: "120px",

        padding: "8px 14px",

        borderRadius: "999px",

        fontSize: "11px",

        fontWeight: "800",

        letterSpacing: "0.4px",

        backgroundColor: styles.bg,

        color: styles.color,

        border:
          "1px solid rgba(0,0,0,0.04)",

        whiteSpace: "nowrap",

        textTransform: "uppercase",

        fontFamily:
          "var(--font-body)",
      }}
    >
      {styles.text}
    </span>

  );
};

export default EstadoBadge;
