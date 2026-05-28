const ModalBase = ({
  open,
  onClose,
  title,
  children,
  footer,
  width = "650px",
}) => {

  if (!open) return null;

  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          width,
          maxWidth: "95%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            padding: "18px 22px",
            borderBottom:
              "1px solid #e5e7eb",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >

          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#111827",
            }}
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <div
          style={{
            padding: "22px",
          }}
        >
          {children}
        </div>

        {/* FOOTER */}

        {footer && (

          <div
            style={{
              padding: "18px 22px",
              borderTop:
                "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            {footer}
          </div>

        )}

      </div>

    </div>
  );
};

export default ModalBase;