import React, { useState } from 'react';
import { Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

interface ResultCardProps {
  original: string;
  corrected: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ original, corrected }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(corrected);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden mt-8 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <div className="bg-brand-100 p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-brand-700" />
            </div>
            <h3 className="text-slate-800 font-bold text-lg tracking-tight">
            Polished Version
            </h3>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
            copied 
                ? 'bg-brand text-slate-900' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Original Side */}
        <div className="p-8 bg-slate-50/30">
           <div className="flex items-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Before</span>
           </div>
           <p className="text-slate-500 leading-relaxed text-lg line-through decoration-rose-200 decoration-2 whitespace-pre-wrap font-medium">
             {original}
           </p>
        </div>

        {/* Corrected Side */}
        <div className="p-8 bg-white relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand to-brand-400 opacity-0 md:opacity-100"></div>
            <div className="flex items-center mb-4">
                <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">After</span>
            </div>
            <p className="text-slate-800 leading-relaxed text-lg font-medium whitespace-pre-wrap">
              {corrected}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;