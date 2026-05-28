import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, use } from 'react';
import { allestudiantesRequest, allsalonesRequest, allmatriculasRequest, allrolesuserRequest, allaniosacademicosRequest } from '../../api/endpoints'; 


import { useAuth } from "../../api/useAuth";
import UserIcon from '../../assets/Login/usuario_login.svg';
import Header        from "../../components/layout/Header";
import ModuleLayout  from "../../components/layout/ModuleLayout";
import Sidebar       from "../../components/layout/Sidebar";
import SearchBar     from "../../components/shared/SearchBar";
import DataTable     from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal         from "../../components/shared/Modal";



const TesoreriaPension = () => {
  const [matriculas, setMatriculas] = useState([]);
 const matriculasMap = {};
  matriculas.forEach(m => {
    matriculasMap[m.id_estudiante] = m; 
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesMatriculados, setEstudiantesMatriculados] = useState([]);
    const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
    const [salones, setSalones] = useState([]);
    
    const navigate = useNavigate();
    const [periodos, setPeriodos] = useState([]);
    const rolespermitidos =  ["secretaria", "administrador", "admin", "tesoreria"]
    
  const salonesMap = {};
  salones.forEach(s => {
    salonesMap[s.id_salon] = s; 
    
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
   const [modalVer,      setModalVer]      = useState(false);
  
    const periodosMap = {};
periodos.forEach(p => {
  periodosMap[p.id_periodo] = p;
});
  
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

    useEffect(() => {
      const Matriculados = estudiantes.filter(e => matriculasMap[e.id_estudiante]);
      setEstudiantesMatriculados(Matriculados);
      setEstudiantesFiltrados(Matriculados);
    }, [estudiantes, matriculas]);

     const FiltrarEstudiantes = (filtros) => {
    setEstudiantesFiltrados(estudiantesMatriculados.filter(e => {
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
           moduloActual="Pensión"
                userIcon={user?.icon || UserIcon}
                usuario={{ nombre: userName, rol: rol }}
                onLogout={logout}
        />}
          actions={
                    <ActionButtons
                      filaSeleccionada={fila}
                      botones={[
                        { label: "Validar Pago",  onClick: () => { fila.pago === 'Pagado' ? setModal2(true) : setModal2(true); }, siempreActivo: false  , variante: "primary" },
                        { label: "Ver",  onClick: () => { setModalVer(true) }, siempreActivo: false  , variante: "secondary" },
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
                          onSearch={(f) => {  FiltrarEstudiantes(f); console.log(f);}}
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
                                     {
                                                                      key: "mes", label: "Mes",
                                                                      render: (_, val) => {
                                                                      return(
                                                                        <select name="meses" id="meses">
                                                                            <option>
                                                                              enero
                                                                            </option>
                                                                            <option>
                                                                              febrero
                                                                            </option>
                                                                            <option>
                                                                              marzo
                                                                            </option>
                                                                            <option>
                                                                              abril
                                                                            </option>
                                                                            <option>
                                                                              mayo
                                                                            </option>
                                                                            <option>  
                                                                              junio
                                                                            </option>
                                                                            <option>
                                                                              julio
                                                                            </option> 
                                                                            <option>
                                                                              agosto
                                                                            </option>
                                                                            <option>
                                                                              septiembre
                                                                            </option>
                                                                            <option>
                                                                              octubre
                                                                            </option>
                                                                            <option>
                                                                              noviembre
                                                                            </option>
                                                                        </select>
                                                                      )}
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
      title={`¿Confirmas que el estudiante ${fila?.nombre || ""} ha realizado el pago del mes de ${fila?.mes || ""}?`}
      isOpen={modal}
      onAccept={() => { setModal(false); }}
      onCancel={() => setModal(false)}
    />
    <Modal
      title={`El estudiante ${fila?.nombre || ""} ya ha realizado el pago del mes de ${fila?.mes || ""}.`}
      isOpen={modal2}
      onAccept={() => { setModal2(false); }}
      onCancel={() => setModal2(false)}
    />
    <Modal
      title={`El estudiante ${fila?.nombre || ""} ya ha realizado el pago de los meses $.`}
      isOpen={modalVer}
      onAccept={() => { setModalVer(false); }}
      onCancel={() => setModalVer(false)}
    />
            
          
         
    
        </div>
       
      );
    };

export default TesoreriaPension;