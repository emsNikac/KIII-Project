import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.folder.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateFolderDto) {
    const name = (dto.name ?? '').trim();
    return this.prisma.folder.create({
      data: { name: name.length ? name : 'Untitled Folder' },
    });
  }

  async remove(id: number) {
    const folder = await this.prisma.folder.findUnique({ where: { id } });
    if (!folder) throw new NotFoundException('Folder not found');

    return this.prisma.folder.delete({ where: { id } });
  }
}
