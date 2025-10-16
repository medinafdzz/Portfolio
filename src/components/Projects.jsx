import ProjectCard from './ProjectCard';

function Projects() {
  return (
    <section>
      <h2>Mis Proyectos</h2>
      
      <ProjectCard 
        titulo="QR Generator"
        descripcion="Generador de códigos QR en línea"
        tecnologia="HTML, CSS, JavaScript"
      />
      
      <ProjectCard 
        titulo="Cleaning robot py"
        descripcion="Simulación de un robot de limpieza en python"
        tecnologia="Python"
      />
      
      <ProjectCard 
        titulo="Remote Wordle"
        descripcion="Aplicación web para jugar Wordle multijugador de forma remota "
        tecnologia="Java"
      />
    </section>
  );
}

export default Projects;