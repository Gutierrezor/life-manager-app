import 'dotenv/config';
import {
  HabitFrequency,
  PrismaClient,
  ReminderStatus,
  TransactionType,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

const userId = 1;

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function atTime(date: Date, hours: number, minutes = 0) {
  const copy = new Date(date);
  copy.setHours(hours, minutes, 0, 0);
  return copy;
}

async function main() {
  const demoPassword = await bcrypt.hash('demo-password', 12);

  await prisma.habitLog.deleteMany({ where: { userId } });
  await prisma.financeTransaction.deleteMany({ where: { userId } });
  await prisma.financeCategory.deleteMany({ where: { userId } });
  await prisma.reminder.deleteMany({ where: { userId } });
  await prisma.calendarEvent.deleteMany({ where: { userId } });
  await prisma.note.deleteMany({ where: { userId } });
  await prisma.noteCategory.deleteMany({ where: { userId } });
  await prisma.habit.deleteMany({ where: { userId } });

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {
      name: 'Demo User',
      email: 'demo@lifemanager.local',
      password: demoPassword,
    },
    create: {
      id: userId,
      name: 'Demo User',
      email: 'demo@lifemanager.local',
      password: demoPassword,
    },
  });

  const personal = await prisma.noteCategory.create({
    data: {
      name: 'Personal',
      color: '#6366f1',
      userId: user.id,
    },
  });

  const work = await prisma.noteCategory.create({
    data: {
      name: 'Trabajo',
      color: '#14b8a6',
      userId: user.id,
    },
  });

  await prisma.note.createMany({
    data: [
      {
        title: 'Plan semanal',
        content: 'Revisar prioridades, calendario y presupuesto del mes.',
        isFavorite: true,
        userId: user.id,
        categoryId: personal.id,
      },
      {
        title: 'Ideas para el proyecto',
        content: 'Agregar filtros por categoria y busqueda rapida.',
        userId: user.id,
        categoryId: work.id,
      },
    ],
  });

  const today = daysFromNow(0);
  const tomorrow = daysFromNow(1);

  await prisma.calendarEvent.createMany({
    data: [
      {
        title: 'Revision de objetivos',
        description: 'Actualizar metas de la semana.',
        startDate: atTime(today, 9),
        endDate: atTime(today, 10),
        location: 'Casa',
        userId: user.id,
      },
      {
        title: 'Bloque de enfoque',
        description: 'Trabajo profundo sin interrupciones.',
        startDate: atTime(tomorrow, 14),
        endDate: atTime(tomorrow, 16),
        location: 'Oficina',
        userId: user.id,
      },
    ],
  });

  await prisma.reminder.createMany({
    data: [
      {
        title: 'Pagar servicios',
        description: 'Revisar facturas pendientes.',
        remindAt: atTime(daysFromNow(2), 8, 30),
        status: ReminderStatus.PENDING,
        userId: user.id,
      },
      {
        title: 'Enviar reporte',
        description: 'Compartir avance semanal.',
        remindAt: atTime(daysFromNow(1), 17),
        status: ReminderStatus.PENDING,
        userId: user.id,
      },
    ],
  });

  const hydration = await prisma.habit.create({
    data: {
      name: 'Tomar agua',
      description: 'Completar la meta diaria de hidratacion.',
      frequency: HabitFrequency.DAILY,
      goal: 8,
      color: '#0ea5e9',
      userId: user.id,
    },
  });

  const reading = await prisma.habit.create({
    data: {
      name: 'Leer',
      description: 'Leer al menos 20 minutos.',
      frequency: HabitFrequency.DAILY,
      goal: 1,
      color: '#f59e0b',
      userId: user.id,
    },
  });

  await prisma.habitLog.createMany({
    data: [
      {
        habitId: hydration.id,
        userId: user.id,
        date: atTime(daysFromNow(-2), 0),
        completed: true,
      },
      {
        habitId: hydration.id,
        userId: user.id,
        date: atTime(daysFromNow(-1), 0),
        completed: true,
      },
      {
        habitId: reading.id,
        userId: user.id,
        date: atTime(daysFromNow(-1), 0),
        completed: true,
      },
    ],
  });

  const salary = await prisma.financeCategory.create({
    data: {
      name: 'Salario',
      type: TransactionType.INCOME,
      color: '#22c55e',
      userId: user.id,
    },
  });

  const food = await prisma.financeCategory.create({
    data: {
      name: 'Comida',
      type: TransactionType.EXPENSE,
      color: '#ef4444',
      userId: user.id,
    },
  });

  const transport = await prisma.financeCategory.create({
    data: {
      name: 'Transporte',
      type: TransactionType.EXPENSE,
      color: '#8b5cf6',
      userId: user.id,
    },
  });

  await prisma.financeTransaction.createMany({
    data: [
      {
        type: TransactionType.INCOME,
        amount: 3500000,
        description: 'Ingreso mensual',
        transactionDate: daysFromNow(-5),
        userId: user.id,
        categoryId: salary.id,
      },
      {
        type: TransactionType.EXPENSE,
        amount: 85000,
        description: 'Mercado',
        transactionDate: daysFromNow(-3),
        userId: user.id,
        categoryId: food.id,
      },
      {
        type: TransactionType.EXPENSE,
        amount: 18000,
        description: 'Taxi',
        transactionDate: daysFromNow(-1),
        userId: user.id,
        categoryId: transport.id,
      },
    ],
  });

  console.log(`Seed completed for ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
