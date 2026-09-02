/* eslint-disable @typescript-eslint/no-redeclare */
export interface ITeachersRepository {
  findPublic(params: {
    specialty?: string;
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ items: any[]; total: number }>;
  findByIdOrCode(idOrCode: string): Promise<any | null>;
  create(teacher: {
    id: string;
    userId: string;
    teacherCode: string;
    bio?: string;
    specialties?: string[];
  }): Promise<any>;
  count(): Promise<number>;
}
export const ITeachersRepository = Symbol('ITeachersRepository');
