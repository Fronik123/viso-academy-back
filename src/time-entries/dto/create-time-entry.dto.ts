import {
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export class CreateTimeEntryDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsNumber()
  @Min(0.01, { message: 'Hours must be a positive number' })
  @Max(24, { message: 'Hours cannot exceed 24 per day' })
  @IsNotEmpty()
  hours: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
