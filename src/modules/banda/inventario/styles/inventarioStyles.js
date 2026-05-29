export const COLORS = {

  // =====================================================
  // PALETA INSTITUCIONAL
  // =====================================================

  primary: "#8E2A25",

  secondary: "#1B3A5C",

  background: "#F5F0E8",

  surface: "#FFFFFF",

  border: "#D6D3D1",

  text: "#2B2B2B",

  muted: "#6B7280",

  success: "#15803D",

  warning: "#CA8A04",

  danger: "#B91C1C",
};

// =======================================================
// SOMBRAS INSTITUCIONALES
// =======================================================

export const SHADOWS = {

  hard:
    "10px 10px 0px #8E2A25",

  sm:
    "0 2px 8px rgba(0,0,0,0.06)",

  md:
    "0 6px 18px rgba(0,0,0,0.10)",
};

// =======================================================
// BOTONES
// =======================================================

export const btn = (
  bg,
  disabled = false
) => ({

  padding: "12px 18px",

  backgroundColor:
    disabled
      ? "#D1D5DB"
      : bg,

  color: "#FFFFFF",

  border: "none",

  borderRadius: "12px",

  cursor:
    disabled
      ? "not-allowed"
      : "pointer",

  fontWeight: "700",

  fontSize: "13px",

  fontFamily: "Lato, sans-serif",

  letterSpacing: "0.4px",

  transition: "all 0.2s ease",

  boxShadow:
    disabled
      ? "none"
      : SHADOWS.sm,

  opacity:
    disabled ? 0.7 : 1,

  whiteSpace: "nowrap",
});

// =======================================================
// INPUTS
// =======================================================

export const inputStyle = (
  hasError = false
) => ({

  width: "100%",

  padding: "12px 14px",

  border: `1px solid ${
    hasError
      ? COLORS.danger
      : COLORS.border
  }`,

  borderRadius: "12px",

  fontSize: "13px",

  fontFamily:
    "Lato, sans-serif",

  outline: "none",

  backgroundColor:
    "#FFFFFF",

  transition:
    "all 0.2s ease",

  boxSizing:
    "border-box",

  color:
    COLORS.text,
});

// =======================================================
// INPUT READONLY
// =======================================================

export const readonlyInput = {

  width: "100%",

  padding: "12px 14px",

  border:
    "1px solid #E5E7EB",

  borderRadius: "12px",

  fontSize: "13px",

  fontFamily:
    "Lato, sans-serif",

  backgroundColor:
    "#EFEAE2",

  color:
    COLORS.muted,

  boxSizing:
    "border-box",
};

// =======================================================
// MENSAJES ERROR
// =======================================================

export const errorMsg = {

  color:
    COLORS.danger,

  fontSize: "11px",

  marginTop: "5px",

  fontWeight: "600",

  fontFamily:
    "Lato, sans-serif",
};

// =======================================================
// MODAL OVERLAY
// =======================================================

export const modalOverlay = {

  position: "fixed",

  inset: 0,

  backgroundColor:
    "rgba(15,23,42,0.45)",

  backdropFilter:
    "blur(4px)",

  display: "flex",

  justifyContent:
    "center",

  alignItems:
    "center",

  zIndex: 9999,

  padding: "20px",
};

// =======================================================
// MODAL BOX
// =======================================================

export const modalBox = {

  backgroundColor:
    COLORS.surface,

  borderRadius: "22px",

  width: "100%",

  maxWidth: "620px",

  padding: "34px",

  position: "relative",

  boxShadow:
    SHADOWS.hard,

  border:
    `1px solid ${COLORS.border}`,

  animation:
    "fadeIn 0.2s ease-out",

  maxHeight: "92vh",

  overflowY: "auto",
};

// =======================================================
// CARD INSTITUCIONAL
// =======================================================

export const sectionCard = {

  backgroundColor:
    COLORS.surface,

  borderRadius: "20px",

  border:
    `1px solid ${COLORS.border}`,

  boxShadow:
    SHADOWS.hard,

  padding: "24px",
};

// =======================================================
// CONTENEDOR TABLA
// =======================================================

export const tableContainer = {

  backgroundColor:
    COLORS.surface,

  borderRadius: "20px",

  overflow: "hidden",

  border:
    `1px solid ${COLORS.border}`,

  boxShadow:
    SHADOWS.hard,
};

// =======================================================
// TITULOS
// =======================================================

export const titleStyle = {

  fontFamily:
    "Cinzel, serif",

  color:
    COLORS.primary,

  fontWeight: "700",

  letterSpacing: "1px",
};

// =======================================================
// SUBTITULOS
// =======================================================

export const subtitleStyle = {

  fontFamily:
    "Lato, sans-serif",

  color:
    COLORS.muted,

  fontSize: "14px",

  fontWeight: "500",
};