// src/components/Layout/PageWrapper.tsx
import type { ReactNode } from "react";

interface PageWrapperProps {
  title?: string;
  children: ReactNode;
}

export default function PageWrapper({ title, children }: PageWrapperProps) {
  return (
    <main className="p-4">
      {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
      {children}
    </main>
  );
}
