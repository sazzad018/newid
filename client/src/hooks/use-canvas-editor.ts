import { useState, useCallback } from 'react';
import { ElementPosition } from '@shared/schema';

export interface CanvasEditorState {
  selectedElement: string | null;
  isEditMode: boolean;
  zoomLevel: number;
  elementPositions: Record<string, ElementPosition>;
}

export function useCanvasEditor(initialPositions: Record<string, ElementPosition> = {}) {
  const [state, setState] = useState<CanvasEditorState>({
    selectedElement: null,
    isEditMode: false,
    zoomLevel: 1,
    elementPositions: initialPositions,
  });

  const selectElement = useCallback((elementId: string | null) => {
    setState(prev => ({ ...prev, selectedElement: elementId }));
  }, []);

  const setEditMode = useCallback((isEditMode: boolean) => {
    setState(prev => ({ 
      ...prev, 
      isEditMode,
      selectedElement: isEditMode ? prev.selectedElement : null 
    }));
  }, []);

  const setZoomLevel = useCallback((zoomLevel: number) => {
    const clampedZoom = Math.max(0.5, Math.min(2, zoomLevel));
    setState(prev => ({ ...prev, zoomLevel: clampedZoom }));
  }, []);

  const updateElementPosition = useCallback((elementId: string, position: Partial<ElementPosition>) => {
    setState(prev => ({
      ...prev,
      elementPositions: {
        ...prev.elementPositions,
        [elementId]: {
          ...prev.elementPositions[elementId],
          ...position,
        },
      },
    }));
  }, []);

  const getElementPosition = useCallback((elementId: string): ElementPosition => {
    return state.elementPositions[elementId] || { x: 0, y: 0, width: 100, height: 100 };
  }, [state.elementPositions]);

  return {
    ...state,
    selectElement,
    setEditMode,
    setZoomLevel,
    updateElementPosition,
    getElementPosition,
  };
}
