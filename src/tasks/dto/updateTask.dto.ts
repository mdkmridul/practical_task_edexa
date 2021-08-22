import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsString()
  dueDate: string;

  @IsOptional()
  @IsString()
  assignee: string;
}