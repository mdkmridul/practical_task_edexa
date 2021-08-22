import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { Actions } from 'src/auth/actions.decorator';
import { Action } from 'src/auth/actions.enum';
import { ActionsGuard } from 'src/auth/actions.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SignUpDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    return await this.userService.signUp(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    const { user } = req;
    return await this.userService.updateProfile(user, dto);
  }

  @UseGuards(JwtAuthGuard, ActionsGuard)
  @Get('all')
  @Actions(Action.Read)
  async getAllUsers() {
    return await this.userService.getusers();
  }

  @UseGuards(JwtAuthGuard, ActionsGuard)
  @Get('single/:user')
  @Actions(Action.Read)
  async getSingleUsers(@Param('user') userId: string) {
    return await this.userService.getSingleUser(userId);
  }

  @UseGuards(JwtAuthGuard, ActionsGuard)
  @Delete(':user')
  @Actions(Action.Delete)
  async deleteUser(@Param('user') userId: string) {
    return await this.userService.deleteUser(userId);
  }

  @UseGuards(JwtAuthGuard, ActionsGuard)
  @Patch('role/:user')
  @Actions(Action.Update)
  async updateRole(
    @Param('user') userId: string,
    @Body('roles') roles: [string],
  ) {
    return await this.userService.updateRole(roles, userId);
  }
}
