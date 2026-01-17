import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';

@Injectable()
export class TimeEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(createTimeEntryDto: CreateTimeEntryDto) {
    const date = new Date(createTimeEntryDto.date);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingEntries = await this.prisma.timeEntry.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const totalHoursForDay = existingEntries.reduce(
      (sum, entry) => sum + entry.hours,
      0,
    );

    if (totalHoursForDay + createTimeEntryDto.hours > 24) {
      throw new BadRequestException(
        `Total hours for this date cannot exceed 24. Current total: ${totalHoursForDay.toFixed(2)} hours, trying to add: ${createTimeEntryDto.hours} hours.`,
      );
    }

    return this.prisma.timeEntry.create({
      data: {
        date: startOfDay,
        project: createTimeEntryDto.project,
        hours: createTimeEntryDto.hours,
        description: createTimeEntryDto.description,
      },
    });
  }

  async findAll() {
    const entries = await this.prisma.timeEntry.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    const groupedByDate: Record<string, typeof entries> = {};

    entries.forEach((entry) => {
      const dateKey = entry.date.toISOString().split('T')[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(entry);
    });

    const grouped = Object.entries(groupedByDate).map(([date, dateEntries]) => {
      const totalHoursForDay = dateEntries.reduce(
        (sum, entry) => sum + entry.hours,
        0,
      );
      return {
        date,
        entries: dateEntries,
        totalHours: totalHoursForDay,
      };
    });

    const grandTotal = entries.reduce((sum, entry) => sum + entry.hours, 0);

    return {
      grouped,
      grandTotal,
    };
  }
}
