import React from "react";

export function DropdownMenu({ children }) {
  return <div>{children}</div>;
}

export function DropdownMenuTrigger({ children }) {
  return <>{children}</>;
}

export function DropdownMenuContent({ children }) {
  return <div className="border rounded bg-white">{children}</div>;
}

export function DropdownMenuItem({ children }) {
  return <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">{children}</div>;
}
