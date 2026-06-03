import TesoreriaDetalleComponent from './TesoreriaDetallecomponent'
import { Home } from "lucide-react";


const TesoreriaPapeleria = () => {
  const tipo= "papeleria";
  const selectedMenu = "Papeleria";
  const modulos = [
    { label: "Inicio", icon: <Home />, path: "/Tesoreria" },
    { label: "Matricula", path: "/Tesoreria/Matricula", roles: ["secretaria", "admin", "tesoreria"] },
    { label: "Pension", path: "/Tesoreria/Pension", roles: ["secretaria", "admin", "tesoreria"] },
    { label: "Papeleria", path: "/Tesoreria/Papeleria", roles: ["secretaria", "admin", "tesoreria"] },
  ];
  return (

    <div>
        <TesoreriaDetalleComponent tiporecibed={tipo} modulosRecibed={modulos} selectedMenu={selectedMenu} />
    </div>
  );
};

export default TesoreriaPapeleria;