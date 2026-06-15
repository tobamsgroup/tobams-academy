import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      // No envFilePath — variables are injected via docker-compose env_file
      // or via shell environment in local dev. This works in both contexts.
    }),
  ],
})
export class ConfigModule {}
