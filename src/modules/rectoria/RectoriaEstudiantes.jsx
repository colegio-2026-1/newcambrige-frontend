
import React, { useState, useEffect } from 'react';
import { allrolesuserRequest, allaniosacademicosRequest } from '../../api/endpoints';
import { allestudiantesbyperiodoRequest, allsalonesbyperiodoRequest, allmatriculasbyperiodoRequest, crearMatriculaRequest} from '../../api/endpointsTesoreria';
import {estudiantesRectoriaRequest,estudianteFirmasRequest,firmarRectoriaEstudianteRequest,docentesRectoriaRequest,firmarDocenteRequest,descargarPdfEstudianteRequest,descargarPdfDocenteRequest,selloRequest} from "../../api/endpointsRectoria";
import PazYSalvoModal from "./PazYSalvoModal";
import { Home } from "lucide-react";
import { useAuth } from "../../api/useAuth";
import Header from "../../components/layout/header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";
import SearchBar from "../../components/shared/searchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";



const RectoriaEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
  const [salones, setSalones] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const rolespermitidos = ["secretaria", "admin", "rectoria"]
  const { user, logout } = useAuth();
  const userName = user?.nombre || "Usuario";
  const idUser = user?.id_usuario;
  const [roles, setRoles] = useState([]);
  const [cargandoRol, setCargandoRol] = useState(true);
  const rol = roles[0] || "Rol Desconocido";
  const [fila, setFila] = useState(null);
  const [modal, setModal] = useState(false);
  const [cargandoPeriodos, setCargandoPeriodos] = useState(true);
  const [filtros, setFiltros] = useState({
    documento: "",
    nombre: "",
    Grado: "",
    Grupo: "",
    Periodo: ""
  });
  //para el sidebar
  const modulos = [
    { label: "Inicio", icon: <Home />, path: "/Rectoria" },
    { label: "Estudiantes", path: "/rectoria/estudiantes", roles: ["secretaria", "admin", "rectoria"] },
    { label: "Docentes", path: "/rectoria/docentes", roles: ["secretaria", "admin", "rectoria"] },
  ];
  //maps para acceso rápido a datos relacionados
  const salonesMap = {};
  salones.forEach(s => {
    salonesMap[s.id_salon] = s;
  });
  const periodoMapname = {};
  periodos.forEach(p => {
    periodoMapname[p.nombre] = p;
  });
  const [modalValidar, setModalValidar] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [modalVerPazSalvo, setModalVerPazSalvo] = useState(false);
  const [firmasDetalle, setFirmasDetalle] = useState(null);
  const [selloUrl, setSelloUrl] = useState(null);

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
  
  const abrirModalValidacion = (estudiante) => {
  setEstudianteSeleccionado(estudiante);
  setModalValidar(true);
};
const cargarEstudiantes = async (id_periodo) => {
  try {
    const res = await estudiantesRectoriaRequest(id_periodo);

    setEstudiantes(res.data);
    setEstudiantesFiltrados(res.data);
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

  const descargarPazYSalvo = async () => {
  if (!fila) {
    alert("Seleccione un estudiante");
    return;
  }
  try {
    const periodoId =
      periodoMapname[filtros.Periodo]?.id_periodo;

    const response =
      await descargarPdfEstudianteRequest(
        fila.id_estudiante,
        periodoId
      );

    const blob = new Blob(
      [response.data],
      {
        type: "application/pdf"
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `PazYSalvo_${fila.documento}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.detail ||
      "Error descargando PDF"
    );
  }
};
const cargarSello = async () => {
  try {
    const response = await selloRequest();

    const blob = new Blob(
      [response.data],
      { type: "image/jpeg" }
    );

    const url = URL.createObjectURL(blob);

    setSelloUrl(url);

    return url;
  } catch (error) {
    console.error("Error cargando sello:", error);
    return null;
  }
};
const verPazYSalvo = async () => {
  if (!fila) {
    alert("Seleccione un estudiante");
    return;
  }

  try {
    const periodoId =
      periodoMapname[filtros.Periodo]?.id_periodo;

    const [firmasResponse] = await Promise.all([
      estudianteFirmasRequest(
        fila.id_estudiante,
        periodoId
      ),
      !selloUrl ? cargarSello() : Promise.resolve()
    ]);
    console.log(firmasResponse.data);

    setFirmasDetalle(firmasResponse.data);

    setModalVerPazSalvo(true);

  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.detail ||
      "Error consultando el paz y salvo"
    );
  }
};

  useEffect(() => {
    cargarPeriodos();
  }, []);

  useEffect(() => {
    const idPeriodoActual = periodoMapname[filtros.Periodo]?.id_periodo;
    if (idPeriodoActual) {
      cargarEstudiantes(idPeriodoActual);
      cargarSalones(idPeriodoActual);
    }

  }, [filtros.Periodo]);
    useEffect(() => {
      return () => {
        if (selloUrl) {
          URL.revokeObjectURL(selloUrl);
        }
      };
    }, [selloUrl]);

  
  const FiltrarEstudiantes = (filtros) => {
    setEstudiantesFiltrados(estudiantes.filter(e => {
      const cumpleDocumento = e.documento.toString().includes(filtros.documento);
      const cumpleNombre = e.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
      const cumpleGrado = filtros.Grado ? (salonesMap[e.id_salon]?.grado).toString() === filtros.Grado : true;
      const cumpleGrupo = filtros.Grupo ? (salonesMap[e.id_salon]?.grupo).toString() === filtros.Grupo : true;

      return cumpleDocumento && cumpleNombre && cumpleGrado && cumpleGrupo;
    }));
  };

  return (
    <div >
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={<Sidebar
          menuItems={modulos.filter(modulo => {
            if (!modulo) return false;
            if (!modulo.roles || !Array.isArray(modulo.roles) || modulo.roles.length === 0) return true;
            return roles.some(rol => modulo.roles.includes(rol));
          })}
          
          user={{ nombre: userName, rol: rol }}
          onLogout={logout}
        />}
        actions={
          <ActionButtons
            filaSeleccionada={fila}
            botones={[
              {
                label: "Validar Paz y Salvo",
                onClick: () => {},
                variante: "primary"
              },
              {
                label: "Descargar Paz y Salvo",
                onClick: descargarPazYSalvo,
                variante: "primary"
              },
              {
                label: "Ver Paz y Salvo",
                onClick: verPazYSalvo,
                variante: "primary"
              }
            ]}
          />
        }
        
      >
        {cargandoRol || cargandoPeriodos ? (
          <div className="status-message status-message--loading">
            Cargando Modulo Rectoria estudiantes...
          </div>
        ) : (
          roles.some(rol => rolespermitidos.includes(rol)) ? (
            <div>
              <SearchBar
                fields={[
                  { key: "documento", label: "Código", type: "number", maxLength: 10 },
                  { key: "nombre", label: "Nombre", type: "text", maxLength: 100 },
                  {
                    key: "Grado", label: "Grado", type: "select",
                    options: Array.from(new Set(Object.values(salonesMap)
                      .filter(s => s.id_periodo === periodoMapname[filtros.Periodo]?.id_periodo)
                      .map(s => s.grado).filter(Boolean)))
                  },
                  {
                    key: "Grupo", label: "Grupo", type: "select",
                    options: Array.from(new Set(Object.values(salonesMap)
                      .filter(s => (s.grado).toString() === filtros.Grado)
                      .map(s => s.grupo).filter(Boolean)))
                  },
                  {
                    key: "Periodo", label: "Periodo", type: "select",
                    options: Array.from(new Set(Object.values(periodos).map(s => s.nombre).filter(Boolean)))
                  },
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
                onSearch={(f) => { FiltrarEstudiantes(f); setFiltros(f); setFila(null); }}
                cleanFilter={
                  { documento: "", nombre: "", Grado: "", Grupo: "", Periodo: filtros.Periodo }
                }
              />
              <DataTable
                key={`${estudiantes}`}
                pageSize={10}
                columns={[
                  { key: "documento", label: "Documento" },
                  { key: "nombre", label: "Nombre" },
                  {
                    key: "grado",
                    label: "Grado",
                    render: (_, val) => (
                      <span>{val.grado}</span>
                    )
                  },

                  {
                    key: "grupo",
                    label: "Grupo",
                    render: (_, val) => (
                      <span>{val.grupo}</span>
                    )
                  },
                  {
                    key: "semaforo",
                    label: "Estado",
                    render: (_, val) => {
                      const estado = val.semaforo;

                      return (
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            margin: "auto",
                            backgroundColor:
                              estado === "VERDE"
                                ? "#16a34a"
                                : estado === "AMARILLO"
                                ? "#eab308"
                                : "#dc2626"
                          }}
                        />
                      );
                    }
                  },
                                    
                ]}
                rows={estudiantesFiltrados}
                onRowClick={(f) => setFila(f)}
              />
            </div>
          ) : (
            <div className="status-message status-message--empty">
              Tu usuario no tiene permisos para acceder a este módulo.
            </div>))}
      </ModuleLayout>
            <PazYSalvoModal
              isOpen={modalVerPazSalvo}
              onClose={() => setModalVerPazSalvo(false)}
              estudiante={firmasDetalle}
              firmas={firmasDetalle?.firmas}
              selloUrl={selloUrl}
            />
            
    </div>

  );
};

export default RectoriaEstudiantes;