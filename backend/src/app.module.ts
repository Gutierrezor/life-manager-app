import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RemindersModule } from './reminders/reminders.module';
import { NotesModule } from './notes/notes.module';
import { NoteCategoriesModule } from './note-categories/note-categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RemindersModule,
    NotesModule,
    NoteCategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
