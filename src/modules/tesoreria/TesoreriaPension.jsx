import TesoreriaDetalleComponent from './TesoreriaDetallecomponent'



const TesoreriaPension = () => {
  const tipo= "Pension"
  return (

    <div>
        <TesoreriaDetalleComponent tiporecibed={tipo} />
    </div>
  );
};

export default TesoreriaPension;