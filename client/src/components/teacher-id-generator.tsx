import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { TemplateSelector } from '@/components/ui/template-selector';
import { DraggableElement } from '@/components/ui/draggable-element';
import { CanvasEditor } from '@/components/ui/canvas-editor';
import { PropertiesPanel } from '@/components/ui/properties-panel';
import { BatchProcessor } from '@/components/ui/batch-processor';
import { useCanvasEditor } from '@/hooks/use-canvas-editor';
import { useLocalStorage, useAutoSave } from '@/hooks/use-local-storage';
import { useTranslation, Language } from '@/lib/translations';
import { fileToDataURL } from '@/lib/image-utils';
import { exportToPNG, exportToPDF, printCard } from '@/lib/pdf-generator';
import { useToast } from '@/hooks/use-toast';
import { 
  Teacher, 
  CardTemplate, 
  CardLayout, 
  BatchSettings,
  teacherSchema 
} from '@shared/schema';
import { 
  IdCard, 
  Languages, 
  Moon, 
  Sun, 
  Cloud, 
  FolderSync, 
  Download, 
  FileText, 
  Printer,
  User,
  School,
  Palette
} from 'lucide-react';

const cardTemplates: CardTemplate[] = [
  { id: '1', name: 'Professional Blue', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textColor: '#ffffff' },
  { id: '2', name: 'Vibrant Pink', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', textColor: '#ffffff' },
  { id: '3', name: 'Ocean Blue', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', textColor: '#ffffff' },
  { id: '4', name: 'Fresh Green', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', textColor: '#ffffff' },
  { id: '5', name: 'Sunset Orange', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', textColor: '#ffffff' },
  { id: '6', name: 'Bengali Teacher', gradient: '#ffffff', textColor: '#000000' },
];

const defaultElementPositions = {
  'school-logo': { x: 304, y: 16, width: 64, height: 64 },
  'school-name': { x: 16, y: 16, width: 280, height: 32 },
  'teacher-photo': { x: 16, y: 64, width: 80, height: 80 },
  'teacher-info': { x: 112, y: 64, width: 256, height: 80 },
  'qr-code': { x: 304, y: 176, width: 80, height: 80 },
  'dates-info': { x: 16, y: 224, width: 280, height: 20 },
};

export function TeacherIdGenerator() {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);
  const [selectedTemplate, setSelectedTemplate] = useLocalStorage('selectedTemplate', '6');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState('basic');
  
  const { t } = useTranslation(language);
  const { toast } = useToast();
  
  const {
    selectedElement,
    isEditMode,
    zoomLevel,
    elementPositions,
    selectElement,
    setEditMode,
    setZoomLevel,
    updateElementPosition,
    getElementPosition,
  } = useCanvasEditor(defaultElementPositions);


  const [cardLayout, setCardLayout] = useLocalStorage<CardLayout>('cardLayout', {
    orientation: 'landscape',
    borderRadius: 12,
    fontFamily: 'Inter',
  });

  const form = useForm<Teacher>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      id: 'temp-id',
      name: 'Md. Example Teacher',
      designation: 'Senior Teacher',
      department: 'Science Department',
      teacherId: 'TCHR-2025-001',
      issueDate: '2025-01-20',
      expiryDate: '2026-01-19',
      schoolName: 'ABC High School',
      photoUrl: '',
      logoUrl: '',
    },
  });

  const watchedValues = form.watch();

  // Auto-save
  useAutoSave('teacherIdCardData', {
    formData: watchedValues,
    selectedTemplate,
    cardLayout,
    elementPositions,
    photoUrl,
    logoUrl,
    signatureUrl,
  });

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const dataUrl = await fileToDataURL(file);
      setPhotoUrl(dataUrl);
      form.setValue('photoUrl', dataUrl);
      toast({ title: 'Photo uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload photo', variant: 'destructive' });
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const dataUrl = await fileToDataURL(file);
      setLogoUrl(dataUrl);
      form.setValue('logoUrl', dataUrl);
      toast({ title: 'Logo uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload logo', variant: 'destructive' });
    }
  };

  const handlePhotoRemove = () => {
    setPhotoUrl('');
    form.setValue('photoUrl', '');
  };

  const handleLogoRemove = () => {
    setLogoUrl('');
    form.setValue('logoUrl', '');
  };

  const handleSignatureUpload = async (file: File) => {
    try {
      const dataUrl = await fileToDataURL(file);
      setSignatureUrl(dataUrl);
      toast({ title: 'Signature uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload signature', variant: 'destructive' });
    }
  };

  const handleSignatureRemove = () => {
    setSignatureUrl('');
  };

  const handleExportPNG = async () => {
    const cardElement = document.getElementById('id-card');
    if (cardElement) {
      try {
        await exportToPNG(cardElement, watchedValues.teacherId || 'teacher-id');
        toast({ title: 'PNG exported successfully!' });
      } catch (error) {
        toast({ title: 'Export failed', variant: 'destructive' });
      }
    }
  };

  const handleExportPDF = async () => {
    const cardElement = document.getElementById('id-card');
    if (cardElement) {
      try {
        await exportToPDF(cardElement, watchedValues.teacherId || 'teacher-id');
        toast({ title: 'PDF exported successfully!' });
      } catch (error) {
        toast({ title: 'Export failed', variant: 'destructive' });
      }
    }
  };

  const handlePrint = () => {
    const cardElement = document.getElementById('id-card');
    if (cardElement) {
      printCard(cardElement);
    }
  };

  const handleBatchProcess = (teachers: Partial<Teacher>[], settings: BatchSettings) => {
    toast({ title: `Processing ${teachers.length} cards...` });
    // TODO: Implement batch processing logic
  };


  const currentTemplate = cardTemplates.find(t => t.id === selectedTemplate) || cardTemplates[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <IdCard className="mr-2" />
              {t('appTitle')}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLanguageToggle}
              data-testid="language-toggle"
            >
              <Languages className="w-4 h-4 mr-1" />
              {t('langText')}
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 bg-accent text-accent-foreground rounded-md text-sm">
              <Cloud className="w-4 h-4" />
              <span>{t('autoSaved')}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleThemeToggle}
              data-testid="theme-toggle"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Tools Panel */}
        <div className="w-80 bg-card border-r border-border p-6 overflow-y-auto no-print">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" data-testid="tab-basic">
                <User className="w-4 h-4 mr-2" />
                {t('basicInfo')}
              </TabsTrigger>
              <TabsTrigger value="design" data-testid="tab-design">
                <Palette className="w-4 h-4 mr-2" />
                {t('design')}
              </TabsTrigger>
              <TabsTrigger value="batch" data-testid="tab-batch">
                <FileText className="w-4 h-4 mr-2" />
                {t('batch')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('labelName')}</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Enter teacher name"
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <Label htmlFor="designation">{t('labelDesignation')}</Label>
                  <Input
                    id="designation"
                    {...form.register('designation')}
                    placeholder="e.g., Senior Teacher"
                    data-testid="input-designation"
                  />
                </div>

                <div>
                  <Label htmlFor="department">{t('labelDepartment')}</Label>
                  <Input
                    id="department"
                    {...form.register('department')}
                    placeholder="e.g., Science Department"
                    data-testid="input-department"
                  />
                </div>

                <div>
                  <Label htmlFor="teacherId">{t('labelId')}</Label>
                  <Input
                    id="teacherId"
                    {...form.register('teacherId')}
                    placeholder="e.g., TCHR-2025-001"
                    data-testid="input-teacher-id"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="issueDate">{t('labelIssue')}</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      {...form.register('issueDate')}
                      data-testid="input-issue-date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">{t('labelExpiry')}</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      {...form.register('expiryDate')}
                      data-testid="input-expiry-date"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="schoolName">{t('labelSchool')}</Label>
                  <Input
                    id="schoolName"
                    {...form.register('schoolName')}
                    placeholder="Enter school name"
                    data-testid="input-school-name"
                  />
                </div>

                <div>
                  <Label>{t('labelPhoto')}</Label>
                  <FileUpload
                    accept="image/*"
                    onFileSelect={handlePhotoUpload}
                    onRemove={handlePhotoRemove}
                    preview={photoUrl}
                    data-testid="photo-upload"
                  >
                    <p className="text-sm text-muted-foreground">{t('photoUploadText')}</p>
                  </FileUpload>
                </div>

                <div>
                  <Label>{t('labelLogo')}</Label>
                  <FileUpload
                    accept="image/*"
                    onFileSelect={handleLogoUpload}
                    onRemove={handleLogoRemove}
                    preview={logoUrl}
                    data-testid="logo-upload"
                  >
                    <p className="text-sm text-muted-foreground">{t('logoUploadText')}</p>
                  </FileUpload>
                </div>

                <div>
                  <Label>Headmaster Signature</Label>
                  <FileUpload
                    accept="image/*"
                    onFileSelect={handleSignatureUpload}
                    onRemove={handleSignatureRemove}
                    preview={signatureUrl}
                    data-testid="signature-upload"
                  >
                    <p className="text-sm text-muted-foreground">Upload headmaster's signature image</p>
                  </FileUpload>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('templateTitle')}</h3>
                <TemplateSelector
                  templates={cardTemplates}
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={setSelectedTemplate}
                />
              </div>

              <div>
                <Label>{t('labelFont')}</Label>
                <Select
                  value={cardLayout.fontFamily}
                  onValueChange={(value) => setCardLayout(prev => ({ ...prev, fontFamily: value }))}
                >
                  <SelectTrigger data-testid="font-family-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter (Default)</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Noto Sans Bengali">Noto Sans Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div>
                <h3 className="text-lg font-semibold mb-3">{t('layoutTitle')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('labelOrientation')}</span>
                    <Select
                      value={cardLayout.orientation}
                      onValueChange={(value: 'landscape' | 'portrait') => 
                        setCardLayout(prev => ({ ...prev, orientation: value }))
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="landscape">Landscape</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('labelBorderRadius')}</span>
                    <Slider
                      value={[cardLayout.borderRadius]}
                      onValueChange={([value]) => setCardLayout(prev => ({ ...prev, borderRadius: value }))}
                      min={0}
                      max={24}
                      step={1}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="batch" className="mt-6">
              <BatchProcessor
                onBatchProcess={handleBatchProcess}
                t={t as (key: string) => string}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-muted p-6 relative">
          <CanvasEditor
            zoomLevel={zoomLevel}
            isEditMode={isEditMode}
            onZoomIn={() => setZoomLevel(zoomLevel + 0.1)}
            onZoomOut={() => setZoomLevel(zoomLevel - 0.1)}
            onResetZoom={() => setZoomLevel(1)}
            onToggleMode={() => setEditMode(!isEditMode)}
          >
            {/* ID Card */}
            <Card
              id="id-card"
              className={`${selectedTemplate === '6' ? 'w-64 h-96' : 'w-96 h-60'} shadow-2xl relative overflow-hidden id-card-template-${selectedTemplate}`}
              style={{
                fontFamily: cardLayout.fontFamily,
                borderRadius: `${cardLayout.borderRadius}px`,
                background: selectedTemplate === '6' ? '#ffffff' : currentTemplate.gradient,
              }}
              onClick={() => selectElement(null)}
              data-testid="id-card"
            >
              {selectedTemplate === '6' ? (
                /* Bengali Teacher ID Card Layout */
                <div className="w-full h-full relative">
                  {/* Geometric Background */}
                  <div className="absolute inset-0">
                    {/* Navy diagonal section */}
                    <div 
                      className="absolute top-0 left-0 w-full h-full"
                      style={{
                        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
                        clipPath: 'polygon(0 0, 100% 0, 60% 100%, 0 85%)'
                      }}
                    />
                    {/* Green diagonal section */}
                    <div 
                      className="absolute top-0 right-0 w-full h-full"
                      style={{
                        background: 'linear-gradient(135deg, #68d391 0%, #38a169 100%)',
                        clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 80% 100%)'
                      }}
                    />
                  </div>

                  {/* Top Logo/Emblem Section */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="School Logo"
                        className="w-12 h-12 object-contain bg-white rounded-lg p-1"
                        data-testid="card-logo"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <School className="text-gray-600 text-lg" />
                      </div>
                    )}
                  </div>

                  {/* Top Right Logo */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="text-white text-xs font-bold">🏛</div>
                      </div>
                    </div>
                  </div>

                  {/* Circular Photo Frame */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-24 h-24 rounded-full bg-white p-1">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-700">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt="Teacher Photo"
                            className="w-full h-full object-cover"
                            data-testid="card-photo"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <User className="text-gray-400 text-xl" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Information Table */}
                  <div className="absolute top-44 left-4 right-20 bg-white/95 rounded-lg shadow-lg z-10 border">
                    <table className="w-full text-xs" data-testid="info-table">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-1 px-2 font-semibold bg-gray-100 w-16 text-gray-700 text-[10px]">Name:</td>
                          <td className="py-1 px-2 text-gray-900 font-medium text-[10px]">
                            {watchedValues.name || 'MD. ANWAR HOSSAIN'}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-1 px-2 font-semibold bg-gray-100 text-gray-700 text-[10px]">Qualification:</td>
                          <td className="py-1 px-2 text-gray-900 text-[10px] leading-tight">
                            {watchedValues.designation || 'B.A.(Hons in English)'}<br/>
                            {watchedValues.department || 'M.A(English)'}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-1 px-2 font-semibold bg-gray-100 text-gray-700 text-[10px]">ID:</td>
                          <td className="py-1 px-2 text-gray-900 font-bold text-[10px]">
                            {watchedValues.teacherId || '2016705294'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 font-semibold bg-gray-100 text-gray-700 text-[10px]">Since:</td>
                          <td className="py-1 px-2 text-gray-900 text-[10px]">
                            {watchedValues.issueDate || '2012-09-03'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Headmaster Signature */}
                  {signatureUrl && (
                    <div className="absolute bottom-12 right-4 z-10 bg-white/95 rounded border shadow-lg w-16">
                      <div className="text-center p-1">
                        <img
                          src={signatureUrl}
                          alt="Headmaster Signature"
                          className="w-full h-6 object-contain"
                          data-testid="card-signature"
                        />
                        <div className="text-[8px] text-gray-600 mt-1 border-t border-gray-300 pt-1">
                          Headmaster
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Large TEACHER Text */}
                  <div className="absolute bottom-1 left-4 right-4 z-10">
                    <h2 
                      className="text-gray-900 font-black text-3xl tracking-wider drop-shadow-sm"
                      data-testid="teacher-label"
                      style={{ 
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      TEACHER
                    </h2>
                  </div>
                </div>
              ) : (
                /* Default Template Layout */
                <>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full" />
                  </div>

                  {/* School Logo */}
                  <DraggableElement
                    id="school-logo"
                    position={getElementPosition('school-logo')}
                    isEditMode={isEditMode}
                    isSelected={selectedElement === 'school-logo'}
                    onSelect={() => selectElement('school-logo')}
                    onPositionChange={(pos) => updateElementPosition('school-logo', pos)}
                  >
                    <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="School Logo"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <School className="text-white/60 text-xl" />
                      )}
                    </div>
                  </DraggableElement>

                  {/* School Name */}
                  <DraggableElement
                    id="school-name"
                    position={getElementPosition('school-name')}
                    isEditMode={isEditMode}
                    isSelected={selectedElement === 'school-name'}
                    onSelect={() => selectElement('school-name')}
                    onPositionChange={(pos) => updateElementPosition('school-name', pos)}
                  >
                    <h1 className="text-white font-bold text-lg leading-tight">
                      {watchedValues.schoolName || 'School Name'}
                    </h1>
                  </DraggableElement>

                  {/* Teacher Photo */}
                  <DraggableElement
                    id="teacher-photo"
                    position={getElementPosition('teacher-photo')}
                    isEditMode={isEditMode}
                    isSelected={selectedElement === 'teacher-photo'}
                    onSelect={() => selectElement('teacher-photo')}
                    onPositionChange={(pos) => updateElementPosition('teacher-photo', pos)}
                  >
                    <div className="w-full h-full bg-white/20 rounded-lg overflow-hidden border border-white/30">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Teacher Photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <User className="text-white/60 text-2xl" />
                        </div>
                      )}
                    </div>
                  </DraggableElement>

                  {/* Teacher Information */}
                  <DraggableElement
                    id="teacher-info"
                    position={getElementPosition('teacher-info')}
                    isEditMode={isEditMode}
                    isSelected={selectedElement === 'teacher-info'}
                    onSelect={() => selectElement('teacher-info')}
                    onPositionChange={(pos) => updateElementPosition('teacher-info', pos)}
                  >
                    <div className="text-white">
                      <h2 className="font-bold text-base mb-1">
                        {watchedValues.name || 'Teacher Name'}
                      </h2>
                      <p className="text-white/90 text-sm mb-1">
                        {watchedValues.designation || 'Designation'}
                      </p>
                      <p className="text-white/80 text-xs mb-1">
                        {watchedValues.department || 'Department'}
                      </p>
                      <p className="text-white/80 text-xs">
                        ID: {watchedValues.teacherId || 'ID'}
                      </p>
                    </div>
                  </DraggableElement>


                  {/* Issue/Expiry Dates */}
                  <DraggableElement
                    id="dates-info"
                    position={getElementPosition('dates-info')}
                    isEditMode={isEditMode}
                    isSelected={selectedElement === 'dates-info'}
                    onSelect={() => selectElement('dates-info')}
                    onPositionChange={(pos) => updateElementPosition('dates-info', pos)}
                  >
                    <p className="text-white/80 text-xs">
                      Issue: {watchedValues.issueDate || '—'} • Expiry: {watchedValues.expiryDate || '—'}
                    </p>
                  </DraggableElement>
                </>
              )}
            </Card>
          </CanvasEditor>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 mt-6 no-print">
            <Button
              onClick={() => form.handleSubmit(() => {})()}
              data-testid="update-preview"
            >
              <FolderSync className="w-4 h-4 mr-2" />
              {t('updateBtnText')}
            </Button>
            <Button
              variant="secondary"
              onClick={handleExportPNG}
              data-testid="export-png"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('exportPngText')}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              data-testid="export-pdf"
            >
              <FileText className="w-4 h-4 mr-2" />
              {t('exportPdfText')}
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              data-testid="print-card"
            >
              <Printer className="w-4 h-4 mr-2" />
              {t('printText')}
            </Button>
          </div>
        </div>

        {/* Right Properties Panel */}
        <PropertiesPanel
          selectedElement={selectedElement}
          position={selectedElement ? getElementPosition(selectedElement) : null}
          onPositionChange={(pos) => selectedElement && updateElementPosition(selectedElement, pos)}
          isVisible={isEditMode}
          t={t as (key: string) => string}
        />
      </div>
    </div>
  );
}
