import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ description: 'Contenido del archivo en base64' })
  @IsBase64()
  @IsNotEmpty()
  base64: string;

  @ApiProperty({ description: 'Nombre/key del archivo en S3' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ required: false, description: 'Content type del archivo' })
  @IsString()
  @IsOptional()
  contentType?: string;
}
