import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-3",
    lg: "h-16 w-16 border-4",
    xl: "h-24 w-24 border-4",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full border-t-transparent border-blue-600 ${sizeClasses[size]}`}
      />
      {text && (
        <p
          className={`mt-4 text-gray-600 font-medium ${textSizeClasses[size]}`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{spinner}</div>
  );
};

interface InlineSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const InlineSpinner: React.FC<InlineSpinnerProps> = ({
  size = "sm",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-6 w-6 border-3",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-t-transparent border-current ${sizeClasses[size]} ${className}`}
    />
  );
};
