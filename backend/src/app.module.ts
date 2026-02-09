import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FoldersModule } from './folders/folders.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [PrismaModule, FoldersModule, NotesModule],
})
export class AppModule {}
