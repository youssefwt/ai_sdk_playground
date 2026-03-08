import { FileCode } from "lucide-react";
import { useState } from "react";

interface GeneratedFilePreviewProps {
  filename: string;
  content: string;
  language?: string;
}

export function GeneratedFilePreview({
  filename,
  content,
  language,
}: GeneratedFilePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <FileCode className="size-5 text-blue-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm font-medium truncate">
            {filename}
          </div>
          {language && (
            <div className="text-xs text-muted-foreground">{language}</div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {isExpanded ? "Hide" : "Show"} content
        </div>
      </button>
      {isExpanded && (
        <div className="border-t">
          <pre className="p-4 overflow-x-auto text-sm bg-muted/30">
            <code>{content}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
