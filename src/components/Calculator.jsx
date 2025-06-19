import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [theme, setTheme] = useState('neon');
  const [isScientific, setIsScientific] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  const themes = {
    neon: {
      bg: 'from-slate-900 via-purple-900 to-slate-900',
      card: 'bg-black/40 border-purple-500/30',
      display: 'bg-gray-900/80 border-cyan-400/40 text-cyan-100',
      expression: 'text-purple-300',
      number: 'bg-gray-800/80 hover:bg-gray-700 text-white border-gray-600/50',
      operator: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-purple-500/50',
      operatorActive: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/50',
      equals: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-500/50',
      function: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-indigo-500/50',
      clear: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white border-red-500/50'
    },
    minimal: {
      bg: 'from-gray-100 to-white',
      card: 'bg-white/90 border-gray-300',
      display: 'bg-gray-50 border-gray-300 text-gray-900',
      expression: 'text-gray-600',
      number: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200 shadow-sm',
      operator: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400',
      operatorActive: 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-400 shadow-lg shadow-blue-400/30',
      equals: 'bg-green-500 hover:bg-green-600 text-white border-green-400',
      function: 'bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-400',
      clear: 'bg-red-500 hover:bg-red-600 text-white border-red-400'
    },
    dark: {
      bg: 'from-gray-900 to-black',
      card: 'bg-gray-800/50 border-gray-700',
      display: 'bg-black/60 border-green-500/40 text-green-100',
      expression: 'text-gray-400',
      number: 'bg-gray-700/80 hover:bg-gray-600 text-white border-gray-600',
      operator: 'bg-orange-600 hover:bg-orange-500 text-white border-orange-500',
      operatorActive: 'bg-orange-500 hover:bg-orange-400 text-white ring-2 ring-orange-400 shadow-lg shadow-orange-400/50',
      equals: 'bg-green-600 hover:bg-green-500 text-white border-green-500',
      function: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500',
      clear: 'bg-red-600 hover:bg-red-500 text-white border-red-500'
    }
  };

  const currentTheme = themes[theme];

  // Three.js background setup
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create subtle floating particles
    const particles = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: theme === 'neon' ? 0x8b5cf6 : theme === 'minimal' ? 0x6366f1 : 0x10b981,
      size: 0.5,
      transparent: true,
      opacity: 0.6
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 20;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      particleSystem.rotation.x += 0.001;
      particleSystem.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    };

    animate();

    sceneRef.current = scene;
    rendererRef.current = renderer;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  const calculate = (firstOperand, secondOperand, operation) => {
    switch (operation) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '×': return firstOperand * secondOperand;
      case '÷': return secondOperand !== 0 ? firstOperand / secondOperand : 0;
      case '%': return firstOperand % secondOperand;
      case '^': return Math.pow(firstOperand, secondOperand);
      default: return secondOperand;
    }
  };

  const formatDisplay = (value) => {
    if (value.toString().length > 12) {
      return parseFloat(value).toExponential(6);
    }
    return value.toString();
  };

  const handleNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setExpression(`${formatDisplay(inputValue)} ${nextOperator}`);
    } else if (operation && !waitingForOperand) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      
      setDisplay(formatDisplay(newValue));
      setPreviousValue(newValue);
      setExpression(`${formatDisplay(newValue)} ${nextOperator}`);
    } else {
      setExpression(`${formatDisplay(previousValue)} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperator);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const result = formatDisplay(newValue);
      
      setDisplay(result);
      setExpression(`${formatDisplay(previousValue)} ${operation} ${formatDisplay(inputValue)} =`);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setExpression('');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleFunction = (func) => {
    const inputValue = parseFloat(display);
    let result;

    switch (func) {
      case 'sin': result = Math.sin(inputValue * Math.PI / 180); break;
      case 'cos': result = Math.cos(inputValue * Math.PI / 180); break;
      case 'tan': result = Math.tan(inputValue * Math.PI / 180); break;
      case 'log': result = Math.log10(inputValue); break;
      case 'ln': result = Math.log(inputValue); break;
      case 'sqrt': result = Math.sqrt(inputValue); break;
      case '1/x': result = inputValue !== 0 ? 1 / inputValue : 0; break;
      case 'x²': result = inputValue * inputValue; break;
      case 'π': result = Math.PI; break;
      case 'e': result = Math.E; break;
      default: result = inputValue;
    }

    setDisplay(formatDisplay(result));
    setExpression(`${func}(${formatDisplay(inputValue)})`);
    setWaitingForOperand(true);
  };

  const Button = ({ onClick, className = '', children, variant = 'number', isActive = false }) => {
    const baseClasses = "h-14 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 border";
    
    let variantClasses = currentTheme.number;
    if (variant === 'operator') {
      variantClasses = isActive ? currentTheme.operatorActive : currentTheme.operator;
    } else if (variant === 'equals') {
      variantClasses = currentTheme.equals;
    } else if (variant === 'function') {
      variantClasses = currentTheme.function;
    } else if (variant === 'clear') {
      variantClasses = currentTheme.clear;
    }

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} flex items-center justify-center p-4 relative`}>
      {/* Three.js Background */}
      <div ref={mountRef} className="fixed inset-0 -z-10" />
      
      {/* Controls */}
      <div className="absolute top-6 right-6 flex gap-4 z-20">
        <button
          onClick={() => setIsScientific(!isScientific)}
          className={`px-4 py-2 rounded-lg backdrop-blur-sm border ${currentTheme.card} text-red-500 hover:bg-white/10 transition-colors`}
        >
          {isScientific ? 'Basic' : 'Scientific'}
        </button>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={`px-4 py-2 rounded-lg backdrop-blur-sm border ${currentTheme.card} text-red-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400/50`}
        >
          <option value="neon" className="bg-gray-800">Neon</option>
          <option value="minimal" className="bg-gray-800">Minimal</option>
          <option value="dark" className="bg-gray-800">Dark</option>
        </select>
      </div>

      {/* Calculator Container */}
      <div className={`backdrop-blur-xl border rounded-3xl p-6 shadow-2xl max-w-md w-full ${currentTheme.card}`}>
        
        {/* Display */}
        <div className={`rounded-2xl p-6 mb-6 border ${currentTheme.display}`}>
          {/* Expression Line */}
          <div className={`text-right text-sm ${currentTheme.expression} h-6 mb-2 font-mono`}>
            {expression || ' '}
          </div>
          {/* Main Display */}
          <div className="text-right text-4xl font-mono font-bold tracking-wider min-h-[3rem] flex items-center justify-end">
            {display}
          </div>
        </div>

        {/* Scientific Functions (if enabled) */}
        {isScientific && (
          <>
            <div className="grid grid-cols-5 gap-2 mb-4">
              <Button onClick={() => handleFunction('sin')} variant="function" className="text-xs">sin</Button>
              <Button onClick={() => handleFunction('cos')} variant="function" className="text-xs">cos</Button>
              <Button onClick={() => handleFunction('tan')} variant="function" className="text-xs">tan</Button>
              <Button onClick={() => handleFunction('log')} variant="function" className="text-xs">log</Button>
              <Button onClick={() => handleFunction('ln')} variant="function" className="text-xs">ln</Button>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-4">
              <Button onClick={() => handleFunction('sqrt')} variant="function" className="text-xs">√</Button>
              <Button onClick={() => handleFunction('x²')} variant="function" className="text-xs">x²</Button>
              <Button onClick={() => handleFunction('1/x')} variant="function" className="text-xs">1/x</Button>
              <Button onClick={() => handleFunction('π')} variant="function" className="text-xs">π</Button>
              <Button onClick={() => handleFunction('e')} variant="function" className="text-xs">e</Button>
            </div>
          </>
        )}

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button onClick={handleClear} variant="clear">AC</Button>
          <Button onClick={handleBackspace} variant="function">⌫</Button>
          <Button onClick={() => handleOperator('%')} variant="operator" isActive={operation === '%'}>%</Button>
          <Button onClick={() => handleOperator('÷')} variant="operator" isActive={operation === '÷'}>÷</Button>

          {/* Row 2 */}
          <Button onClick={() => handleNumber(7)}>7</Button>
          <Button onClick={() => handleNumber(8)}>8</Button>
          <Button onClick={() => handleNumber(9)}>9</Button>
          <Button onClick={() => handleOperator('×')} variant="operator" isActive={operation === '×'}>×</Button>

          {/* Row 3 */}
          <Button onClick={() => handleNumber(4)}>4</Button>
          <Button onClick={() => handleNumber(5)}>5</Button>
          <Button onClick={() => handleNumber(6)}>6</Button>
          <Button onClick={() => handleOperator('-')} variant="operator" isActive={operation === '-'}>−</Button>

          {/* Row 4 */}
          <Button onClick={() => handleNumber(1)}>1</Button>
          <Button onClick={() => handleNumber(2)}>2</Button>
          <Button onClick={() => handleNumber(3)}>3</Button>
          <Button onClick={() => handleOperator('+')} variant="operator" isActive={operation === '+'}>+</Button>

          {/* Row 5 */}
          <Button onClick={() => handleNumber(0)} className="col-span-2">0</Button>
          <Button onClick={handleDecimal}>.</Button>
          <Button onClick={handleEquals} variant="equals">=</Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;