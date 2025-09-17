import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-primary",
    secondary: "bg-white text-secondary border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-secondary",
    ghost: "text-secondary hover:bg-gray-100 hover:text-gray-900 focus:ring-secondary",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-green-600 hover:to-success shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-success",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-error shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-error"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;