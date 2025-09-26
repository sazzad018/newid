import React from 'react';
import { TeacherIdGenerator } from '@/components/teacher-id-generator';

export default function Home() {
  return (
    <div className="min-h-screen">
      <TeacherIdGenerator />
      
      {/* External Scripts */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" async />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" async />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" async />
    </div>
  );
}
