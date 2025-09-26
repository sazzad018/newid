import React from 'react';
import { cn } from '@/lib/utils';
import { CardTemplate } from '@shared/schema';

interface TemplateSelectorProps {
  templates: CardTemplate[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  className?: string;
}

export function TemplateSelector({
  templates,
  selectedTemplate,
  onTemplateSelect,
  className,
}: TemplateSelectorProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onTemplateSelect(template.id)}
          className={cn(
            'template-option p-3 border-2 rounded-lg cursor-pointer transition-all hover:scale-105',
            selectedTemplate === template.id
              ? 'border-primary'
              : 'border-border'
          )}
          data-testid={`template-${template.id}`}
        >
          <div
            className={cn(
              'w-full h-16 rounded mb-2',
              `id-card-template-${template.id}`
            )}
            style={{ background: template.gradient }}
          />
          <p className="text-xs text-center font-medium">{template.name}</p>
        </div>
      ))}
    </div>
  );
}
