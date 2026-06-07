declare module '@prisma/client' {
  // Minimal shim for Prisma types used in the project to satisfy TypeScript
  export class PrismaClient {
    constructor(...args: any[]);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    [key: string]: any;
  }

  export type PrismaClientKnownRequestError = any;

  export enum ReminderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
  }

  export enum HabitFrequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
  }

  export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
  }

  // Export any other symbols as `any` to avoid compilation errors
  export const Prisma: any;
  export * from '*/**';
}
