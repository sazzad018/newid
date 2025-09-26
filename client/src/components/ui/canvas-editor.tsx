import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Edit } from 'lucide-react';

interface CanvasEditorProps {
  zoomLevel: number;
  isEditMode: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleMode: () => void;
  children: React.ReactNode;
  className?: string;
}

export function CanvasEditor({
  zoomLevel,
  isEditMode,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleMode,
  children,
  className,
}: CanvasEditorProps) {
  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Canvas Header */}
      <div className="flex items-center justify-between mb-6 no-print">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Card Preview</h2>
          <div className="flex bg-secondary rounded-lg p-1">
            <Button
              variant={!isEditMode ? 'default' : 'ghost'}
              size="sm"
              onClick={onToggleMode}
              className="canvas-mode-btn"
              data-testid="preview-mode"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              variant={isEditMode ? 'default' : 'ghost'}
              size="sm"
              onClick={onToggleMode}
              className="canvas-mode-btn"
              data-testid="edit-mode"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            data-testid="zoom-out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="px-3 py-1 bg-card border border-border rounded text-sm">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            data-testid="zoom-in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetZoom}
            data-testid="reset-zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="canvas-transform"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center',
          }}
          data-testid="canvas-container"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
