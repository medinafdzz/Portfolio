import Header from './components/Header';

function App() {
  const nombre = "Tu Nombre";
  const profesion = "Desarrollador Web";
  
  return (
    <div>
      <Header />
      <h1>{nombre} - {profesion}</h1>
      <p>Bienvenido a mi portfolio</p>
    </div>
  );
}

export default App;