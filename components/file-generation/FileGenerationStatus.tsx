import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { FileStatus } from "@/tools/filesGenerator";

interface FileGenerationStatusProps {
  files: FileStatus[];
}

export function FileGenerationStatus({ files }: FileGenerationStatusProps) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="font-semibold mb-3 text-lg">File Generation Progress</h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <FileStatusItem key={`${file.filename}-${index}`} file={file} />
        ))}
      </div>
    </div>
  );
}

function FileStatusItem({ file }: { file: FileStatus }) {
  const statusConfig = {
    pending: {
      icon: <Circle className="size-5 text-muted-foreground" />,
      text: "Pending",
      color: "text-muted-foreground",
    },
    generating: {
      icon: <Loader2 className="size-5 text-blue-500 animate-spin" />,
      text: "Generating...",
      color: "text-blue-500",
    },
    completed: {
      icon: <CheckCircle2 className="size-5 text-green-500" />,
      text: "Completed",
      color: "text-green-500",
    },
    error: {
      icon: <XCircle className="size-5 text-red-500" />,
      text: "Error",
      color: "text-red-500",
    },
  };

  const config = statusConfig[file.status];

  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors">
      <div className="shrink-0">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm font-medium truncate">
          {file.filename}
        </div>
        <div className={`text-xs ${config.color}`}>
          {config.text}
          {file.error && <span className="ml-2">- {file.error}</span>}
        </div>
      </div>
    </div>
  );
}
