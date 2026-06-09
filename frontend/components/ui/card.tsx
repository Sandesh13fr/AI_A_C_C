import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-card border border-dark-border/20 bg-white p-5 dark:border-dark-border dark:bg-dark-card ${className}`}
    >
      {children}
    </div>
  );
}
