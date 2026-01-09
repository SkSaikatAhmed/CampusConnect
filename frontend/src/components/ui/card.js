import React from "react";

export function Card({ children, className = "" }) {
  return <div className={`bg-white rounded shadow ${className}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="p-4 border-b font-semibold">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function CardFooter({ children }) {
  return <div className="p-4 border-t">{children}</div>;
}
