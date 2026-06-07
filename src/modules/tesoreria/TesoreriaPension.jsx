import TesoreriaDetalleComponent from './TesoreriaDetallecomponent'
import { Icon } from '@mdi/react';
import { mdiHome,  mdiHandCoin, mdiBookEducation, mdiNotebookEdit  } from "@mdi/js";


const TesoreriaPension = () => {
  const tipo= "pension";
  const selectedMenu = "Pension";
  const modulos = [
    { label: "Inicio",  icon: <Icon path={mdiHome} />, path: "/home" },
    { label: "Matricula", icon: <Icon path={mdiHandCoin} />, path: "/Tesoreria/Matricula", roles: ["secretaria", "admin", "tesoreria"] },
    { label: "Pension", icon: <Icon path={mdiBookEducation} />, path: "/Tesoreria/Pension", roles: ["secretaria", "admin", "tesoreria"] },
    { label: "Papeleria", icon: <Icon path={mdiNotebookEdit} />, path: "/Tesoreria/Papeleria", roles: ["secretaria", "admin", "tesoreria"] },
  ];

  return (

    <div>
        <TesoreriaDetalleComponent tiporecibed={tipo} modulosRecibed={modulos} selectedMenu={selectedMenu} />
    </div>
  );
};

export default TesoreriaPension;