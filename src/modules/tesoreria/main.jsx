import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './headerTesoreria';
import TesoreriaSidebar from './TesoreriaSidebar';
import MatriculaLogo from '../../assets/Tesoreria/matricula.svg';
import PensionLogo from '../../assets/Tesoreria/pension.svg';
import PapeleriaLogo from '../../assets/Tesoreria/papeleria.svg';


const Dashboard = () => {
    const navigate = useNavigate();
  const categories = [
    { title: 'Matrícula', icon: <img src={MatriculaLogo} alt="Matrícula" className="w-16 h-16" /> },
    { title: 'Pensión', icon: <img src={PensionLogo} alt="Pensión" className="w-16 h-16" /> },
    { title: 'Papelería', icon: <img src={PapeleriaLogo} alt="Papelería" className="w-16 h-16" /> },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden font-sans">
  
  <Header />

  
  <div className="flex flex-1 overflow-hidden">
   
    <TesoreriaSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">

        {/* Contenido de Tarjetas */}
        <section className="flex-1 flex justify-center items-center gap-20 p-12 relative">
          {categories.map((item, index) => (
            <div key={index} className="relative group scale-110" onClick={() => item.title === 'Matrícula' && navigate('/tesoreria/matricula')}>
              {/* Sombra proyectada vinotinto (Efecto exacto) */}
              <div className="absolute top-4 left-4 w-56 h-72 bg-vinotinto rounded-2xl shadow-lg transition-transform group-hover:translate-x-1 group-hover:translate-y-1"></div>
              
              {/* Tarjeta Blanca */}
              <div className="relative bg-white border border-gray-100 rounded-2xl w-56 h-72 flex flex-col items-center justify-center p-8 shadow-2xl transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
                <h3 className="text-dorado text-3xl font-serif font-medium mb-10 tracking-wide text-center">
                  {item.title}
                </h3>
                <div className="text-dorado transform transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
    </div>
  );
};

export default Dashboard;