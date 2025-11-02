import { IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsDateString()
  taskTime?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}