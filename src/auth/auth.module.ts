import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from 'src/config/config.service';
import { PasswordResetSchema } from 'src/users/schema/passwordReset.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: ConfigService.keys.JWT_SECRET,
      signOptions: { expiresIn: '6s' },
      verifyOptions: { ignoreExpiration: true },
    }),
    MongooseModule.forFeature([{name:"PasswordReset", schema: PasswordResetSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
