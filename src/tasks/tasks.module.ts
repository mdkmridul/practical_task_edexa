import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { TaskSchema } from './schema/task.schema';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [UsersModule, MongooseModule.forFeature([{name: 'Task', schema: TaskSchema}])],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
