import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel('PasswordReset') private readonly passResetModel: Model<any>,

  ){}
  async login(email, password) {
    let user = await this.usersService.getUserSens({email}, {});
    if (!user) {
      throw new HttpException(
        'User is not registered!',
        HttpStatus.FORBIDDEN,
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new HttpException(
        "Either password or email doesn't match up!",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      sub: user._id,
      sessionId: uuidv4(),
    };
    const access_token = this.jwtService.sign(payload);
    if (!user.sessions) {
      user.sessions = [payload.sessionId];
    } else {
      user.sessions.push(payload.sessionId);
    }

    user = await user.save();
    user.password = undefined;

    return {
      message: 'Logged in Successfully',
      data: {
        access_token,
        user,
      },
      status: 'Successful',
    };
  }

  async userLogout(user, token){
    const payload = this.jwtService.verify(token);
    const index = user.sessions.indexOf(payload.sessionId);
    user.sessions.splice(index,1);
    await user.save();
    return {
      message: "Logged out Successfully, current session deleted!!",
      data:{},
      status: "Successful",
    };
  }

  async changePassword(user, newPass, currentPass){

    const match = await bcrypt.compare(currentPass, user.password);

    if(match){
      user.password = await bcrypt.hash(newPass, 12);
      user.passwordUpdatedAt = new Date();
      user.sessions = [];
      await user.save();
      return true;
    }
    else{
      throw new HttpException('either email or password is wrong', HttpStatus.FORBIDDEN);
    }
  }

  async resetPasswordMail(email){
    const user = await this.usersService.getUserSens({email}, {});

    if(!user){
      throw new HttpException('User Doesn not Exists!', HttpStatus.NOT_FOUND)
    }

    const passCode = String(Math.floor(Math.random() * 90000) + 10000);

    const encryptedCode = await bcrypt.hash(passCode, 12);

    const existingRequest = await this.passResetModel.findOne({userId: user._id})

    if(existingRequest)
    {
      await this.passResetModel.deleteOne({userId: user._id});
    }
    const newRequest = new this.passResetModel({
      userId: user._id,
      createdAt: new Date(),
      passCode: encryptedCode,
    })
    await newRequest.save();

    return passCode;
  }

  async resetPassword(passCode:string, email, newPassword){
    const user = await this.usersService.getUserSens({email}, {});

    if(!user){
      throw new HttpException('User Doesn not Exists!', HttpStatus.NOT_FOUND)
    }

    const request = await this.passResetModel.findOne({userId: user._id});

    if(!request){
      throw new HttpException('No passwordReset request available', HttpStatus.BAD_REQUEST);
    }

    if(!(await bcrypt.compare(passCode, request.passCode))){
      throw new HttpException('Wrong PassCode!', HttpStatus.FORBIDDEN)
    }

    const expirationDate = new Date(request.createdAt.getTime() + 900000);
    const now = new Date();

    if (expirationDate < now){
      await this.passResetModel.deleteOne({userId: user._id});
      throw new HttpException(
        'resetPassword link expired, please generate another request', HttpStatus.FORBIDDEN
      )
    }
    const hash =  await bcrypt.hash(newPassword, 12);
    user.password = hash;
    user.sessions = [];
    user.passwordUpdatedAt = new Date();
    await user.save();

    await this.passResetModel.deleteOne({userId: user._id});

    return true;
  }

}
