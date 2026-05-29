import TesoreriaDetalleComponent from './TesoreriaDetallecomponent'



const TesoreriaPapeleria = () => {
  const tipo= "Papeleria"
  return (

    <div>
        <TesoreriaDetalleComponent tiporecibed={tipo} />
    </div>
  );
};

export default TesoreriaPapeleria;