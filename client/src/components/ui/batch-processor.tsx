import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parseCSV, csvToTeachers, downloadCSVTemplate } from '@/lib/csv-parser';
import { Teacher, BatchSettings } from '@shared/schema';
import { Download, FileText, Settings } from 'lucide-react';

interface BatchProcessorProps {
  onBatchProcess: (teachers: Partial<Teacher>[], settings: BatchSettings) => void;
  t: (key: string) => string;
}

export function BatchProcessor({ onBatchProcess, t }: BatchProcessorProps) {
  const [csvData, setCsvData] = useState<Partial<Teacher>[]>([]);
  const [batchSettings, setBatchSettings] = useState<BatchSettings>({
    cardsPerPage: 4,
    outputFormat: 'pdf',
  });

  const handleCSVUpload = async (file: File) => {
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const teachers = csvToTeachers(rows);
      setCsvData(teachers);
    } catch (error) {
      console.error('CSV parsing failed:', error);
    }
  };

  const handleProcessBatch = () => {
    if (csvData.length > 0) {
      onBatchProcess(csvData, batchSettings);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('batchTitle')}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t('batchDescription')}</p>
      </div>

      {/* CSV Upload */}
      <FileUpload
        accept=".csv"
        onFileSelect={handleCSVUpload}
        data-testid="csv-upload"
      >
        <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-2">{t('csvUploadText')}</p>
        <Button
          variant="link"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            downloadCSVTemplate();
          }}
          data-testid="download-template"
        >
          <Download className="w-3 h-3 mr-1" />
          {t('downloadTemplate')}
        </Button>
      </FileUpload>

      {/* CSV Preview */}
      {csvData.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">{t('csvPreviewTitle')}</h4>
          <div className="bg-secondary rounded-lg p-3 text-xs">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-1 font-medium">Name</th>
                  <th className="text-left p-1 font-medium">ID</th>
                  <th className="text-left p-1 font-medium">Dept</th>
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 3).map((teacher, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="p-1">{teacher.name}</td>
                    <td className="p-1">{teacher.teacherId}</td>
                    <td className="p-1">{teacher.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {csvData.length} records found
            </span>
            <Button
              onClick={handleProcessBatch}
              data-testid="process-batch"
            >
              <Settings className="w-4 h-4 mr-2" />
              {t('processBatch')}
            </Button>
          </div>
        </div>
      )}

      {/* Batch Settings */}
      <div>
        <h4 className="font-medium mb-3">{t('batchSettingsTitle')}</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('labelCardsPerPage')}</span>
            <Select
              value={batchSettings.cardsPerPage.toString()}
              onValueChange={(value) => 
                setBatchSettings(prev => ({ ...prev, cardsPerPage: parseInt(value) }))
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('labelOutputFormat')}</span>
            <Select
              value={batchSettings.outputFormat}
              onValueChange={(value: 'pdf' | 'png' | 'zip') => 
                setBatchSettings(prev => ({ ...prev, outputFormat: value }))
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="zip">ZIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
