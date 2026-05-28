const Toast = ({ message }) => {

  if (!message) return null;

  return (

    <div
      style={{
        position: "fixed",

        top: "24px",

        right: "24px",

        zIndex: 9999,

        backgroundColor: "#15803D",

        color: "#FFFFFF",

        padding: "14px 18px",

        borderRadius: "14px",

        display: "flex",

        alignItems: "center",

        gap: "10px",

        minWidth: "280px",

        boxShadow:
          "0 12px 30px rgba(0,0,0,0.18)",

        fontSize: "13px",

        fontWeight: "600",

        animation:
          "fadeIn 0.25s ease",
      }}
    >

      <span
        style={{
          fontSize: "16px",
        }}
      >
        ✓
      </span>

      <span>
        {message}
      </span>

    </div>
  );
};

export default Toast;