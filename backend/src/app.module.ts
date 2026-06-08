import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RemindersModule } from './reminders/reminders.module';
import { NotesModule } from './notes/notes.module';
import { NoteCategoriesModule } from './note-categories/note-categories.module';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';
import { HabitsModule } from './habits/habits.module';
import { FinancesModule } from './finances/finances.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    RemindersModule,
    NotesModule,
    NoteCategoriesModule,
    CalendarEventsModule,
    HabitsModule,
    FinancesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
