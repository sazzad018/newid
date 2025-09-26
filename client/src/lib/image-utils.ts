export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      const aspectRatio = width / height;
      
      let newWidth = width;
      let newHeight = height;

      if (width > maxWidth || height > maxHeight) {
        if (aspectRatio > 1) {
          newWidth = maxWidth;
          newHeight = maxWidth / aspectRatio;
        } else {
          newHeight = maxHeight;
          newWidth = maxHeight * aspectRatio;
        }
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.src = URL.createObjectURL(file);
  });
}

export function cropImage(imageSrc: string, cropArea: CropArea): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.src = imageSrc;
  });
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
