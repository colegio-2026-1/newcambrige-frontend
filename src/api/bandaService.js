import axiosClient from "./axiosClient";
import { endpoints } from "./endpoints";

const { BANDA } = endpoints;

export const bandaService = {

  // =====================================================
  // CATEGORIAS
  // =====================================================

  getCategorias: () =>

    axiosClient.get(
      BANDA.categorias
    ),

  // =====================================================
  // UBICACIONES
  // =====================================================

  getUbicaciones: () =>

    axiosClient.get(
      BANDA.ubicaciones
    ),

  // =====================================================
  // ESTUDIANTES
  // =====================================================

  getEstudiantes: () =>

    axiosClient.get(
      "/api/estudiantes/"
    ),

  // =====================================================
  // INSTRUMENTOS
  // =====================================================

  getInstrumentos: () =>

    axiosClient.get(
      BANDA.instrumentos
    ),

  getInstrumentosDisponibles: () =>

    axiosClient.get(
      BANDA.instrumentosDisponibles
    ),

  crearInstrumento: (data) =>

    axiosClient.post(
      BANDA.instrumentos,
      data
    ),

  editarInstrumento: (
    id,
    data
  ) =>

    axiosClient.put(
      BANDA.instrumentoById(id),
      data
    ),

  eliminarInstrumento: (id) =>

    axiosClient.delete(
      BANDA.instrumentoById(id)
    ),

  // =====================================================
  // PRESTAMOS
  // =====================================================

  getPrestamos: () =>

    axiosClient.get(
      BANDA.prestamos
    ),

  crearPrestamo: (data) =>

    axiosClient.post(
      BANDA.prestamos,
      data
    ),

  devolverPrestamo: (id) =>

    axiosClient.put(
      BANDA.devolverPrestamo(id)
    ),

  // =====================================================
  // ESTADISTICAS
  // =====================================================

  getEstadisticas: () =>

    axiosClient.get(
      BANDA.estadisticas
    ),
};