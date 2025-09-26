import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ElementPosition } from '@shared/schema';

interface DraggableElementProps {
  id: string;
  position: ElementPosition;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (position: Partial<ElementPosition>) => void;
  children: React.ReactNode;
  className?: string;
}

export function DraggableElement({
  id,
  position,
  isEditMode,
  isSelected,
  onSelect,
  onPositionChange,
  children,
  className,
}: DraggableElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [positionStart, setPositionStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPositionStart({ x: position.x, y: position.y });
    onSelect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    onPositionChange({
      x: positionStart.x + deltaX,
      y: positionStart.y + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    onSelect();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, positionStart]);

  return (
    <div
      ref={elementRef}
      className={cn(
        'draggable-element',
        isEditMode && 'cursor-move',
        isSelected && 'selected',
        className
      )}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      data-testid={`draggable-${id}`}
    >
      {children}
      
      {isEditMode && isSelected && (
        <>
          <div className="resizer top-left" />
          <div className="resizer top-right" />
          <div className="resizer bottom-left" />
          <div className="resizer bottom-right" />
        </>
      )}
    </div>
  );
}
