import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({ children, variant = "primary", ...props }: ButtonProps) {
  let className = "rounded-md px-3 py-2 text-sm font-semibold shadow-sm ";
  switch (variant) {
    case "primary":
      className += "bg-indigo-600 text-white hover:bg-indigo-500";
      break;
    case "secondary":
      className += "bg-white/10 text-white hover:bg-white/20";
      break;
    case "danger":
      className += "bg-red-600 text-white hover:bg-red-500";
      break;
  }
  return <button className={className} {...props}>{children}</button>;
}
