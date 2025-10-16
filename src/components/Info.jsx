function Info() {
  const nombre = "Alejandro Medina";
  const rol = "Ingeniera Informática";
  const descripcion = "Creando experiencias web modernas y soluciones eficientes";

  return (
    <section>
      <h1>{nombre}</h1>
      <h2>{rol}</h2>
      <p>{descripcion}</p>
      <button>Ver mis proyectos</button>
    </section>
  );
}

export default Info;