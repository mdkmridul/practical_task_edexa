import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<any>,
    private readonly usersService : UsersService,
  ){}

  async createTask(user, dto){
    let task = new this.taskModel(dto);
    task.createdBy = user._id;

    task = await task.save({new: true});

    return {message: "Task Successfully created.", success: true, data: {task}};
  }

  async updateTask(user, dto, taskId){
    dto.assignee = dto.assignee ? await this.usersService.getUserSens({_id: dto.assignee}, {}) : dto.assignee;
    let task = await this.taskModel.findOne({_id: taskId});
    task.title = dto.title || task.title;
    task.description = dto.description || task.desccription;
    task.status = dto.status != undefined ? dto.status : task.status;
    task.dueDate = dto.dueDate ? new Date(dto.dueDate) : task.dueDate;
    task.assignee = dto.assignee || task.assignee;

    task = await task.save({new: true});



    return {data: {task}, success: true, message: "Task has been updated successfully."}
  }

  async getAllTasks(){
    const tasks = await this.taskModel.find().exec();

    return {data: {tasks}, success: true, message: ""};
  }

  async getMytasks(user){
    const tasks = await this.taskModel.find({assignee: user._id}).exec();

    return {data: {tasks}, success: true, message: ""};

  }

  async getTaskSingle(taskId){
    const task = await this.taskModel.findOne({_id: taskId}).exec();
    if(!task){
      throw new HttpException("No such task exists!", HttpStatus.BAD_REQUEST);
    }

    return {data: {task}, success: true, message: ""};
  }

  async deleteTask(taskId){
    const deleted = await this.taskModel.deleteOne({_id: taskId}).exec();
    if(deleted.n != 1){
      throw new HttpException("No such task exists to delete!", HttpStatus.BAD_REQUEST);
    }

    return {data: {}, message: "Task deleted successfully.", success: true};
  }
}
