import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { ExpensesModule } from './expenses/expenses.module';
import { RemindersModule } from './reminders/reminders.module';
import { AgendaModule } from './agenda/agenda.module';

@Module({
  imports: [PrismaModule, TasksModule, ExpensesModule, RemindersModule, AgendaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
