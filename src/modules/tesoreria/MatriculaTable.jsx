
import { LayoutGrid, BarChart3, User, LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { allestudiantesRequest } from '../../api/endpoints'; 
import '../../index.css'; 
import TesoreriaSidebar from './TesoreriaSidebar';
import Header from './headerTesoreria';

const MatriculaTable = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  // Función para obtener los datos
  const cargarEstudiantes = async () => {
    try {
      const res = await allestudiantesRequest();
      setEstudiantes(res.data); // Guardamos los datos que vienen de FastAPI
    } catch (error) {
      console.error("Error cargando estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta una sola vez al montar el componente
  useEffect(() => {
    cargarEstudiantes();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden font-sans">
  
  <Header />

  
  <div className="flex flex-1 overflow-hidden">
   
    <TesoreriaSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        
      
     
        {/* Filtros Superiores */}
        <div className="p-4 bg-white border-b flex items-center justify-center gap-4 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <span>Código</span>
            <input type="text" className="border rounded-full px-4 py-1 bg-gray-100 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <span>Nombre</span>
            <input type="text" className="border rounded-full px-4 py-1 bg-gray-100 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <span>Grado</span>
            <select className="border rounded-full px-4 py-1 bg-gray-100"><option></option></select>
          </div>
          <div className="flex items-center gap-2">
            <span>Grupo</span>
            <select className="border rounded-full px-4 py-1 bg-gray-100"><option></option></select>
          </div>
          <div className="flex items-center gap-2">
            <span>Año</span>
            <select className="border rounded-full px-4 py-1 bg-gray-100"><option></option></select>
          </div>
          <button className="bg-[#2B4C7E] text-white px-6 py-1 rounded-full flex items-center gap-2 hover:bg-[#1A3A63]">
            Buscar
          </button>
        </div>

        {/* Tabla */}
        <div className="flex-1 p-6 overflow-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#E9E9E7] text-gray-700 text-xs uppercase tracking-wider">
                <th className="border border-gray-300 p-2 w-12"></th>
                <th className="border border-gray-300 p-2 w-24">Código</th>
                <th className="border border-gray-300 p-2">Nombre Completo</th>
                <th className="border border-gray-300 p-2 w-20">Grado</th>
                <th className="border border-gray-300 p-2 w-20">Grupo</th>
                <th className="border border-gray-300 p-2 w-20">Pago</th>
                <th className="border border-gray-300 p-2 w-32">Fecha de Pago</th>
              </tr>
            </thead>
            <tbody className="bg-white">
  {loading ? (
    <tr>
      <td colSpan="6" className="text-center p-10 text-gray-400 italic">
        Cargando datos de estudiantes...
      </td>
    </tr>
  ) : estudiantes.length > 0 ? (
    estudiantes.map((est, index) => (
      <tr key={est.id || index} className="hover:bg-gray-50 transition-colors">
        <td className="border border-gray-300 p-2 text-center">
          <input type="checkbox" />
        </td>
        <td className="border border-gray-300 p-2 text-center text-sm">{est.documento}</td>
        <td className="border border-gray-300 p-2 text-sm px-4">{est.nombre}</td>
        <td className="border border-gray-300 p-2 text-center text-sm">{est.id_salon}</td>
        <td className="border border-gray-300 p-2 text-center text-sm">{est.id_salon}</td>
        <td className="border border-gray-300 p-2 text-center">
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${est.pago ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {est.pago ? 'PAGADO' : 'PENDIENTE'}
          </span>
        </td>
        <td className="border border-gray-300 p-2 text-center text-sm text-gray-500">
          {est.created_at || '---'}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center p-10 text-gray-400">
        No se encontraron estudiantes registrados.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>

        {/* Botón Inferior */}
        <div className="p-6 flex justify-end">
          <button className="bg-[#2B4C7E] text-white px-8 py-3 rounded-2xl shadow-lg font-bold flex items-center gap-2 hover:bg-[#1A3A63] transition-all">
            Validar Pago
            <span className="text-xl">⇄</span>
          </button>
        </div>
      </main>
    </div>
    </div>
  );
};

export default MatriculaTable;