import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Code, 
  Sparkles, 
  ArrowRight, 
  Github, 
  ExternalLink, 
  Folder,
  Star,
  Play,
  Eye,
  Calendar
} from 'lucide-react';

function Projects({ handleSwitch }) {
  const [hoveredProject, setHoveredProject] = useState(null);

  const projects = [
    {
      id: 'todolist',
      title: 'Smart Todo List',
      description: 'A beautifully designed task management app with progress tracking and smooth animations.',
      tech: ['ReactJS', 'TailwindCSS', 'Framer Motion', 'LocalStorage'],
      color: 'from-purple-500 to-pink-500',
      icon: '✅',
      status: 'Live',
      category: 'Productivity'
    },
    {
      id: 'weather-app',
      title: 'Weather Dashboard',
      description: 'Real-time weather information with stunning visuals and location-based forecasts.',
      tech: ['React', 'API Integration', 'Geolocation'],
      color: 'from-blue-500 to-cyan-500',
      icon: '🌤️',
      status: 'Live',
      category: 'Utility'
    },
    {
      id: 'portfolio-site',
      title: 'Interactive Portfolio',
      description: 'This very website showcasing advanced animations and modern design principles.',
      tech: ['ReactJS', 'Glassmorphism & Animations using TailwindCSS'],
      color: 'from-emerald-500 to-teal-500',
      icon: '🎨',
      status: 'Live',
      category: 'Showcase'
    },
    {
      id: 'music-player',
      title: 'Ambient Music Player',
      description: 'Immersive music experience with visualizers and curated ambient soundscapes.',
      tech: ['Web Audio', 'Canvas', 'React'],
      color: 'from-orange-500 to-red-500',
      icon: '🎵',
      status: 'In Progress',
      category: 'Entertainment'
    },
    {
      id: 'code-editor',
      title: 'Mini Code Editor',
      description: 'Lightweight code editor with syntax highlighting and multiple language support.',
      tech: ['Monaco Editor', 'React', 'Syntax'],
      color: 'from-indigo-500 to-purple-500',
      icon: '💻',
      status: 'Live',
      category: 'Development'
    },
    {
      id: 'chat-app',
      title: 'Real-time Chat',
      description: 'Modern chat application with real-time messaging and beautiful UI design.',
      tech: ['WebSocket', 'React', 'Node.js'],
      color: 'from-pink-500 to-rose-500',
      icon: '💬',
      status: 'Coming Soon',
      category: 'Social'
    },
    {
      id: 'calculator',
      title: 'K-alculator',
      description: 'Complete UI Overhaul for our traditonal (K)Calculator.',
      tech: ['TalwindCSS', 'React'],
      color: 'from-pink-500 to-rose-500',
      icon: '🧮',
      status: 'Live',
      category: 'Utility'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live': return 'bg-green-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Coming Soon': return 'bg-blue-500';
      case 'Planning': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      id="projects" 
      className="min-h-screen relative overflow-hidden py-12 sm:py-16 md:py-20"
      style={{
        background: `
          linear-gradient(135deg, 
            #1e293b 0%, 
            #334155 25%, 
            #475569 50%, 
            #1e293b 75%, 
            #0f172a 100%)
        `
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 inline-block">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Folder size={48} className="text-white mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
              A collection of carefully crafted applications showcasing modern web technologies
            </p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onHoverStart={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
              className="group relative cursor-pointer"
              onClick={() => project.status === 'Live' && handleSwitch(project.id)}
            >
              {/* Glassmorphism Card */}
              <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`${getStatusColor(project.status)} w-3 h-3 rounded-full animate-pulse`} />
                </div>

                {/* Project Icon */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {project.icon}
                </div>

                {/* Project Info */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                      {project.title}
                    </h3>
                    <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-white/70 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`${getStatusColor(project.status)} w-2 h-2 rounded-full`} />
                      <span className="text-sm text-white/60">{project.status}</span>
                    </div>
                    
                    {project.status === 'Live' && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play size={16} className="text-white/70" />
                        <span className="text-sm text-white/70">Launch</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  animate={hoveredProject === project.id ? { 
                    background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)` 
                  } : {}}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 inline-block">
            <p className="text-white/70 mb-4">More projects coming soon!</p>
            <div className="flex items-center justify-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star size={20} className="text-yellow-400" />
              </motion.div>
              <span className="text-white/60">Stay tuned for exciting updates</span>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={20} className="text-purple-400" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Projects;