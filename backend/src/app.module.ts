import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from 'src/config/database.config';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    // Load .env and make ConfigService global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseConfig,
    TasksModule,
  ],
})
export class AppModule {}