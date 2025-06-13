import React, { useState, useEffect } from 'react';
import { Home, User, FolderOpen, Code, Mail } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
];

function NavBar() {
  const [active, setActive] = useState('home');

  const handleScroll = (id) => {
    setActive(id);
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSection = 'home';
      navItems.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
          const { top, bottom } = section.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          const absoluteBottom = bottom + window.scrollY;
           if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            currentSection = id;
          }
        }
      });
      setActive(currentSection);
    };
    window.addEventListener('scroll', handleScrollEvent);
    handleScrollEvent();
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  return (
    <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center justify-center px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl shadow-black/20">
        {navItems.map(({ id, label, icon: Icon }, index) => (
          <div key={id} className="relative group">
            <button
              className={`relative p-3 mx-1 rounded-full transition-all duration-300 ease-out transform hover:scale-110 ${
                active === id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => handleScroll(id)}
            >
              <Icon size={20} />
              
              {/* Active indicator dot */}
              {active === id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
            
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default NavBar;