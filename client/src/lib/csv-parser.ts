import { Teacher } from '@shared/schema';

export interface CSVRow {
  [key: string]: string;
}

export function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: CSVRow = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }

  return rows;
}

export function csvToTeachers(csvRows: CSVRow[]): Partial<Teacher>[] {
  return csvRows.map((row, index) => ({
    id: `temp-${index}`,
    name: row.name || row.Name || '',
    designation: row.designation || row.Designation || '',
    department: row.department || row.Department || '',
    teacherId: row.teacherId || row['Teacher ID'] || row.id || '',
    issueDate: row.issueDate || row['Issue Date'] || '',
    expiryDate: row.expiryDate || row['Expiry Date'] || '',
    schoolName: row.schoolName || row['School Name'] || '',
  }));
}

export function generateCSVTemplate(): string {
  const headers = [
    'name',
    'designation',
    'department',
    'teacherId',
    'issueDate',
    'expiryDate',
    'schoolName'
  ];

  const sampleData = [
    [
      'John Doe',
      'Senior Teacher',
      'Mathematics',
      'TCHR-2025-001',
      '2025-01-01',
      '2026-01-01',
      'Sample High School'
    ],
    [
      'Jane Smith', 
      'Assistant Teacher',
      'English',
      'TCHR-2025-002',
      '2025-01-01',
      '2026-01-01',
      'Sample High School'
    ]
  ];

  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSVTemplate(): void {
  const csvContent = generateCSVTemplate();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'teacher-id-template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
