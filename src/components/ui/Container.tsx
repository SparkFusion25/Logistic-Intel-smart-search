import React from "react";

export function Container({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto w-full max-w-[1200px] px-4 sm:px-5 md:px-6 ${className}`}
      {...props}
    />
  );
}