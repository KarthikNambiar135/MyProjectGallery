import { useState } from 'react'
import LoadingAnimation from './components/LoadingAnimation'
import Home from './components/Home'
import Projects from './components/Projects'
import ToDoList from './components/ToDoList'
import NavBar from './components/NavBar.jsx';
import Weather from './components/Weather'
import MiniCodeEditor from './components/MiniCodeEditor.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [transitioning, setTransitioning] = useState(false)

  const handleSwitch = (page) => {
    if (page === currentPage || transitioning) return
    // window.scrollTo({ top: 0, behavior: 'instant' });
    setTransitioning(true)

    setTimeout(() => {
      if (page === "portfolio-site") {
      window.open("https://kode-with-k.vercel.app/", "_blank");
      return}
      setCurrentPage(page)
    }, 1500)

    setTimeout(() => {
      setTransitioning(false)
    }, 3000)
  }

  const handleBack = () => {
    handleSwitch("home");
  }

  const renderPage = () => {
    if (currentPage === "weather-app") return <Weather onBack={handleBack} />;
    if (currentPage === "todolist") return <ToDoList onBack={handleBack} />;
    if (currentPage === "code-editor") return <MiniCodeEditor onBack={handleBack} />;
    if (currentPage === "home") return (
      <>
        <NavBar />
        <div className="sections">
          <Home />
          <Projects handleSwitch={handleSwitch} />
        </div>
      </>
    );
    return null;
  };
  return (
     <div className="relative overflow-hidden">
      {renderPage()}
      {transitioning && (
        <div className="absolute inset-0 z-[999] pointer-events-none">
          <LoadingAnimation />
        </div>
      )}
    </div>
  );
}


export default App