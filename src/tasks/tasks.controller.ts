import { Body, Controller, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ){}

  @Post()
  async createTask(
    @Request() req,
    @Body() dto: CreateTaskDto,
  ){
    const {user} = req;
    return await this.tasksService.createTask(user, dto);
  }

  @Patch(':task')
  async updateTask(
    @Request() req,
    @Param('task') taskId: string,
    @Body() dto: UpdateTaskDto,
  ){
    const {user} = req;
    return await this.tasksService.updateTask(user, dto, taskId)
  }

  @Get('all')
  async getAllTasks()
  {
    return await this.tasksService.getAllTasks();
  }

  @Get('my-tasks')
  async getMyTasks(
    @Request() req,
  ){
    const {user} = req;
    return await this.tasksService.getMytasks(user);
  }

  @Get('single/:task')
  async getSingleTask(
    @Param('task') taskId: string,
  ){
    return await this.tasksService.getTaskSingle(taskId);
  }
}
