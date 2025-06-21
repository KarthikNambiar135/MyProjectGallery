import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const BUTTONS = {
  top: ['AC', '⌫'],
  basic: [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ],
  scientific: [
    ['sin', 'cos', 'tan', '√'],
    ['^', 'log', '(', ')'],
    ['π', 'e', '%']
  ]
};

const themes = {
  dark: {
    bg: 'bg-black text-white',
    card: 'bg-white/10 border-white/10',
    display: 'bg-black/20 border-cyan-400/40 text-cyan-100',
    expression: 'text-purple-300',
    button: 'bg-white/10 hover:bg-white/20 text-white border-white/10',
    control: 'bg-white/10 hover:bg-white/20'
  },
  light: {
    bg: 'bg-white text-black',
    card: 'bg-black/5 border-black/10',
    display: 'bg-white text-black border-black/20',
    expression: 'text-gray-600',
    button: 'bg-black/10 hover:bg-black/20 text-black border-black/10',
    control: 'hover:bg-black/20 text-black border-none'
  }
};

export default function Calculator({onBack}) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [finalized, setFinalized] = useState(false);
  const [mode, setMode] = useState('basic');
  const [theme, setTheme] = useState('dark');
  const [errorShake, setErrorShake] = useState(false);
  const inputRef = useRef(null);

  const isScientific = mode === 'scientific';

  const toggleMode = () => setMode(prev => (prev === 'basic' ? 'scientific' : 'basic'));
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const evaluateExpression = (expr) => {
    try {
      const replaced = expr
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E)
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/√/g, 'Math.sqrt')
        .replace(/(\d+(\.\d+)?)\s*\^\s*(\d+(\.\d+)?)/g, 'Math.pow($1, $3)');
      const evaluated = Function('return ' + replaced)();
      if (isNaN(evaluated) || !isFinite(evaluated)) throw new Error('Invalid');
      return evaluated;
    } catch {
      return 'Error';
    }
  };

  const handleClick = (value) => {
    const input = inputRef.current;
    const cursorPos = input?.selectionStart || expression.length;

    if (value === '=') {
      const res = evaluateExpression(expression);
      if (res === 'Error') {
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 400);
        return;
      }
      setExpression(res.toString());
      setResult('');
      setFinalized(true);
    } else if (value === 'C' || value === 'AC') {
      setExpression('');
      setResult('');
      setFinalized(false);
    } else if (value === '⌫' || value === 'Backspace') {
      if (finalized) {
        setExpression('');
        setResult('');
        setFinalized(false);
        return;
      }
      const newExpr = expression.slice(0, cursorPos - 1) + expression.slice(cursorPos);
      setExpression(newExpr);
      setTimeout(() => {
        if (input) {
          const newCursor = cursorPos - 1;
          input.selectionStart = input.selectionEnd = newCursor >= 0 ? newCursor : 0;
          input.focus();
        }
      }, 0);
      if (newExpr.trim() === '') setResult('');
    } else {
      if (finalized) {
        const res = evaluateExpression(expression);
        if (res === 'Error') return;
        const newExpr = res.toString() + value;
        setExpression(newExpr);
        setResult('');
        setFinalized(false);
        setTimeout(() => {
          if (input) {
            const cursor = newExpr.length;
            input.selectionStart = input.selectionEnd = cursor;
            input.focus();
          }
        }, 0);
      } else {
        insertAtCursor(value);
      }
    }
  };

  const insertAtCursor = (text) => {
    const input = inputRef.current;
    const start = input?.selectionStart || 0;
    const end = input?.selectionEnd || 0;
    const newExpr = expression.slice(0, start) + text + expression.slice(end);
    setExpression(newExpr);
    setTimeout(() => {
      if (input) {
        const cursor = start + text.length;
        input.selectionStart = input.selectionEnd = cursor;
        input.focus();
      }
    }, 0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const allowedKeys = '0123456789+-*/.=()%^';
      if (allowedKeys.includes(key)) {
        e.preventDefault();
        handleClick(key);
      } else if (key === 'Enter') {
        e.preventDefault();
        handleClick('=');
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleClick('Backspace');
      } else if (key.toLowerCase() === 'c') {
        handleClick('AC');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, finalized]);

  useEffect(() => {
    if (!finalized && expression.trim() !== '') {
      const live = evaluateExpression(expression);
      if (live !== 'Error') setResult(live);
      else setResult('');
    } else if (expression.trim() === '') {
      setResult('');
    }
  }, [expression, finalized]);

  const currentTheme = themes[theme];
  const buttonSet = [...BUTTONS.basic, ...(isScientific ? BUTTONS.scientific : [])];

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${currentTheme.bg}`}>
      <button
              onClick={onBack}
              className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 inline-flex items-center gap-2"
          >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              <span className="text-sm text-gray-700 sm:hidden">Back</span>
          </button>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`rounded-2xl shadow-xl p-6 w-full max-w-sm sm:max-w-md backdrop-blur border ${currentTheme.card} ${errorShake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
        style={{ animationName: errorShake ? 'shake' : 'none' }}
      >
        <style>
          {`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20%, 60% { transform: translateX(-4px); }
              40%, 80% { transform: translateX(4px); }
            }
          `}
        </style>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">K(C)alculator</h2>
          <div className="flex gap-2">
            <button onClick={toggleMode} className={`text-sm px-2 py-1 rounded transition ${currentTheme.control}`}>{mode}</button>
            <button onClick={toggleTheme} className={`text-sm px-2 py-1 rounded transition ${currentTheme.control}`}>{theme}</button>
          </div>
        </div>

        <div className={`rounded-xl p-4 mb-4 border font-mono ${currentTheme.display}`}>
          <input
            ref={inputRef}
            className="w-full bg-transparent outline-none text-3xl font-bold text-right"
            value={expression}
            onChange={(e) => {
              setExpression(e.target.value);
              setResult('');
              setFinalized(false);
            }}
          />
          <div className={`text-right text-sm mt-2 ${currentTheme.expression}`}>{!finalized && result !== '' ? result : ' '}</div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-2">
          {BUTTONS.top.map((btn, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick(btn)}
              className={`py-3 rounded-lg text-center text-lg font-semibold transition border ${currentTheme.button}`}
            >
              {btn}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-2">
          {buttonSet.flat().map((btn, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick(btn)}
              className={`py-3 rounded-lg text-center text-lg font-semibold transition border ${currentTheme.button}`}
            >
              {btn}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}