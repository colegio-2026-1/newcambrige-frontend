import axios from "axios";

const API = "http://localhost:8000"; // backend

// ======================
// 📚 BIBLIOTECA
// ======================
export const getLibrosRequest = () =>
  axios.get(`${API}/libros`);

export const createLibroRequest = (data) =>
  axios.post(`${API}/libros`, data);

export const updateLibroRequest = (id, data) =>
  axios.put(`${API}/libros/${id}`, data);

export const deleteLibroRequest = (id) =>
  axios.delete(`${API}/libros/${id}`);

export const getPrestamosRequest = () =>
  axios.get(`${API}/prestamos`);


// ======================
// 🪑 PUPITRES
// ======================
export const getPupitresRequest = () =>
  axios.get(`${API}/pupitres`);

export const updatePupitreRequest = (id, data) =>
  axios.put(`${API}/pupitres/${id}`, data);


// ======================
// 🧪 PRUEBAS
// ======================
export const getPruebasRequest = () =>
  axios.get(`${API}/pruebas`);

export const createPruebaRequest = (data) =>
  axios.post(`${API}/pruebas`, data);