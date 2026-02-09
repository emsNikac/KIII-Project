import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  listByFolder(folderId: number) {
    return this.prisma.note.findMany({
      where: { folderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(folderId: number, dto: CreateNoteDto) {
    const folder = await this.prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder) throw new NotFoundException('Folder not found');

    const title = (dto.title ?? '').trim();
    const content = (dto.content ?? '').trim();

    return this.prisma.note.create({
      data: {
        folderId,
        title: title.length ? title : 'Untitled Note',
        content,
      },
    });
  }

  async update(noteId: number, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found');

    return this.prisma.note.update({
      where: { id: noteId },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
      },
    });
  }

  async remove(noteId: number) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found');

    return this.prisma.note.delete({ where: { id: noteId } });
  }
}
