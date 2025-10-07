import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95 disabled:from-gray-400 disabled:to-gray-400",
    secondary:
      "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 active:scale-95 disabled:border-gray-200 disabled:text-gray-400",
    success:
      "bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg active:scale-95 disabled:bg-gray-400",
    warning:
      "bg-yellow-600 text-white shadow-md hover:bg-yellow-700 hover:shadow-lg active:scale-95 disabled:bg-gray-400",
    danger:
      "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg active:scale-95 disabled:bg-gray-400",
    ghost:
      "text-gray-700 hover:bg-gray-100 active:scale-95 disabled:text-gray-400",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className} ${
        disabled || loading ? "cursor-not-allowed" : ""
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-6 w-6 border-3",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent border-current ${sizeClasses[size]} ${className}`}
    />
  );
};
