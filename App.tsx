import React, { useState, useRef, useEffect } from 'react';
import { Eraser, AlertCircle, Wand2, ChevronDown } from 'lucide-react';
import { correctText } from './services/geminiService';
import { AppStatus, CorrectionResult, Tone } from './types';
import { config } from './config';
import Button from './components/Button';
import ResultCard from './components/ResultCard';

const TONES: Tone[] = ['Professional', 'Casual', 'Concise', 'Friendly'];

// Feather Pen Logo Component
const FeatherLogo = ({ className }: { className?: string }) => (
  <img
    src="/images/download.png"
    alt="Clarify Logo"
    className={className}
  />
);

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('Professional');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus the textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= config.maxInputLength) {
      setInputText(text);
      // Reset status if user starts typing a new sentence after a success/error
      if (status === AppStatus.SUCCESS || status === AppStatus.ERROR) {
        setStatus(AppStatus.IDLE);
        setResult(null);
        setErrorMsg(null);
      }
    }
  };

  const handleClear = () => {
    setInputText('');
    setStatus(AppStatus.IDLE);
    setResult(null);
    setErrorMsg(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    setStatus(AppStatus.LOADING);
    setErrorMsg(null);

    try {
      const correctedText = await correctText(inputText, selectedTone);
      setResult({
        original: inputText,
        corrected: correctedText,
        tone: selectedTone
      });
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setStatus(AppStatus.ERROR);
      setErrorMsg("Failed to refine text. Please try again later.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleSubmit();
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col text-slate-900 font-sans selection:bg-brand-200 selection:text-slate-900">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-100/30 blur-3xl opacity-60"></div>
         <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-3xl opacity-60"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full pt-6 pb-4">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Custom Feather Logo from provided image */}
            <FeatherLogo className="w-32 h-32 text-[#002f24]" />
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Clarify</h1>
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                v{config.version}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Polish your words <br className="hidden sm:block"/>
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-slate-900">to perfection.</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-brand/50 -z-0 rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
            Instant AI editing with the perfect tone for every situation.
          </p>
        </div>

        {/* Input Card */}
        {/* 'animate-border-breathe' is now updated to be more subtle (brand-100) */}
        <div className={`relative bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-500 group animate-border-breathe ${status === AppStatus.IDLE ? 'hover:shadow-2xl hover:shadow-brand/5' : ''}`}>
          
          {/* Scanning Animation Overlay */}
          {status === AppStatus.LOADING && (
            <div className="absolute inset-0 z-20 rounded-3xl overflow-hidden pointer-events-none">
              {/* Laser line */}
              <div className="absolute left-0 w-full h-[2px] bg-brand shadow-[0_0_20px_2px_rgba(8,255,57,0.6)] animate-scan"></div>
              {/* Subtle pulsing background */}
              <div className="absolute inset-0 bg-brand/5 animate-pulse"></div>
            </div>
          )}
          
          {/* Text Area */}
          <div className="p-2 relative z-10">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={status === AppStatus.LOADING}
              placeholder="Type or paste your text here to begin..."
              className="w-full min-h-[200px] p-6 text-xl text-slate-800 placeholder-slate-300 border-0 rounded-2xl resize-none focus:ring-0 focus:outline-none bg-transparent leading-relaxed"
              spellCheck="false"
            />
          </div>
          
          {/* Toolbar */}
          <div className="px-6 py-4 bg-white rounded-b-3xl border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Left: Char Count & Tone Selection */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
               
               {/* Tone Selector */}
               <div className="flex items-center bg-slate-50 p-1 rounded-full border border-slate-100 w-full sm:w-auto">
                  {TONES.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 transform ${
                        selectedTone === tone
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 scale-100'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
               </div>

               <div className="hidden md:block h-8 w-px bg-slate-100 mx-2"></div>
               
               <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold tracking-wide transition-colors ${inputText.length > config.maxInputLength * 0.9 ? 'text-amber-500' : 'text-slate-300'}`}>
                    {inputText.length}/{config.maxInputLength}
                  </span>
                  
                  {inputText.length > 0 && (
                      <button 
                        onClick={handleClear}
                        className="group/clear flex items-center text-slate-300 hover:text-rose-500 text-xs font-bold uppercase tracking-wide transition-colors"
                      >
                          <Eraser className="w-3.5 h-3.5 mr-1 group-hover/clear:rotate-12 transition-transform" />
                          Clear
                      </button>
                  )}
               </div>
            </div>
            
            {/* Right: Action Button */}
            <div className="w-full md:w-auto">
                 <Button 
                    onClick={handleSubmit} 
                    isLoading={status === AppStatus.LOADING}
                    disabled={!inputText.trim() || status === AppStatus.LOADING}
                    className="w-full md:w-auto shadow-brand/20"
                    icon={<Wand2 className="w-4 h-4" />}
                 >
                    Polish Text
                 </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {status === AppStatus.ERROR && errorMsg && (
          <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center space-x-3 text-rose-600 animate-fade-in text-center shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Result Area */}
        {status === AppStatus.SUCCESS && result && (
            <ResultCard 
                original={result.original} 
                corrected={result.corrected} 
            />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 text-center">
        <p className="text-slate-900 text-2xl font-medium">
            Made with love by <span className="text-slate-900 font-bold decoration-brand decoration-2 underline underline-offset-2">Anurag</span>
        </p>
      </footer>
    </div>
  );
};

export default App;