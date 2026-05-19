
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { allestudiantesRequest, allsalonesRequest, allmatriculasRequest, allrolesuserRequest, crearMatriculaRequest, allaniosacademicosRequest } from '../../api/endpoints'; 


import { useAuth } from "../../modules/auth/useAuth";
import UserIcon from '../../assets/Login/usuario_login.svg';
import Header        from "../../components/layout/Header";
import ModuleLayout  from "../../components/layout/ModuleLayout";
import Sidebar       from "../../components/layout/Sidebar";
import SearchBar     from "../../components/shared/SearchBar";
import DataTable     from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal         from "../../components/shared/Modal";



const MatriculaTable = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
  const [salones, setSalones] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const navigate = useNavigate();
  const [periodos, setPeriodos] = useState([]);
  const rolespermitidos =  ["secretaria", "administrador", "admin", "tesoreria"]
   //para el sidebar
  const modulos = [
    { label: "Estadisticas",    path: "/tesoreria/estadisticas", roles: rolespermitidos },
  ];
const salonesMap = {};
salones.forEach(s => {
  salonesMap[s.id_salon] = s; 
  
});
const matriculasMap = {};
matriculas.forEach(m => {
  matriculasMap[m.id_estudiante] = m; 
});
const periodosMap = {};
periodos.forEach(p => {
  periodosMap[p.id_periodo] = p;
});

const { user, logout } = useAuth();
  const userName = user?.nombre || "Usuario";
  const idUser = user?.id_usuario;
  const [roles, setRoles] = useState([]); 
  const [cargandoRol, setCargandoRol] = useState(true);
  const rol = roles[0]|| "Rol Desconocido";
  const [fila,       setFila]       = useState(null);
  const [modal,      setModal]      = useState(false);
  const [modal2,      setModal2]      = useState(false);
  

  const crearMatricula = async () => {
  if (!fila || !fila.id_estudiante) {
    console.error("No hay ningún estudiante seleccionado.");
    return;
  }

  try {
    
    // Pasamos el objeto limpio con los nombres que espera tu FastAPI
    await crearMatriculaRequest({
      estudiante_id: Number(fila.id_estudiante),
      periodo_id: 5
    });
    cargarMatriculas();
    setFila(null); 
  } catch (error) {
    console.error("Error al crear la matrícula:", error);
  }
};

  useEffect(() => {
  const obtenerRoles = async () => {
    if (!idUser) return;
    
    try {
      setCargandoRol(true);
      const response = await allrolesuserRequest(idUser);
      
      setRoles(response?.data || []); 
    } catch (error) {
      console.error("Error al obtener el rol:", error);
      setRoles([]);
    } finally {
      setCargandoRol(false);
    }
  };
  
  obtenerRoles();
}, [idUser]);


  const cargarEstudiantes = async () => {
    try {
      const res = await allestudiantesRequest();
      setEstudiantes(res.data);
      setEstudiantesFiltrados(res.data); 
    } catch (error) {
      console.error("Error cargando estudiantes:", error);
    } 
  };

  const cargarSalones = async () => {
    try {
      const res = await allsalonesRequest();
      setSalones(res.data);
    } catch (error) {
      console.error("Error cargando salones:", error);
    }
  };

  const cargarMatriculas = async () => {
    try {
      const res = await allmatriculasRequest();
      setMatriculas(res.data);
    } catch (error) {
      console.error("Error cargando matrículas:", error);
    }
  };
  const cargarPeriodos = async () => {
    try {
      const res = await allaniosacademicosRequest();
      setPeriodos(res.data);
    } catch (error) {
      console.error("Error cargando periodos:", error);
    }
  };

  useEffect(() => {
    cargarEstudiantes();
    cargarSalones();
    cargarMatriculas();
    cargarPeriodos();
    
  }, []);


  const FiltrarEstudiantes = (filtros) => {
    setEstudiantesFiltrados(estudiantes.filter(e => {
      const cumpleDocumento = e.documento.toString().includes(filtros.documento);
      const cumpleNombre = e.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
      const cumpleGrado = filtros.Grado ? ((salonesMap[e.id_salon]?.grado).toString() === filtros.Grado) : true;
      const cumpleGrupo = filtros.Grupo ? (salonesMap[e.id_salon]?.grupo).toString() === filtros.Grupo : true;
      const cumplePeriodo = filtros.Periodo ? periodosMap[salonesMap[e.id_salon]?.id_periodo]?.nombre === filtros.Periodo : true;
      return cumpleDocumento && cumpleNombre && cumpleGrado && cumpleGrupo && cumplePeriodo;
    }));
  };

  return (
    <div >
  
  <Header />

  

<ModuleLayout 
    sidebar={<Sidebar 
       moduloActual="Matrícula"
            modulos={modulos.filter(item => item && Array.isArray(item.roles) && roles.some(rol => item.roles.includes(rol)))}
            userIcon={user?.icon || UserIcon}
            usuario={{ nombre: userName, rol: rol }}
            onLogout={logout}
    />}
      actions={
                <ActionButtons
                  filaSeleccionada={fila}
                  botones={[
                    { label: "Validar Pago",  onClick: () => { matriculasMap[fila?.id_estudiante ] ? setModal2(true) : setModal(true); }, siempreActivo: false  , variante: "primary" }
                  ]}
                />
              }
>  
{roles.some(rol => rolespermitidos.includes(rol)) ? (
  <div>
             <SearchBar
                      fields={[
                        { key: "documento", label: "Código",          type: "text" },
                        { key: "nombre",    label: "Nombre",type: "text" },
                        { key: "Grado",   label: "Grado",         type: "select", options: Array.from(new Set(Object.values(salonesMap).map(s => s.grado).filter(Boolean))) },
                        { key: "Grupo",   label: "Grupo",         type: "select", options: Array.from(new Set(Object.values(salonesMap).map(s => s.grupo).filter(Boolean))) },
                        { key: "Periodo",   label: "Periodo",         type: "select", options: Array.from(new Set(Object.values(periodos).map(s => s.nombre).filter(Boolean)))},
                      ]}
                      onSearch={(f) =>{  FiltrarEstudiantes(f);}}
                    />

                    <DataTable
                              columns={[
                                { key: "documento", label: "Documento" },
                                { key: "nombre",   label: "Nombre" },
                                { key: "grado",    label: "Grado",
                                  render: (_,val) => (
                                    <span>{salonesMap[val.id_salon]?.grado}</span>
                                  )
                                 },
                                { key: "grupo", label: "Grupo", 
                                  render: (_,val) => {
        
                                    return(
                                    <span>{salonesMap[val.id_salon]?.grupo}</span>)
                                  }
                                },
                               
                                { key: "pago", label: "Pago",
                                  render: (_,val) => {
                                    const idEst = val.id_estudiante;
                                    return(
                                    <span className={matriculasMap[idEst]?.estado ? "badge--ok" : "badge--no"}>
                                      {matriculasMap[idEst]?.estado ? "Pagado" : "Pendiente"}
                                    </span>)
                                  }
                                },
                                { key: "fecha_pago", label: "Fecha de Pago",
                                  render: (_,val) => {
                                    const idEst = val.id_estudiante;
                                    return(
                                    <span>{matriculasMap[idEst]?.created_at ? new Date(matriculasMap[idEst].created_at).toLocaleDateString() : "---"}</span>
                                  )
                                 }}
                              ]}
                              rows={estudiantesFiltrados} 
                              
                              onRowClick={(f) => setFila(f)}
                            />
                            </div>
                           ) : (<div className="text-gray-400 italic text-center">
          Tu usuario no tiene permisos para acceder a este módulo.
        </div>) }
                    </ModuleLayout>
            
    
                             

  <Modal
  title={`¿Confirmas que el estudiante ${fila?.nombre || ""} ha realizado el pago de la matrícula?`}
  isOpen={modal}
  onAccept={() => { crearMatricula(); setModal(false); }}
  onCancel={() => setModal(false)}
/>
<Modal
  title={`El estudiante ${fila?.nombre || ""} ya ha realizado el pago de la matrícula.`}
  isOpen={modal2}
  onAccept={() => { setModal2(false); }}
  onCancel={() => setModal2(false)}
/>
        


    </div>
   
  );
};

export default MatriculaTable;