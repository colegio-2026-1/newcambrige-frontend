import React, { useState, useEffect } from 'react';
import {allestudiantesbyperiodoRequest, allsalonesbyperiodoRequest, allmatriculasbyperiodoRequest, 
  allrolesuserRequest, allaniosacademicosRequest, 
  alldetallematriculabyperiodoRequest, alltipoconceptoRequest, crearDetalleRequest } from '../../api/endpoints'; 

import { Home } from "lucide-react";
import { useAuth } from "../../api/useAuth";
import Header        from "../../components/layout/Header";
import ModuleLayout  from "../../components/layout/ModuleLayout";
import Sidebar       from "../../components/layout/Sidebar";
import SearchBar     from "../../components/shared/SearchBar";
import DataTable     from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal         from "../../components/shared/Modal";


const TesoreriaDetalleComponent = ({tiporecibed}) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
  const [estudiantesMatriculados, setEstudiantesMatriculados] = useState([]);
  const [salones, setSalones] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [detalles, Setdetalles] = useState([]);
  const rolespermitidos =  ["secretaria", "admin", "tesoreria"]
  const { user, logout } = useAuth();
  const userName = user?.nombre || "Usuario";
  const idUser = user?.id_usuario;
  const [roles, setRoles] = useState([]); 
  const [cargandoRol, setCargandoRol] = useState(true);
  const rol = roles[0]|| "Rol Desconocido";
  const [fila,       setFila]       = useState(null);
  const [modal,      setModal]      = useState(false);
  const [modalVer,      setModalVer]      = useState(false);
  const [cargandoPeriodos, setCargandoPeriodos] = useState(true);
  const [cargandotipo, setCargandoTipo] = useState(true);
  const [tipo, setTipo] = useState([]);
  const [mesesSeleccionados, setMesesSeleccionados] = useState({}); 
  const [filtros, setFiltros] = useState({
    documento: "",
    nombre: "",
    Grado: "",
    Grupo: "",
    Periodo: ""
  });
  const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre"
    ]; 
  //para el sidebar
  const modulos = [
    { label: "Inicio", icon: <Home />,    path: "/Tesoreria" },
    
  ];
  //maps para acceso rápido a datos relacionados
  const salonesMap = {};
  salones.forEach(s => {
    salonesMap[s.id_salon] = s; 
  });
  const matriculasMap = {};
  matriculas.forEach(m => {
    matriculasMap[m.id_estudiante] = m; 
  });
  const periodoMapname = {};
  periodos.forEach(p => {
    periodoMapname[p.nombre] = p;
  });
  const tipoMap = {};
  tipo.forEach(t=>{
    tipoMap[t.nombre] = t
  });
//crear detalle
  const crearDetalle = async () => {
    if (!fila || !fila.id_estudiante) {
        console.error("No hay ningún estudiante seleccionado.");
        return;
      }
      try {
        await crearDetalleRequest(
          Number(matriculasMap[fila.id_estudiante]?.id_matricula),
          Number(tipoMap[tiporecibed]?.id_tipo),
          mesesSeleccionados[fila.id_estudiante]?.toLowerCase()
        );
        cargarDetalles(periodoMapname[filtros.Periodo]?.id_periodo,tipoMap[tiporecibed]?.id_tipo);
        setFila(null); 
      } catch (error) {
        console.error(`Error al crear el detalle ${tiporecibed}:`, error);
      }
      };

  
//carga de datos iniciales
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
  
