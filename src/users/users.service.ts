import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    @Inject(forwardRef(() => RolesService))private readonly rolesService: RolesService,
  ){}

  async getUserSens(args, projections){
    const user = await this.userModel.findOne(args, projections).select('+password').exec();
    return user;
  }

  async signUp(dto){
    let user = new this.userModel(dto);
    user.password = await bcrypt.hash(dto.password, 12);
    user = await user.save({new: true});
    user.password = undefined;

    return {data: {user}, message: "You have successfully signed up.", success: true};
  }

  async updateProfile(user, dto){
    user.name = dto.name || user.name;
    user.email = dto.email || user.email;

    user = await user.save({new: true});

    return {data: {user}, message: "Profile successfully updated.", success: true};
  }

  async getusers(){
    const users = await this.userModel.find().exec();
    return {data: {users}, message: "", success: true};
  }

  async getSingleUser(userId){
    const user = await this.userModel.findOne({_id: userId}).exec();

    return {data: {user}, message: "", success: true};
  }

  async deleteUser(userId){
    const deleted = await this.userModel.deleteOne({_id: userId}).exec();
    if(deleted.n != 1){
      throw new HttpException("No such user Exists!", HttpStatus.BAD_REQUEST);
    }

    return {data: {deleted}, message: "User successfully deleted", success: true};
  }

  async updateRole(roles, userId){
    let user = await this.userModel.findOne({_id: userId});

    roles = await this.rolesService.getRolesApp({title: {$in: roles}});
    let actions = [];
    const roleIds = []
    roles.forEach(element => {
      roleIds.push(String(element._id));
      actions.push(...(element.actions));
    })

    actions = [...new Set(actions)]

    user.roles = roleIds;
    user.actions = actions;
    user = await user.save({new: true});

    return {data: {}, message: "User's roles have successfully been updated", success: true};
  }

  async updateUsersRole(role){
    const users = await this.userModel.find({roles: role}).exec();
    for(let i=0; i < users.length; i++){
      await this.roleUserUpdateApp(users[i]);
    }
    return true;
  }

  async roleUserUpdateApp(user){
    const roles = await this.rolesService.getRolesApp({_id: user.roles});

    let actions = [];
    roles.forEach(element => {
      actions.push(...(element.actions));
    })

    actions = [...new Set(actions)]
    user.actions = actions;
    await user.save();
    return true;
  }
}
