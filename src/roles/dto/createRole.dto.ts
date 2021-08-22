import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum Titles{
  'HR' = 'HR',
  'Manager' = 'Manager',
  'Team-Lead' = 'Team-Lead',
  'Employee' = 'Employee',
}

export class CreateRoleDto {
  @IsNotEmpty()
  @IsEnum(Titles)
  title: Titles;

  @IsNotEmpty()
  @IsArray()
  actions: [string];
}