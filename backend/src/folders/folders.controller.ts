import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Controller('folders')
export class FoldersController {
  constructor(private folders: FoldersService) {}

  @Get()
  list() {
    return this.folders.list();
  }

  @Post()
  create(@Body() dto: CreateFolderDto) {
    return this.folders.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.folders.remove(Number(id));
  }
}
