import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Life@2026', 10);

  await prisma.user.upsert({
    where: { email: 'admin@life.app' },
    update: { password, fullName: 'Administrador' },
    create: {
      email: 'admin@life.app',
      password,
      fullName: 'Administrador',
    },
  });

  const expenseCount = await prisma.expense.count();
  if (expenseCount === 0) {
    await prisma.expense.createMany({
      data: [
        {
          title: 'Almuerzo',
          amount: 18000,
          category: 'FOOD',
          description: 'Comida en la oficina',
          expenseDate: new Date('2026-05-24T12:30:00.000Z'),
        },
        {
          title: 'Transporte',
          amount: 12000,
          category: 'TRANSPORT',
          description: 'Taxi a casa',
          expenseDate: new Date('2026-05-23T18:45:00.000Z'),
        },
      ],
    });
  }

  const incomeCount = await prisma.income.count();
  if (incomeCount === 0) {
    await prisma.income.createMany({
      data: [
        {
          title: 'Sueldo',
          amount: 2800000,
          source: 'Empresa principal',
          incomeDate: new Date('2026-05-25T08:00:00.000Z'),
        },
        {
          title: 'Venta online',
          amount: 420000,
          source: 'Mercado',
          incomeDate: new Date('2026-05-23T10:00:00.000Z'),
        },
      ],
    });
  }

  const habitCount = await prisma.habit.count();
  if (habitCount === 0) {
    await prisma.habit.createMany({
      data: [
        {
          name: 'Ejercicio matutino',
          description: '30 minutos de cardio o yoga cada mañana',
          status: 'PENDING',
          streak: 2,
          targetDays: 7,
        },
        {
          name: 'Leer 20 páginas',
          description: 'Lectura diaria antes de dormir',
          status: 'DONE',
          streak: 4,
          targetDays: 7,
          lastTrackedAt: new Date(),
        },
      ],
    });
  }

  const reminderCount = await prisma.reminder.count();
  if (reminderCount === 0) {
    await prisma.reminder.createMany({
      data: [
        {
          title: 'Revisar finanzas',
          description: 'Actualizar presupuesto semanal',
          remindAt: new Date('2026-05-26T09:00:00.000Z'),
          priority: 'HIGH',
        },
        {
          title: 'Enviar reporte',
          description: 'Envía el resumen del proyecto',
          remindAt: new Date('2026-05-27T11:00:00.000Z'),
          priority: 'MEDIUM',
        },
      ],
    });
  }

  const agendaCount = await prisma.agendaEvent.count();
  if (agendaCount === 0) {
    await prisma.agendaEvent.createMany({
      data: [
        {
          title: 'Reunión de planeación',
          description: 'Alineación de objetivos del mes',
          startTime: new Date('2026-05-28T10:00:00.000Z'),
          endTime: new Date('2026-05-28T11:00:00.000Z'),
          location: 'Sala de juntas',
        },
        {
          title: 'Tiempo de enfoque',
          description: 'Bloque de trabajo sin interrupciones',
          startTime: new Date('2026-05-29T14:00:00.000Z'),
          endTime: new Date('2026-05-29T16:00:00.000Z'),
        },
      ],
    });
  }

  console.log('Seed finalizado. Usuario de prueba: admin@life.app / Life@2026');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
