"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface UploadDropzoneProps {
  onFilesSelected?: (files: File[]) => void;
}

export function UploadDropzone({ onFilesSelected }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    onFilesSelected?.(Array.from(fileList));
  }

  return (
    <div
      className={`rounded-card border-2 border-dashed px-6 py-10 text-center ${dragActive ? "border-app-teal bg-app-mint/40" : "border-app-line-strong bg-app-panel"}`}
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
      <p className="font-mono text-micro uppercase text-ink-soft">PDF, DOCX, TXT</p>
      <h3 className="mt-3 text-h3 text-ink">Drag files into a new ingest batch</h3>
      <p className="mx-auto mt-2 max-w-xl text-body-sm text-ink-soft">
        Use this staging surface for user uploads and source imports. Batch creation stays tied to the existing backend upload endpoint.
      </p>
      <div className="mt-5 flex justify-center">
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          Select files
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}
