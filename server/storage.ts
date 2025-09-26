import { type Teacher, type InsertTeacher } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getTeacher(id: string): Promise<Teacher | undefined>;
  getTeacherById(teacherId: string): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
}

export class MemStorage implements IStorage {
  private teachers: Map<string, Teacher>;

  constructor() {
    this.teachers = new Map();
  }

  async getTeacher(id: string): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async getTeacherById(teacherId: string): Promise<Teacher | undefined> {
    return Array.from(this.teachers.values()).find(
      (teacher) => teacher.teacherId === teacherId,
    );
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const id = randomUUID();
    const teacher: Teacher = { ...insertTeacher, id };
    this.teachers.set(id, teacher);
    return teacher;
  }
}

export const storage = new MemStorage();
