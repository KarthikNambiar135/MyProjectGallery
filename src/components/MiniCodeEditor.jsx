import React, { useState, useRef, useEffect } from 'react';
import { Play, Copy, Download, Settings, Code, FileText, Database, Globe, Terminal, X, Menu, ArrowLeft  } from 'lucide-react';

const MiniCodeEditor = ({onBack}) => {
  const [code, setCode] = useState(`// CodeWithK
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);
  
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [settings, setSettings] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const terminalRef = useRef(null);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);
  const highlightRef = useRef(null);

  const languages = {
    javascript: { name: 'JavaScript', icon: Code, color: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600' },
    python: { name: 'Python', icon: FileText, color: theme === 'dark' ? 'text-blue-400' : 'text-blue-600' },
    html: { name: 'HTML', icon: Globe, color: theme === 'dark' ? 'text-orange-400' : 'text-orange-600' },
    css: { name: 'CSS', icon: FileText, color: theme === 'dark' ? 'text-purple-400' : 'text-purple-600' },
    sql: { name: 'SQL', icon: Database, color: theme === 'dark' ? 'text-green-400' : 'text-green-600' },
    json: { name: 'JSON', icon: FileText, color: theme === 'dark' ? 'text-gray-400' : 'text-gray-600' }
  };

  const themeStyles = {
    dark: {
      background: "bg-gradient-to-br from-slate-900 via-gray-500-100 to-gray-600",
      header: "backdrop-blur-xl bg-white/10 border-white/20 text-white",
      editor: "backdrop-blur-xl bg-white/5 border-white/20",
      lineNumbers: "bg-white/5 border-white/10 text-gray-500",
      statusBar: "backdrop-blur-sm bg-white/5 border-white/10 text-gray-400",
      terminal: "backdrop-blur-xl bg-black/80 border-white/20",
      terminalHeader: "bg-gray-800/50 border-gray-700 text-white",
      terminalBody: "bg-black/20 text-gray-300",
      settings: "backdrop-blur-sm bg-white/5 border-white/10 text-white",
      text: "text-white",
      caret: "caret-white"
    },
    light: {
      background: "bg-gradient-to-br from-gray-400 via-white to-gray-400",
      header: "backdrop-blur-xl bg-black/5 border-gray-300 text-gray-900",
      editor: "backdrop-blur-xl bg-black/5 border-gray-300",
      lineNumbers: "bg-black/5 border-gray-300 text-gray-600",
      statusBar: "backdrop-blur-sm bg-black/5 border-gray-300 text-gray-700",
      terminal: "backdrop-blur-xl bg-white/90 border-gray-300",
      terminalHeader: "bg-gray-200/80 border-gray-300 text-gray-900",
      terminalBody: "bg-gray-50/80 text-gray-800",
      settings: "backdrop-blur-sm bg-black/5 border-gray-300 text-gray-900",
      text: "text-gray-900",
      caret: "caret-gray-900"
    }
  };

  const currentTheme = themeStyles[theme];

  const syntaxHighlight = (code, lang) => {
    const tokenize = (code, lang) => {
      const patterns = {
        javascript: [
          { pattern: /\b(function|const|let|var|if|else|for|while|return|class|import|export|async|await)\b/g, type: 'keyword' },
          { pattern: /\b(console|document|window)\b/g, type: 'builtin' },
          { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, type: 'string' },
          { pattern: /\/\/.*$/gm, type: 'comment' },
          { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment' },
          { pattern: /\b\d+\b/g, type: 'number' }
        ],
        python: [
          { pattern: /\b(def|class|if|elif|else|for|while|try|except|import|from|return|pass|break|continue)\b/g, type: 'keyword' },
          { pattern: /\b(print|len|str|int|float|list|dict|True|False|None)\b/g, type: 'builtin' },
          { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, type: 'string' },
          { pattern: /#.*$/gm, type: 'comment' },
          { pattern: /\b\d+\b/g, type: 'number' }
        ],
        html: [
          { pattern: /<\/?\w+[^>]*>/g, type: 'tag' },
          { pattern: /\w+(?==)/g, type: 'attribute' },
          { pattern: /"[^"]*"/g, type: 'string' },
          { pattern: /<!--[\s\S]*?-->/g, type: 'comment' }
        ],
        css: [
          { pattern: /[.#]?[\w-]+(?=\s*{)/g, type: 'selector' },
          { pattern: /[\w-]+(?=:)/g, type: 'property' },
          { pattern: /"[^"]*"|'[^']*'/g, type: 'string' },
          { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment' }
        ]
      };

      const matches = [];

      if (patterns[lang]) {
        patterns[lang].forEach(({ pattern, type }) => {
          let match;
          while ((match = pattern.exec(code)) !== null) {
            matches.push({
              start: match.index,
              end: match.index + match[0].length,
              text: match[0],
              type: type
            });
          }
          pattern.lastIndex = 0;
        });
      }

      // Sort matches by start position
      matches.sort((a, b) => a.start - b.start);

      // Remove overlapping matches (keep the first one)
      const filteredMatches = [];
      for (let i = 0; i < matches.length; i++) {
        const current = matches[i];
        const hasOverlap = filteredMatches.some(existing => 
          (current.start >= existing.start && current.start < existing.end) ||
          (current.end > existing.start && current.end <= existing.end)
        );
        if (!hasOverlap) {
          filteredMatches.push(current);
        } 
      }

      return { code, matches: filteredMatches };
    };

    return tokenize(code, lang);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleScroll = () => {
    if (highlightRef.current && editorRef.current) {
      highlightRef.current.scrollTop = editorRef.current.scrollTop;
      highlightRef.current.scrollLeft = editorRef.current.scrollLeft;
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  const downloadCode = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      html: 'html',
      css: 'css',
      sql: 'sql',
      json: 'json'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const runCode = () => {
    if (language === 'javascript') {
      try {
        const originalConsole = console.log;
        const logs = [];
        console.log = (...args) => {
          logs.push(args.join(' '));
        };

        new Function(code)();

        console.log = originalConsole;
        const outputStr = logs.join('\n');
        setOutput(outputStr);
        setShowTerminal(true);
      } catch (error) {
        const errMsg = 'Error: ' + error.message;
        setOutput(errMsg);
        setShowTerminal(true);
      }
    } else {
      const msg = 'Code execution is only available for JavaScript';
      setOutput(msg);
      setShowTerminal(true);
    }
  };

  const clearTerminal = () => {
    setOutput('');
  };

  const getSyntaxColors = (type) => {
    const colors = {
      dark: {
        keyword: 'text-purple-400 font-semibold',
        builtin: 'text-blue-400',
        string: 'text-green-400',
        comment: 'text-gray-500 italic',
        number: 'text-orange-400',
        tag: 'text-blue-400',
        attribute: 'text-purple-400',
        selector: 'text-blue-400',
        property: 'text-purple-400'
      },
      light: {
        keyword: 'text-purple-700 font-semibold',
        builtin: 'text-blue-700',
        string: 'text-green-700',
        comment: 'text-gray-500 italic',
        number: 'text-orange-700',
        tag: 'text-blue-700',
        attribute: 'text-purple-700',
        selector: 'text-blue-700',
        property: 'text-purple-700'
      }
    };
    return colors[theme][type] || currentTheme.text;
  };

  const LanguageIcon = languages[language].icon;

  return (
    <div className={`min-h-screen ${currentTheme.background} p-2 sm:p-4 lg:p-6`}>
      <button
        onClick={onBack}
        className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 inline-flex items-center gap-2"
    >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        <span className="text-sm text-gray-700 sm:hidden">Back</span>
    </button>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${currentTheme.header} rounded-t-2xl border p-3 sm:p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              </div>
              <h1 className={`${currentTheme.text} font-semibold text-sm sm:text-lg`}>Mini Code Editor</h1>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`backdrop-blur-sm ${theme === 'dark' ? 'bg-white/10 text-white border-white/20' : 'bg-black/10 text-gray-900 border-gray-400'} border rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300`}
                >
                  {Object.entries(languages).map(([key, lang]) => (
                    <option key={key} value={key} className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <LanguageIcon className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${languages[language].color} pointer-events-none`} />
              </div>

              {/* Action Buttons */}
              <button
                onClick={runCode}
                className={`backdrop-blur-sm ${theme === 'dark' ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-400/30' : 'bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-500/30'} border rounded-lg px-3 py-2 transition-all duration-300 flex items-center gap-2`}
              >
                <Play className="w-4 h-4" />
                Run
              </button>
              
              <button
                onClick={copyCode}
                className={`backdrop-blur-sm ${theme === 'dark' ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-400/30' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-500/30'} border rounded-lg px-3 py-2 transition-all duration-300 flex items-center gap-2`}
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              
              <button
                onClick={downloadCode}
                className={`backdrop-blur-sm ${theme === 'dark' ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-400/30' : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 border-purple-500/30'} border rounded-lg px-3 py-2 transition-all duration-300 flex items-center gap-2`}
              >
                <Download className="w-4 h-4" />
                Save
              </button>

              <button
                onClick={() => setSettings(!settings)}
                className={`backdrop-blur-sm ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-black/10 hover:bg-black/20 text-gray-900 border-gray-400'} border rounded-lg px-3 py-2 transition-all duration-300`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden backdrop-blur-sm ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-black/10 hover:bg-black/20 text-gray-900 border-gray-400'} border rounded-lg p-2 transition-all duration-300`}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Controls */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-3">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full backdrop-blur-sm ${theme === 'dark' ? 'bg-white/10 text-white border-white/20' : 'bg-black/10 text-gray-900 border-gray-400'} border rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300`}
                >
                  {Object.entries(languages).map(([key, lang]) => (
                    <option key={key} value={key} className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <LanguageIcon className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${languages[language].color} pointer-events-none`} />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={runCode}
                  className={`backdrop-blur-sm ${theme === 'dark' ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-400/30' : 'bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-500/30'} border rounded-lg px-3 py-2 transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  <Play className="w-4 h-4" />
                  Run
                </button>
                
                <button
                  onClick={copyCode}
                  className={`backdrop-blur-sm ${theme === 'dark' ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-400/30' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-500/30'} border rounded-lg px-3 py-2 transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                
                <button
                  onClick={downloadCode}
                  className={`backdrop-blur-sm ${theme === 'dark' ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-400/30' : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 border-purple-500/30'} border rounded-lg px-3 py-2 transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  <Download className="w-4 h-4" />
                  Save
                </button>

                <button
                  onClick={() => setSettings(!settings)}
                  className={`backdrop-blur-sm ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-black/10 hover:bg-black/20 text-gray-900 border-gray-400'} border rounded-lg px-3 py-2 transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {settings && (
            <div className={`mt-4 ${currentTheme.settings} rounded-lg p-4 border transition-all duration-500`}>
              <h3 className={`${currentTheme.text} font-medium mb-3`}>Editor Settings</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className={`flex items-center gap-2 ${currentTheme.text}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.value)}
                    className="accent-purple-400"
                  />
                  Dark Theme
                </label>
                <label className={`flex items-center gap-2 ${currentTheme.text}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={(e) => setTheme(e.target.value)}
                    className="accent-purple-400"
                  />
                  Light Theme
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className={`relative ${currentTheme.editor} border-l border-r border-b border overflow-hidden`}>
          {/* Line Numbers */}
          <div className="flex">
            <div className={`${currentTheme.lineNumbers} border-r border p-2 sm:p-4 select-none`}>
              {code.split('\n').map((_, index) => (
                <div key={index} className="text-xs sm:text-sm leading-5 sm:leading-6 text-right w-6 sm:w-8">
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
              {/* Syntax Highlighting Layer */}
              <div
                ref={highlightRef}
                className="absolute inset-0 p-2 sm:p-4 text-xs sm:text-sm leading-5 sm:leading-6 font-mono pointer-events-none overflow-auto whitespace-pre-wrap break-words"
              >
                {(() => {
                  const { code: codeText, matches } = syntaxHighlight(code, language);
                  const lines = codeText.split('\n');
                  let globalOffset = 0;
                  
                  return lines.map((line, lineIndex) => {
                    const lineStart = globalOffset;
                    const lineEnd = globalOffset + line.length;
                    const lineMatches = matches.filter(match => 
                      match.start >= lineStart && match.start < lineEnd
                    );
                    
                    let renderedLine = [];
                    let lastEnd = lineStart;
                    
                    lineMatches.forEach((match) => {
                      // Add text before match
                      if (match.start > lastEnd) {
                        renderedLine.push(
                          <span key={`text-${match.start}`} className={currentTheme.text}>
                            {codeText.slice(lastEnd, match.start)}
                          </span>
                        );
                      }
                      
                      // Add highlighted match
                      const className = getSyntaxColors(match.type);
                      
                      renderedLine.push(
                        <span key={`match-${match.start}`} className={className}>
                          {match.text}
                        </span>
                      );
                      
                      lastEnd = match.end;
                    });
                    
                    // Add remaining text
                    if (lastEnd < lineEnd) {
                      renderedLine.push(
                        <span key={`text-end-${lineEnd}`} className={currentTheme.text}>
                          {codeText.slice(lastEnd, lineEnd)}
                        </span>
                      );
                    }
                    
                    globalOffset = lineEnd + 1; // +1 for newline
                    
                    return (
                      <div key={lineIndex}>
                        {renderedLine.length > 0 ? renderedLine : <span className={currentTheme.text}>{line}</span>}
                        {lineIndex < lines.length - 1 && '\n'}
                      </div>
                    );
                  });
                })()}
              </div>
              {/* Input Layer */}
              <textarea
                ref={editorRef}
                value={code}
                onChange={handleCodeChange}
                onScroll={handleScroll}
                className={`w-full h-64 sm:h-80 lg:h-96 p-2 sm:p-4 text-xs sm:text-sm leading-5 sm:leading-6 font-mono bg-transparent text-transparent ${currentTheme.caret} resize-none outline-none overflow-auto whitespace-pre-wrap break-words`}
                style={{ margin: 0 }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>

          {/* Status Bar */}
          <div className={`${currentTheme.statusBar} border-t border px-2 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm gap-2 sm:gap-0`}>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="flex items-center gap-2">
                <LanguageIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${languages[language].color}`} />
                {languages[language].name}
              </span>
              <span>Lines: {code.split('\n').length}</span>
              <span>Chars: {code.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>

        {/* Terminal */}
        {showTerminal && (
          <div className={`${currentTheme.terminal} border rounded-b-2xl overflow-hidden`}>
            <div className={`flex items-center justify-between p-2 ${currentTheme.terminalHeader} border-b`}>
              <div className={`flex items-center gap-2 ${currentTheme.text}`}>
                <Terminal className="w-4 h-4" />
                <span className="text-sm font-medium">Terminal</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={clearTerminal}
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} px-2 py-1 text-xs transition-colors`}
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowTerminal(false)}
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-1 transition-colors`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div
              ref={terminalRef}
              className={`p-2 sm:p-4 h-32 sm:h-48 overflow-auto font-mono text-xs sm:text-sm ${currentTheme.terminalBody}`}
            >
              <div className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mb-2`}>$ Running {languages[language].name} code...</div>
              <pre className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} whitespace-pre-wrap`}>{output}</pre>
              {output && <div className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mt-2`}>$ Process completed</div>}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>
            Built with React & Tailwind CSS • Supports JavaScript, Python, HTML, CSS, SQL & JSON
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniCodeEditor;