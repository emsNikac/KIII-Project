import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller()
export class NotesController {
  constructor(private notes: NotesService) {}

  @Get('folders/:folderId/notes')
  listByFolder(@Param('folderId') folderId: string) {
    return this.notes.listByFolder(Number(folderId));
  }

  @Post('folders/:folderId/notes')
  create(@Param('folderId') folderId: string, @Body() dto: CreateNoteDto) {
    return this.notes.create(Number(folderId), dto);
  }

  @Put('notes/:id')
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.notes.update(Number(id), dto);
  }

  @Delete('notes/:id')
  remove(@Param('id') id: string) {
    return this.notes.remove(Number(id));
  }
}
