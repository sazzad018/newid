import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, X, Crop } from 'lucide-react';

interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File) => void;
  onCrop?: () => void;
  onRemove?: () => void;
  preview?: string;
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export function FileUpload({
  accept,
  onFileSelect,
  onCrop,
  onRemove,
  preview,
  className,
  children,
  'data-testid': testId,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        data-testid={testId ? `${testId}-input` : undefined}
      />
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer',
          isDragOver && 'drag-over',
          className
        )}
        data-testid={testId ? `${testId}-area` : undefined}
      >
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg mx-auto"
              data-testid={testId ? `${testId}-preview` : undefined}
            />
            <div className="flex justify-center space-x-2">
              {onCrop && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCrop();
                  }}
                  data-testid={testId ? `${testId}-crop` : undefined}
                >
                  <Crop className="w-3 h-3 mr-1" />
                  Crop
                </Button>
              )}
              {onRemove && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  data-testid={testId ? `${testId}-remove` : undefined}
                >
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
