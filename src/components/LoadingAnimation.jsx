import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";

const colors1 = [
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-indigo-400 to-indigo-600",
]

const colors2 = [
  "bg-gradient-to-br from-cyan-400 to-cyan-600",
  "bg-gradient-to-br from-teal-400 to-teal-600",
  "bg-gradient-to-br from-emerald-400 to-emerald-600",
];

function LoadingAnimation() {
    const [expanded, setExpanded] = useState(false);
    const [origin, setOrigin] = useState("top");
    
    useEffect(() => {
      setExpanded(true);
    
        const timeOut2 = setTimeout(() => {
            setOrigin("bottom");
            setExpanded(false);
        }, 1500);

        return () => {
            clearTimeout(timeOut2);
        };
    }, []);

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden">
      <div className="grid grid-cols-6 gap-0 h-screen">
        {colors1.map((color, i) => (
            <motion.div
            key={i}
            className={`h-[100vh] ${color} ${origin === "top" ? "origin-top" : "origin-bottom"}
                        backdrop-blur-md border border-white/10 
                        shadow-2xl shadow-blue-500/20
                        relative overflow-hidden`}
            initial={{ scaleY: 0, }}
            animate={{ scaleY: expanded ? 1 : 0}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94]}}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent"></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                           transform -skew-x-12 animate-pulse"></div>
            </motion.div>
        ))}
        {colors2.map((color, i) => {
            const reverseIndex = colors2.length - 1 - i;
            return(
            <motion.div
            key={i}
            className={`h-[100vh] ${color} ${origin === "top" ? "origin-bottom" : "origin-top"}
                        backdrop-blur-md border border-white/10 
                        shadow-2xl shadow-cyan-500/20
                        relative overflow-hidden`}
            initial={{ scaleY: 0, }}
            animate={{ scaleY: expanded ? 1 : 0}}
            transition={{ duration: 0.5, delay: reverseIndex * 0.1 , ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent 
                           transform skew-x-12 animate-pulse"></div>
            </motion.div>
        );
        })}
    </div>
    </div>
  );
}

export default LoadingAnimation;
