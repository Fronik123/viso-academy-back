import { Module } from '@nestjs/common';
import { TimeEntriesService } from './time-entry.service';
import { TimeEntriesController } from './time-entry.controller';

@Module({
  controllers: [TimeEntriesController],
  providers: [TimeEntriesService],
})
export class TimeEntriesModule {}
