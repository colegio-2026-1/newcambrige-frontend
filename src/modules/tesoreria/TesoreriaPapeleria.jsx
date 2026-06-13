import TesoreriaDetalleComponent from './TesoreriaDetallecomponent'
import { Icon } from '@mdi/react';
import { mdiHome,  mdiHandCoin, mdiBookEducation, mdiNotebookEdit } from "@mdi/js";


const TesoreriaPapeleria = () => {
  const tipo= "papeleria";
  const selectedMenu = "Papelería";
  const modulos = [
    { label: "Inicio", icon: <Icon path={mdiHome} />, path: "/home" },
    { label: "Matrícula", icon: <Icon path={mdiHandCoin} />, path: "/Tesoreria/Matricula", roles: ["admin", "tesoreria"] },
    { label: "Pensión", icon: <Icon path={mdiBookEducation} />, path: "/Tesoreria/Pension", roles: ["admin", "tesoreria"] },
    { label: "Papelería", icon: <Icon path={mdiNotebookEdit} />, path: "/Tesoreria/Papeleria", roles: ["admin", "tesoreria"] },
  ];
  return (

    <div>
        <TesoreriaDetalleComponent tiporecibed={tipo} modulosRecibed={modulos} selectedMenu={selectedMenu} />
    </div>
  );
};

export default TesoreriaPapeleria;