import TesoreriaDetalleComponent from './TesoreriaDetallecomponent'
import { Icon } from '@mdi/react';
import { mdiHome,  mdiHandCoin, mdiBookEducation, mdiNotebookEdit } from "@mdi/js";


const TesoreriaPapeleria = () => {
  const tipo= "papeleria";
  const selectedMenu = "Papeleria";
  const modulos = [
    { label: "Inicio", icon: <Icon path={mdiHome} />, path: "/home" },
    { label: "Matricula", icon: <Icon path={mdiHandCoin} />, path: "/Tesoreria/Matricula", roles: ["admin", "tesoreria"] },
    { label: "Pension", icon: <Icon path={mdiBookEducation} />, path: "/Tesoreria/Pension", roles: ["admin", "tesoreria"] },
    { label: "Papeleria", icon: <Icon path={mdiNotebookEdit} />, path: "/Tesoreria/Papeleria", roles: ["admin", "tesoreria"] },
  ];
  return (

    <div>
        <TesoreriaDetalleComponent tiporecibed={tipo} modulosRecibed={modulos} selectedMenu={selectedMenu} />
    </div>
  );
};

export default TesoreriaPapeleria;