
import React, { useState, useEffect } from 'react';
import { allrolesuserRequest, allaniosacademicosRequest } from '../../api/endpoints';
import { allestudiantesbyperiodoRequest, allsalonesbyperiodoRequest, allmatriculasbyperiodoRequest, crearMatriculaRequest} from '../../api/endpointsTesoreria';

import { Home } from "lucide-react";
import { useAuth } from "../../api/useAuth";
import Header from "../../components/layout/header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";
import SearchBar from "../../components/shared/searchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";



const TesoreriaMatricula = () => {
  const [selectedMenu, setSelectedMenu] = useState("Matricula");
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
  const [salones, setSalones] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const rolespermitidos = ["secretaria", "admin", "tesoreria"]
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
    { label: "Inicio", icon: <Home />, path: "/Tesoreria" },
    { label: "Matricula", path: "/Tesoreria/Matricula", roles: ["secretaria", "admin", "tesoreria"] },
    { label: "Pension", path: "/Tesoreria/Pension", roles: ["secretaria", "admin", "tesoreria"] },
    { label: "Papeleria", path: "/Tesoreria/Papeleria", roles: ["secretaria", "admin", "tesoreria"] },
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

  //creación de matrícula
  const crearMatricula = async () => {
    if (!fila || !fila.id_estudiante) {
      console.error("No hay ningún estudiante seleccionado.");
      return;
    }
    try {
      await crearMatriculaRequest(
        Number(fila.id_estudiante),
        Number(salonesMap[fila.id_salon]?.id_periodo)
      );
      cargarMatriculas(salonesMap[fila.id_salon]?.id_periodo);
      setFila(null);
    } catch (error) {
      console.error("Error al crear la matrícula:", error);
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

  const cargarMatriculas = async (id_periodo) => {
    try {
      const res = await allmatriculasbyperiodoRequest(id_periodo);
      setMatriculas(res.data);
    } catch (error) {
      console.error("Error cargando matrículas:", error);
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

  useEffect(() => {
    cargarPeriodos();
  }, []);

  useEffect(() => {
    const idPeriodoActual = periodoMapname[filtros.Periodo]?.id_periodo;
    if (idPeriodoActual) {
      cargarEstudiantes(idPeriodoActual);
      cargarSalones(idPeriodoActual);
      cargarMatriculas(idPeriodoActual);
    }

  }, [filtros.Periodo]);


  //funcion para filtrar estudiantes según criterios de búsqueda
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
          selectedMenu={selectedMenu}
          user={{ nombre: userName, rol: rol }}
          onLogout={logout}
        />}
        actions={
          <ActionButtons
            filaSeleccionada={fila}
            botones={roles.some(rol => rolespermitidos.includes(rol)) ? [
              {
                label: "Validar Pago",
                onClick: () => { setModal(true); },
                siempreActivo: false, variante: "primary",
                disabled: matriculasMap[fila?.id_estudiante] || !periodoMapname[filtros.Periodo]?.activo ||
                  (fila && salonesMap[fila.id_salon]?.id_periodo !== periodoMapname[filtros.Periodo]?.id_periodo)
              },
            ] : []}
          />
        }
      >
        {cargandoRol || cargandoPeriodos ? (
          <div className="status-message status-message--loading">
            Cargando Modulo Matricula...
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
                key={`${matriculas}`}
                pageSize={10}
                columns={[
                  { key: "documento", label: "Documento" },
                  { key: "nombre", label: "Nombre" },
                  {
                    key: "grado", label: "Grado",
                    render: (_, val) => (
                      <span>{salonesMap[val.id_salon]?.grado}</span>
                    )
                  },
                  {
                    key: "grupo", label: "Grupo",
                    render: (_, val) => {

                      return (
                        <span>{salonesMap[val.id_salon]?.grupo}</span>)
                    }
                  },

                  {
                    key: "pago", label: "Pago",
                    render: (_, val) => {
                      const idEst = val.id_estudiante;
                      return (
                        <span className={matriculasMap[idEst]?.estado == 'activa' ? "badge--ok" : "badge--no"}>
                          {matriculasMap[idEst]?.estado  == 'activa' ? "Pagado" : matriculasMap[idEst]?.estado !== 'activa' && matriculasMap[idEst]?.estado !== undefined ? matriculasMap[idEst]?.estado : "Pendiente"}
                        </span>)
                    }
                  },
                  {
                    key: "fecha_pago", label: "Fecha de Pago",
                    render: (_, val) => {
                      const idEst = val.id_estudiante;
                      return (
                        <span>{matriculasMap[idEst]?.estado == 'activa' ? new Date(matriculasMap[idEst].created_at).toLocaleDateString() : "---"}</span>
                      )
                    }
                  }
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

      <Modal
        title={`¿Confirmas que el estudiante ${fila?.nombre || ""} ha realizado el pago de la matrícula?`}
        isOpen={modal}
        onAccept={() => { crearMatricula(); setModal(false); }}
        onCancel={() => setModal(false)}
      />
    </div>

  );
};

export default TesoreriaMatricula;