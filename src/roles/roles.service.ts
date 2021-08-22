import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel('Role') private readonly roleModel: Model<any>,
    @Inject(forwardRef(() => UsersService))private readonly usersService: UsersService,
  ){}

  async getRolesApp(args){
    const roles = await this.roleModel.find(args).exec();
    return roles;
  }

  async createRole(dto){
    dto.actions = [...new Set(dto.actions)];
    let role = new this.roleModel(dto);
    role = await role.save({new: true});

    return {data: {role}, message: "Role successfully created.", success: true};
  }

  async updateRole(user, actions, role){
    let roles = await this.roleModel.find({_id: {$in: user.roles}}).exec();
    roles = roles.map(ele => ele.title);
    if(!roles.includes('HR')){
      throw new HttpException("You are not authorised to perform this task!", HttpStatus.FORBIDDEN);
    }
    role = await this.roleModel.findOne({title: role}).exec();
    actions = [...new Set(actions)];
    role.actions = actions;
    role = await role.save({new: true});

    const users = await this.usersService.updateUsersRole(role._id);

    return {data: {role}, message: "Role successfully updated.", success: true};
  }
}
