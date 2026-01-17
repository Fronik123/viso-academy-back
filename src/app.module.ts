import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TimeEntriesModule } from './time-entries/time-entry.module';

@Module({
  imports: [PrismaModule, TimeEntriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
