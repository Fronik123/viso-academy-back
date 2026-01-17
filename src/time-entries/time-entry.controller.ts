import { Controller, Body } from '@nestjs/common';
import { TimeEntriesService } from './time-entry.service';

@Controller('time-entries')
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}
}
