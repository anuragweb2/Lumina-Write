import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  isLoading, 
  variant = 'primary', 
  icon, 
  className = '', 
  disabled,
  ...props 
}) => {
  
  const baseStyles = "inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 tracking-tight";
  
  const variants = {
    // Using neon green (brand) with slate-900 text for high contrast and energetic look
    primary: "bg-brand hover:bg-[#05ce2e] text-slate-900 shadow-lg shadow-brand/20 hover:shadow-brand/40 focus:ring-brand/30 border border-transparent",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-100 shadow-sm",
    ghost: "bg-transparent text-slate-500 hover:text-brand-700 hover:bg-brand-50 focus:ring-brand-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span className="opacity-80">Polishing...</span>
        </>
      ) : (
        <>
          {children}
          {icon && <span className="ml-2.5 -mr-1">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;