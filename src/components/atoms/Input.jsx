import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text",
  className,
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50",
        error && "border-error focus:ring-error",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;