import { Body, Controller, Post, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRoleDto } from './dto/createRole.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ){}

  @Post()
  async createRole(
    @Body() dto: CreateRoleDto,
  ){
    return await this.rolesService.createRole(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':role')
  async updateRole(
    @Request() req,
    @Param('role') role: string,
    @Body('actions') actions: [string],
  ){
    const {user} = req;
    return await this.rolesService.updateRole(user, actions, role);
  }
}
