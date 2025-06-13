import { useState } from 'react'
import LoadingAnimation from './components/LoadingAnimation'
import Home from './components/Home'
import Projects from './components/Projects'
import ToDoList from './components/ToDoList'
import NavBar from './components/NavBar.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [transitioning, setTransitioning] = useState(false)

  const handleSwitch = (page) => {
    if (page === currentPage || transitioning) return
    // window.scrollTo({ top: 0, behavior: 'instant' });
    setTransitioning(true)

    setTimeout(() => {
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
    if (currentPage === "todolist") return <ToDoList onBack={handleBack} />;
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