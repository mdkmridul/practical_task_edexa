import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RolesModule } from "src/roles/roles.module";
import { PasswordResetSchema } from "./schema/passwordReset.schema";
import { UserSchema } from "./schema/user.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    forwardRef(() => RolesModule),
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "PasswordReset", schema: PasswordResetSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
