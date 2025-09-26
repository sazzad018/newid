import React, { useEffect, useRef } from 'react';
import { QRCodeSettings } from '@shared/schema';
import { createQRCode } from '@/lib/qr-generator';

interface QRGeneratorProps {
  settings: QRCodeSettings;
  data: string;
  className?: string;
}

export function QRGenerator({ settings, data, className }: QRGeneratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && data) {
      createQRCode(containerRef.current, data, settings.size)
        .catch((error) => {
          console.error('QR code generation failed:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = '<div class="text-xs text-muted-foreground">QR Error</div>';
          }
        });
    }
  }, [data, settings.size]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: `${settings.size}px`,
        height: `${settings.size}px`,
      }}
      data-testid="qr-code"
    />
  );
}
