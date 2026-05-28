export const COLORS = {
  primary: "#8E2A25",
  secondary: "#2E5FA7",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  border: "#D6D3D1",
  text: "#333333",
  muted: "#6B7280",
  success: "#15803D",
  warning: "#CA8A04",
  danger: "#DC2626",
};

export const btn = (
  bg,
  disabled = false
) => ({
  padding: "10px 18px",

  backgroundColor: disabled
    ? "#D1D5DB"
    : bg,

  color: "#FFFFFF",

  border: "none",

  borderRadius: "10px",

  cursor: disabled
    ? "not-allowed"
    : "pointer",

  fontWeight: "600",

  fontSize: "13px",

  letterSpacing: "0.3px",

  transition: "all 0.2s ease",

  boxShadow:
    "0 2px 6px rgba(0,0,0,0.08)",

  opacity: disabled ? 0.7 : 1,

  whiteSpace: "nowrap",
});

export const inputStyle = (
  hasError = false
) => ({
  width: "100%",

  padding: "10px 12px",

  border: `1px solid ${
    hasError
      ? COLORS.danger
      : "#D1D5DB"
  }`,

  borderRadius: "10px",

  fontSize: "13px",

  outline: "none",

  backgroundColor: "#FFFFFF",

  transition: "all 0.2s ease",

  boxSizing: "border-box",
});

export const readonlyInput = {
  width: "100%",

  padding: "10px 12px",

  border: "1px solid #E5E7EB",

  borderRadius: "10px",

  fontSize: "13px",

  backgroundColor: "#F3F4F6",

  color: "#6B7280",

  boxSizing: "border-box",
};

export const errorMsg = {
  color: COLORS.danger,

  fontSize: "11px",

  marginTop: "4px",

  fontWeight: "500",
};

export const modalOverlay = {
  position: "fixed",

  inset: 0,

  backgroundColor:
    "rgba(15,23,42,0.45)",

  backdropFilter: "blur(4px)",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  zIndex: 9999,

  padding: "20px",
};

export const modalBox = {
  backgroundColor: "#FFFFFF",

  borderRadius: "18px",

  width: "100%",

  maxWidth: "620px",

  padding: "34px",

  position: "relative",

  boxShadow:
    "0 20px 40px rgba(0,0,0,0.18)",

  border: "1px solid #E5E7EB",

  animation:
    "fadeIn 0.2s ease-out",

  maxHeight: "92vh",

  overflowY: "auto",
};

export const sectionCard = {
  backgroundColor: "#FFFFFF",

  borderRadius: "16px",

  border: "1px solid #E5E7EB",

  boxShadow:
    "0 4px 14px rgba(0,0,0,0.04)",

  padding: "22px",
};

export const tableContainer = {
  backgroundColor: "#FFFFFF",

  borderRadius: "16px",

  overflow: "hidden",

  border: "1px solid #E5E7EB",

  boxShadow:
    "0 4px 12px rgba(0,0,0,0.04)",
};