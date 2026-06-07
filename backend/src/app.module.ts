import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { ExpensesModule } from './expenses/expenses.module';
import { RemindersModule } from './reminders/reminders.module';
import { AgendaModule } from './agenda/agenda.module';
import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { IncomesModule } from './incomes/incomes.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TasksModule,
    ExpensesModule,
    IncomesModule,
    RemindersModule,
    AgendaModule,
    HabitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
