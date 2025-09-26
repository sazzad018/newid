import { QRCodeSettings } from '@shared/schema';

export interface QRCodeData {
  teacherId: string;
  name: string;
  department: string;
  customText?: string;
}

export function generateQRData(settings: QRCodeSettings, data: QRCodeData): string {
  switch (settings.type) {
    case 'id':
      return data.teacherId;
    case 'full':
      return `Name: ${data.name}\nID: ${data.teacherId}\nDept: ${data.department}`;
    case 'custom':
      return settings.customText || 'Custom';
    case 'url':
      return `https://example.com/verify/${data.teacherId}`;
    default:
      return data.teacherId;
  }
}

export function createQRCode(container: HTMLElement, text: string, size: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Clear existing QR code
      container.innerHTML = '';
      
      // Use QRCode library (loaded via CDN)
      if (typeof window !== 'undefined' && (window as any).QRCode) {
        const QRCode = (window as any).QRCode;
        new QRCode(container, {
          text,
          width: size,
          height: size,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M,
        });
        resolve();
      } else {
        reject(new Error('QRCode library not loaded'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
