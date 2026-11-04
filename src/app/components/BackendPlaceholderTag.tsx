import React from "react";
import { Database } from "lucide-react";

interface BackendPlaceholderTagProps {
  id: string;
  source?: string;
  isInspecting?: boolean;
  className?: string;
}

export function BackendPlaceholderTag({
  id,
  source,
  isInspecting,
  className = "",
}: BackendPlaceholderTagProps) {
  if (!isInspecting) return null;

  return (
    <span
      title={`Backend Placeholder ID: ${id}\nSource: ${source || "Supabase DB"}`}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-amber-500/10 text-amber-800 border border-amber-300 dark:bg-amber-400/20 dark:text-amber-300 dark:border-amber-600 select-all cursor-help ${className}`}
    >
      <Database size={10} className="text-amber-600 dark:text-amber-400" />
      <span>db:{id}</span>
    </span>
  );
}
