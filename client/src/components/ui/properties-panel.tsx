import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ElementPosition } from '@shared/schema';

interface PropertiesPanelProps {
  selectedElement: string | null;
  position: ElementPosition | null;
  onPositionChange: (position: Partial<ElementPosition>) => void;
  isVisible: boolean;
  t: (key: string) => string;
}

export function PropertiesPanel({
  selectedElement,
  position,
  onPositionChange,
  isVisible,
  t,
}: PropertiesPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="w-80 bg-card border-l border-border p-6 overflow-y-auto no-print">
      <h3 className="text-lg font-semibold mb-4">{t('propertiesTitle')}</h3>
      
      {selectedElement && position ? (
        <div className="space-y-4">
          {/* Position Controls */}
          <div>
            <Label className="text-sm font-medium mb-2">{t('position')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">X</Label>
                <Input
                  type="number"
                  value={Math.round(position.x)}
                  onChange={(e) => onPositionChange({ x: parseInt(e.target.value) || 0 })}
                  className="text-sm"
                  data-testid="position-x"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Y</Label>
                <Input
                  type="number"
                  value={Math.round(position.y)}
                  onChange={(e) => onPositionChange({ y: parseInt(e.target.value) || 0 })}
                  className="text-sm"
                  data-testid="position-y"
                />
              </div>
            </div>
          </div>

          {/* Size Controls */}
          <div>
            <Label className="text-sm font-medium mb-2">{t('size')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">{t('width')}</Label>
                <Input
                  type="number"
                  value={Math.round(position.width)}
                  onChange={(e) => onPositionChange({ width: parseInt(e.target.value) || 0 })}
                  className="text-sm"
                  data-testid="size-width"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('height')}</Label>
                <Input
                  type="number"
                  value={Math.round(position.height)}
                  onChange={(e) => onPositionChange({ height: parseInt(e.target.value) || 0 })}
                  className="text-sm"
                  data-testid="size-height"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t('propertiesPlaceholder')}</p>
      )}
    </div>
  );
}