const cargarEstudiantes = async (id_periodo) => {
    try {
      const res = await allestudiantesbyperiodoRequest(id_periodo);
      setEstudiantes(res.data);
    } catch (error) {
      console.error("Error cargando estudiantes:", error);
    } 
  };

  const cargarSalones = async (id_periodo) => {
    try {
      const res = await allsalonesbyperiodoRequest(id_periodo);
      setSalones(res.data);
    } catch (error) {
      console.error("Error cargando salones:", error);
    }
  };

  const cargarMatriculas = async (id_periodo) => {
    try {
      const res = await allmatriculasbyperiodoRequest(id_periodo);
      setMatriculas(res.data);
    } catch (error) {
      console.error("Error cargando matrículas:", error);
    }
  };

  const cargarDetalles = async (id_periodo, id_tipo) => {
    try {
      const res = await alldetallematriculabyperiodoRequest(id_periodo, id_tipo);
      Setdetalles(res.data);
    } catch (error) {
      console.error("Error cargando detalle matrículas:", error);
    }
  }

  const cargarPeriodos = async () => {
    try {
      const res = await allaniosacademicosRequest();
      setPeriodos(res.data);
      setFiltros(prev => ({ ...prev, Periodo: res.data[0]?.nombre || "" }));
      setCargandoPeriodos(false);
    } catch (error) {
      console.error("Error cargando periodos:", error);
    }
  };

    const cargarTipos = async () => {
    try {
      const res = await alltipoconceptoRequest();
      setTipo(res.data);
      setCargandoTipo(false);
    } catch (error) {
      console.error("Error cargando periodos:", error);
    }
  };

  useEffect(() => {
    cargarPeriodos();
    cargarTipos();
  }, []);    
  
  
  useEffect(() => {
      const idPeriodoActual = periodoMapname[filtros.Periodo]?.id_periodo;
      const tipoexiste = (tipoMap[tiporecibed] && !cargandotipo) ? true : false;
      if(idPeriodoActual && tipoexiste){
      const id_tipo=tipoMap[tiporecibed]?.id_tipo;
      cargarEstudiantes(idPeriodoActual);
      cargarSalones(idPeriodoActual);
      cargarMatriculas(idPeriodoActual);
      cargarDetalles(idPeriodoActual, id_tipo);
      }  
    }, [filtros.Periodo, tipo]);
    
  useEffect(() => {
    const Matriculados = estudiantes.filter(e => matriculasMap[e.id_estudiante]);
    setEstudiantesMatriculados(Matriculados);
    setEstudiantesFiltrados(Matriculados);
    Matriculados.forEach(estudiante => {
    mesesSeleccionados[estudiante.id_estudiante] = "Enero";
  });
  }, [estudiantes, matriculas]);

  const FiltrarEstudiantes = (filtros) => {
    setEstudiantesFiltrados(estudiantesMatriculados.filter(e => {
      const cumpleDocumento = e.documento.toString().includes(filtros.documento);
      const cumpleNombre = e.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
      const cumpleGrado = filtros.Grado ? ((salonesMap[e.id_salon]?.grado).toString() === filtros.Grado) : true;
      const cumpleGrupo = filtros.Grupo ? (salonesMap[e.id_salon]?.grupo).toString() === filtros.Grupo : true;
      return cumpleDocumento && cumpleNombre && cumpleGrado && cumpleGrupo;
    }));
  };

  return (

    <div >
      
     <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
         <ModuleLayout 
          sidebar={
            <Sidebar 
              menuItems={modulos.filter(modulo => {
                if (!modulo) return false;
                if (!modulo.roles || !Array.isArray(modulo.roles) 
                  || modulo.roles.length === 0) return true;
                return roles.some(rol => modulo.roles.includes(rol));
                     })}
                user={{ nombre: userName, rol: rol }}
                onLogout={logout}
                   />}
                actions={
            <ActionButtons
              filaSeleccionada={fila}
              botones={(roles.some(rol => rolespermitidos.includes(rol)) 
                        && tipoMap[tiporecibed] && !cargandotipo ) ? [
                         { label: "Validar Pago",  
                           onClick: () => {  setModal(true); }, 
                           siempreActivo: false , variante: "primary", 
                           disabled: (Object.values(detalles).filter(d => d.id_matricula == matriculasMap[fila?.id_estudiante]?.id_matricula).some(d => d.mes == mesesSeleccionados[fila?.id_estudiante].toLowerCase()))
                           || ((Object.values(detalles).filter(d => d.id_matricula == matriculasMap[fila?.id_estudiante]?.id_matricula).some(d => d.mes == meses[meses.indexOf(mesesSeleccionados[fila?.id_estudiante])-1]?.toLowerCase()) 
                           || mesesSeleccionados[fila?.id_estudiante] == 'Enero') ? false : true)
                           || (!periodoMapname[filtros.Periodo]?.activo && !roles.includes("admin"))  
                           || (salonesMap[fila?.id_salon]?.id_periodo !== periodoMapname[filtros?.Periodo]?.id_periodo) },
                          { label: "Ver",  
                           onClick: () => {  setModalVer(true); }, 
                           siempreActivo: false , variante: "secondary", 
                           disabled: (salonesMap[fila?.id_salon]?.id_periodo !== periodoMapname[filtros?.Periodo]?.id_periodo) }
                          ] : []}
                     />
                   }
                 >
                  
    {cargandoRol || cargandoPeriodos || cargandotipo? (
        <div className="text-gray-400 italic text-center">
          Cargando Modulo {tiporecibed}...
        </div>
    ) : (  tipoMap[tiporecibed] && !cargandotipo ? (      
          roles.some(rol => rolespermitidos.includes(rol)) ? (
          <div>
          <SearchBar
              fields={[
                { key: "documento", label: "Código", type: "number", maxLength:10 },
                { key: "nombre",    label: "Nombre",type: "text", maxLength:100 },
                { key: "Grado",   label: "Grado",         type: "select", 
                  options: Array.from(new Set(Object.values(salonesMap)
                  .filter(s => s.id_periodo === periodoMapname[filtros.Periodo]?.id_periodo)
                  .map(s => s.grado).filter(Boolean))) },
                { key: "Grupo",   label: "Grupo",        type: "select", 
                  options:  Array.from(new Set(Object.values(salonesMap)
                  .filter(s => (s.grado).toString() === filtros.Grado)
                  .map(s => s.grupo).filter(Boolean))) },
                { key: "Periodo",   label: "Periodo", type: "select", 
                  options: Array.from(new Set(Object.values(periodos)
                  .map(s => s.nombre).filter(Boolean)))},
                  ]}
              initialValues={{ Periodo: periodos[0]?.nombre }}
              onChange={(key, value) => {
                  setFiltros(prev => {
                  const nuevosFiltros = { ...prev, [key]: value };
                  if (key === "Grado") {
                    nuevosFiltros.Grupo = "";
                    }
                  if (key === "Periodo") {
                    nuevosFiltros.Grado = "";
                    nuevosFiltros.Grupo = "";
                    }
                  return nuevosFiltros;
                  });
                }}
              onSearch={(f) =>{  FiltrarEstudiantes(f); setFiltros(f); setFila(null); }}
              cleanFilter={
                { documento: "", nombre: "", Grado: "", Grupo: "", Periodo: filtros.Periodo }
                }
          />
    
          <DataTable
            key={`${detalles}`}
            pageSize={10}
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
              {key: "mes", label: "Mes",
                render: (_, val) => {
                  const idEst = val.id_estudiante;
                  const mesActual = mesesSeleccionados[idEst] || "Enero";
                  return (
                    <select 
                      name="meses" 
                      id={`meses-${idEst}`}
                      value={mesActual}
                      className="form-select"
                      onChange={(e) => {
                        const nuevoMes = e.target.value;
                        setMesesSeleccionados(prev => ({
                          ...prev,[idEst]: nuevoMes
                        }));
                      }}
                    >
                      {meses.map((mes, index) => (
                        <option key={index} value={mes}>
                          {mes}
                        </option>
                      ))}
                    </select>
                  );
                }
              },
              { key: "pago", label: "Pago",
                render: (_,val) => {
                const idEst = val.id_estudiante;
                const estadodetalle=Array.from(new Set(Object.values(detalles)
                                    .filter(d => d.id_matricula == matriculasMap[idEst]?.id_matricula)
                                    .filter(d => d.mes == mesesSeleccionados[idEst].toLowerCase())
                                    .map(d => d.estado).filter(Boolean)))
                return(
                  <span className={estadodetalle.length > 0   ? "badge--ok" : "badge--no"}>
                    {estadodetalle.length > 0  ? "Pagado" : "Pendiente"}
                   </span>);
                }
              },
              { key: "fecha_pago", label: "Fecha de Pago",
                render: (_,val) => {
                const idEst = val.id_estudiante;
                const estadodetalle=Array.from(new Set(Object.values(detalles)
                                    .filter(d => d.id_matricula == matriculasMap[idEst]?.id_matricula)
                                    .filter(d => d.mes == mesesSeleccionados[idEst].toLowerCase())
                                    .map(d => d.created_at).filter(Boolean)));
                                      
                return(
                  <span>{estadodetalle.length > 0  ? new Date(estadodetalle).toLocaleDateString() : "---"}</span>
                      );
              }}
            ]}
              rows={estudiantesFiltrados} 
              onRowClick={(f) => {setFila(f); } }
          />
          </div>
            ) : (
              <div className="text-gray-400 italic text-center">
                Tu usuario no tiene permisos para acceder a este módulo.
              </div>)  ) : (
              <div className="text-gray-400 italic text-center">
                Error tipo detalle {tiporecibed} no existe
              </div>
          ))}
        </ModuleLayout>
        <Modal
          title={`¿Confirmas que el estudiante ${fila?.nombre || ""} ha realizado el pago del mes de ${mesesSeleccionados[fila?.id_estudiante] || ""}?`}
          isOpen={modal}
          onAccept={() => { setModal(false); crearDetalle() }}
          onCancel={() => setModal(false)}
        />
        <Modal
          title={tiporecibed}
          fields={[{key: "nombre",type: "label", label:`Nombre: ${fila?.nombre}`},
          {key:"documento" ,type: "label", label:`Documento: ${fila?.documento}`},
          {key:"card", type: "card", values: meses, validatevalues:(Object.values(detalles).filter(d => d.id_matricula == matriculasMap[fila?.id_estudiante]?.id_matricula).map(d => d.mes))}]
          }
          isOpen={modalVer}
          onAccept={() => { setModalVer(false); }}
          onCancel={() => setModalVer(false)}
        />
    </div> 
      );
    };
export default TesoreriaDetalleComponent ;