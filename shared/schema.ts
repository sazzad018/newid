import { z } from "zod";

export const teacherSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  schoolName: z.string().min(1, "School name is required"),
  photoUrl: z.string().optional(),
  logoUrl: z.string().optional(),
});

export const cardTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  gradient: z.string(),
  textColor: z.string(),
});

export const qrCodeSettingsSchema = z.object({
  type: z.enum(["id", "full", "custom", "url"]),
  customText: z.string().optional(),
  size: z.number().min(60).max(120),
});

export const cardLayoutSchema = z.object({
  orientation: z.enum(["landscape", "portrait"]),
  borderRadius: z.number().min(0).max(24),
  fontFamily: z.string(),
});

export const batchSettingsSchema = z.object({
  cardsPerPage: z.number().min(1).max(8),
  outputFormat: z.enum(["pdf", "png", "zip"]),
});

export const elementPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const cardDataSchema = z.object({
  teacher: teacherSchema,
  template: cardTemplateSchema,
  qrSettings: qrCodeSettingsSchema,
  layout: cardLayoutSchema,
  elementPositions: z.record(z.string(), elementPositionSchema),
});

export type Teacher = z.infer<typeof teacherSchema>;
export type CardTemplate = z.infer<typeof cardTemplateSchema>;
export type QRCodeSettings = z.infer<typeof qrCodeSettingsSchema>;
export type CardLayout = z.infer<typeof cardLayoutSchema>;
export type BatchSettings = z.infer<typeof batchSettingsSchema>;
export type ElementPosition = z.infer<typeof elementPositionSchema>;
export type CardData = z.infer<typeof cardDataSchema>;

export const insertTeacherSchema = teacherSchema.omit({ id: true });
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
