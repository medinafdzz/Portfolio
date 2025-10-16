function ProjectCard(props) {
  return (
    <div>
      <h3>{props.titulo}</h3>
      <p>{props.descripcion}</p>
      <p>Tecnología: {props.tecnologia}</p>
    </div>
  );
}

export default ProjectCard;