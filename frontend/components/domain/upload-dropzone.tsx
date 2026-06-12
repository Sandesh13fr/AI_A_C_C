"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  hint?: string;
}

export function UploadDropzone({
  onFilesSelected,
  accept = ".pdf,.doc,.docx,.txt",
  multiple = true,
  hint = "PDF, DOCX, TXT · 50 MB max per file",
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const next = Array.from(fileList);
    setFiles(next);
    onFilesSelected?.(next);
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-md border border-dashed bg-white px-6 py-10 text-center transition-colors",
          dragActive ? "border-brand bg-brand-light" : "border-border-strong",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <p className="text-label uppercase text-ink-500">Upload</p>
        <h3 className="mt-3 font-display text-display-lg text-ink-900">Drag files here or browse</h3>
        <p className="mx-auto mt-2 max-w-md text-body-sm text-ink-500">{hint}</p>
        <div className="mt-5 flex justify-center">
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
            <Icon name="Upload" size={14} />
            Select files
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
      {files.length > 0 ? (
        <ul className="divide-y divide-border-subtle rounded-md border border-border">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center gap-3 px-4 py-2.5 text-body-sm">
              <Icon name="FileText" size={14} className="text-ink-400" />
              <span className="flex-1 truncate text-ink-900">{file.name}</span>
              <span className="font-mono text-mono-sm text-ink-500">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                className="text-ink-400 hover:text-[#D92D20]"
                onClick={() => {
                  const next = files.filter((_, i) => i !== index);
                  setFiles(next);
                  onFilesSelected?.(next);
                }}
                aria-label={`Remove ${file.name}`}
              >
                <Icon name="X" size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
