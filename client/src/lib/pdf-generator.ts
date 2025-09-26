export async function exportToPNG(element: HTMLElement, filename: string): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).html2canvas) {
    const html2canvas = (window as any).html2canvas;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
      throw new Error('Failed to export PNG');
    }
  } else {
    throw new Error('html2canvas library not loaded');
  }
}

export async function exportToPDF(element: HTMLElement, filename: string): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).html2canvas && (window as any).jspdf) {
    const html2canvas = (window as any).html2canvas;
    const { jsPDF } = (window as any).jspdf;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54], // Standard credit card size
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error('Failed to export PDF');
    }
  } else {
    throw new Error('Required libraries not loaded');
  }
}

export function printCard(element: HTMLElement): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const cardHTML = element.outerHTML;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Teacher ID Card</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Inter, sans-serif; }
        .print-card { page-break-inside: avoid; }
        @page { size: landscape; margin: 0.5in; }
      </style>
    </head>
    <body>
      <div class="print-card">${cardHTML}</div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}
