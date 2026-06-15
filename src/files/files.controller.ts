import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { UploadFileDto } from './dto/upload-file.dto';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  upload(@Body() dto: UploadFileDto) {
    return this.filesService.upload(dto);
  }

  @Get()
  @ApiQuery({ name: 'prefix', required: false })
  list(@Query('prefix') prefix?: string) {
    return this.filesService.list(prefix);
  }

  @Get(':key')
  async get(@Param('key') key: string, @Res() res: Response) {
    const file = await this.filesService.get(key);
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    (file.body as any).pipe(res);
  }

  @Delete(':key')
  delete(@Param('key') key: string) {
    return this.filesService.delete(key);
  }
}
