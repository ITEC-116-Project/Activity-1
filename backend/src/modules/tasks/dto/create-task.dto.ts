import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsDateString()
  taskTime: string;
}